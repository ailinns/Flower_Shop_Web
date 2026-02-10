require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;


const multer = require("multer");
const { is } = require('express/lib/request');

const upload = multer(); // memory storage

// Enable CORS
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'flower_shop_db',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});


app.get("/api/regions", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT region_id, region_name FROM region ORDER BY region_name"
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Regions API Error:', err.message);
    res.status(500).json({ 
      error: 'Failed to load regions',
      detail: err.message 
    });
  }
});

app.get("/api/branches", async (req, res) => {
  try {
    let query = `
      SELECT b.branch_id, b.branch_name, p.province_name, r.region_id, r.region_name
      FROM branch b
      JOIN province p ON b.province_id = p.province_id
      JOIN region r ON p.region_id = r.region_id
    `;
    const params = [];

    // ถ้าส่ง region_id มา ให้กรองเฉพาะที่ภาคนั้น
    if (req.query.region_id) {
      query += " WHERE r.region_id = ?";
      params.push(req.query.region_id);
    }

    query += " ORDER BY b.branch_name";
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Branches API Error:', err.message);
    res.status(500).json({ 
      error: 'Failed to load branches',
      detail: err.message 
    });
  }
});

// VASES: products where product_type_id corresponds to vase (default 2)
app.get('/api/vases', async (req, res) => {
  try {
    const productTypeId = Number(req.query.product_type_id || 2);
    const [rows] = await pool.query(
      'SELECT product_id, product_name, product_price AS price, product_type_id FROM product WHERE product_type_id = ? ORDER BY product_name',
      [productTypeId]
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Vases API Error:', err.message);
    res.status(500).json({ error: 'Failed to load vases', detail: err.message });
  }
});

// Vase colors
app.get('/api/vase-colors', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT vase_color_id, vase_color_name AS color_name, hex FROM vase_color ORDER BY vase_color_id');
    res.json(rows);
  } catch (err) {
    console.error('❌ Vase Colors API Error:', err.message);
    res.status(500).json({ error: 'Failed to load vase colors', detail: err.message });
  }
});

// Flower types
app.get('/api/flower-types', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT flower_type_id AS flower_id, flower_name FROM flower_type ORDER BY flower_name');
    res.json(rows);
  } catch (err) {
    console.error('❌ Flower Types API Error:', err.message);
    res.status(500).json({ error: 'Failed to load flower types', detail: err.message });
  }
});

// Create order (transactional)
app.post('/api/orders', async (req, res) => {
  const payload = req.body || {};
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Generate unique order code ORD########
    const genOrderCode = async () => {
      while (true) {
        const n = Math.floor(10000000 + Math.random() * 90000000);
        const code = `ORD${n}`;
        const [r] = await conn.query('SELECT 1 FROM `order` WHERE order_code = ?', [code]);
        if (r.length === 0) return code;
      }
    };
    const orderCode = await genOrderCode();

    // Resolve branch_id
    let branchId = payload.branch_id ?? null;
    if (!branchId && payload.branch) {
      const [brows] = await conn.query('SELECT branch_id FROM branch WHERE branch_name = ? LIMIT 1', [payload.branch]);
      if (brows.length) branchId = brows[0].branch_id;
    }

    // Insert or find customer by phone
    const customer = payload.customer || {};
    let customerId = null;
    if (customer.phone) {
      const [found] = await conn.query('SELECT customer_id FROM customer WHERE phone = ? LIMIT 1', [customer.phone]);
      if (found.length > 0) customerId = found[0].customer_id;
    }
    if (!customerId) {
      const [insCust] = await conn.query('INSERT INTO customer (customer_name, phone, points) VALUES (?, ?, ?)', [customer.name || null, customer.phone || null, (payload.total_amount/100)]);
      customerId = insCust.insertId;
    }

    // province for address
    // let provinceId = null;
    // if (payload.receiver && payload.receiver.province_id) provinceId = payload.receiver.province_id;
    // else {
       const [p] = await conn.query('SELECT province_id FROM province WHERE province_id = ?', [payload.branch_id]);
       provinceId = p.length ? p[0].province_id : null;
    // }

    // Insert customer_address
    const receiver = payload.receiver || {};
    await conn.query(
      'INSERT INTO customer_address (customer_id, province_id, receiver_name, receiver_phone, receiver_address) VALUES (?, ?, ?, ?, ?)',
      [customerId, provinceId, receiver.name || customer.name || null, receiver.phone || customer.phone || null, receiver.address || (payload.pickup ? 'ที่ร้าน' : null)]
    );

    // Insert order
    const [insOrder] = await conn.query(
      'INSERT INTO `order` (branch_id, customer_id, promotion_id, customer_note, order_code, order_status, total_amount, florist_photo_url, rider_photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [branchId, customerId, payload.promotion_id || null, payload.customer_note || null, orderCode, 'received', payload.total_amount || 0, null, null]
    );
    const orderId = insOrder.insertId;
    
    // Insert payment if provided
    if (payload.payment) {
      // use provided slip_image or generate a random placeholder filename
      const slipImage = payload.payment;
      const slipType = payload.method;
      if (slipType === 'cash') {
        await conn.query('INSERT INTO payment (payment_method_id,order_id) VALUES (?,?)', [1, orderId]);
      } else if (slipType === 'credit') {
         const [insPayment] = await conn.query('INSERT INTO payment (payment_method_id,order_id) VALUES (?,?)', [3, orderId]);
         await conn.query('INSERT INTO payment_card_evidence (payment_id, trans_ref, card_last4, card_brand, created_at) VALUES (?, ?, ?, ?, NOW())', [insPayment.insertId, "23asd", slipImage, "Visa"]);
      } else {
        const [insPayment] = await conn.query('INSERT INTO payment (payment_method_id,order_id) VALUES (?,?)', [2, orderId]);
        await conn.query('INSERT INTO payment_evidence (payment_id, trans_ref, sender_name, bank, slip_time, raw_response, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())', [insPayment.insertId, slipImage.transRef, slipImage.sender.displayName, slipImage.sendingBank, slipImage.transTimestamp, JSON.stringify(slipImage)]);
      }
      
    }

    // Insert shopping_cart items and customizations
    if (Array.isArray(payload.items)) {
      for (const it of payload.items) {
        const [insCart] = await conn.query('INSERT INTO shopping_cart (order_id, product_id, qty, price_total) VALUES (?, ?, ?, ?)', [orderId, it.product_id, it.qty || 1, it.price_total || 0]);
        await conn.query('UPDATE branch_product SET stock_qty = stock_qty - 1, is_available = CASE WHEN stock_qty - 1 <= 0 THEN 0 ELSE 1 END WHERE branch_id = ? AND product_id = ?', [branchId, it.product_id]);
        const shoppingCartId = insCart.insertId;
        if (it.bouquet_style_id) {
          await conn.query('INSERT INTO bouquet_customization (shopping_cart_id, bouquet_style_id) VALUES (?, ?)', [shoppingCartId, it.bouquet_style_id]);
        }
        if (it.vase_color_id) {
          await conn.query('INSERT INTO vase_customization (shopping_cart_id, vase_color_id) VALUES (?, ?)', [shoppingCartId, it.vase_color_id]);
        }
        if (Array.isArray(it.flowers)) {
          for (const ftId of it.flowers) {
            await conn.query('INSERT INTO flower_detail (shopping_cart_id, flower_type_id) VALUES (?, ?)', [shoppingCartId, ftId]);
          }
        }
      }
    }

    await conn.commit();
    res.json({ order_id: orderId, order_code: orderCode });
  } catch (err) {
    await conn.rollback().catch(() => {});
    console.error('❌ Create Order Error:', err.message);
    res.status(500).json({ error: 'Failed to create order', detail: err.message });
  } finally {
    conn.release();
  }
});

app.post("/check-slips", upload.single("files"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("files", new Blob([req.file.buffer]), req.file.originalname);

    const r = await fetch("https://api.slipok.com/api/line/apikey/51649", {
      method: "POST",
      headers: {
        "x-authorization": "SLIPOKVLZ8JSO",
      },
      body: form,
    });

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

app.post("/api/orders/search", async (req, res) => {
  
  try {
    const { order_code } = req.body;
    if (!order_code || typeof order_code !== "string") {
      return res.status(400).json({ message: "order_code ไม่ถูกต้อง" });
    }
    
    const [rows] = await pool.execute(
  `
  SELECT 
    o.*,
    b.branch_name,
    ca.receiver_name,
    ca.receiver_phone,
    ca.receiver_address
  FROM \`order\` o
  JOIN branch b ON b.branch_id = o.branch_id
  JOIN customer_address ca ON ca.customer_id = o.customer_id
  WHERE o.order_code = ?
  `,
  [order_code]
);
    const [carts] = await pool.execute(
      `
  SELECT 
    sc.*,
    pr.product_name,
    pt.product_type_name,
    GROUP_CONCAT(ft.flower_name ORDER BY ft.flower_name SEPARATOR ', ') AS flowers,
    vco.vase_color_name

  FROM \`shopping_cart\` sc
  JOIN product pr ON pr.product_id = sc.product_id
  JOIN product_type pt ON pt.product_type_id = pr.product_type_id
  LEFT JOIN flower_detail fd ON fd.shopping_cart_id = sc.shopping_cart_id
  LEFT JOIN flower_type ft ON ft.flower_type_id = fd.flower_type_id
  LEFT JOIN vase_customization vc ON vc.shopping_cart_id = sc.shopping_cart_id
  LEFT JOIN vase_color vco ON vco.vase_color_id = vc.vase_color_id
  WHERE sc.order_id = ?
  GROUP BY 
  sc.shopping_cart_id,
  pr.product_name;
  `,
      [rows[0].order_id]
    );

    const list = rows;
    if (list.length === 0) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    return res.json({
      message: "พบคำสั่งซื้อ",
      order: list[0],
      records: carts,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/check-dupslip", async (req, res) => {
  try {
    const { text } = req.body;

    const [rows] = await pool.query(
      "SELECT 1 FROM payment_evidence WHERE trans_ref = ? LIMIT 1",
      [text]
    );

    if (rows.length > 0) {
      // มีข้อมูลแล้ว
      return res.json({ exists: false });
    } else {
      // ยังไม่มี
      return res.json({ exists: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/check-stocks", async (req, res) => {
  try {
    const is_available = true;
    const orders = req.body;
    for (const item of orders.cart) {
      //console.log(`สินค้าชิ้นที่ ${index + 1}:`, item.productId,`สาขาที่ :`, orders.selectedBranchId);
      const [rows] = await pool.query(
        "SELECT bp.stock_qty FROM branch_product bp WHERE product_id = ? AND branch_id = ?",
        [item.productId, orders.selectedBranchId]
      );
      if (rows[0].stock_qty <= 0) {
        is_available = false;
      }
      
      // console.log(`ผลลัพธ์สินค้าคงเหลือที่:`, rows[0].stock_qty);
      // if (rows[0].stock_qty <= 0) {
      //   is_available = false;
      //   break
      // }
      };
    return res.json({ is_available : is_available });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(PORT, () => console.log(`✅ API listening on http://localhost:${PORT}`));