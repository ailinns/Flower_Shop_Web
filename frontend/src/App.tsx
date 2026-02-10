import { useState } from 'react';
import { type FlowerType as DbFlowerType } from './api/flower.api';
import { BouquetStyleSelection } from './components/BouquetStyleSelection';
import { BranchSelection } from './components/BranchSelection';
import { Cart } from './components/Cart';
import { DeliveryInfo } from './components/DeliveryInfo';
import { FlowerTypeSelection } from './components/FlowerTypeSelection';
import { Home } from './components/Home';
import { OrderComplete } from './components/OrderComplete';
import { OrderTracking } from './components/OrderTracking';
import { Payment } from './components/Payment';
import { PriceColorSelection } from './components/PriceColorSelection';
import { ProductTypeSelection } from './components/ProductTypeSelection';
import { SnowEffect } from './components/SnowEffect';

export type ProductType = 'bouquet' | 'vase';
export type BouquetStyle = 'round' | 'long';
export type FlowerColor = string;
export type FlowerType = 'rose' | 'lily' | 'tulip' | 'orchid' | 'sunflower' | 'samadihae';



export interface CartItem {
  id: string;
  productType: ProductType;
  bouquetStyle?: number; // bouquet_style_id (1 = round, 2 = long)
  price: number;
  color: FlowerColor;
  flowerTypes: FlowerType[];
  imageUrl: string;
  productId?: number | null;
  vaseColorId?: number | null;
  flowerTypeIds?: number[];
}

export interface OrderData {
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  address: string;
  phone: string;
  branch: number | null;
  deliveryType: 'pickup' | 'delivery';
  cardMessage?: string;
}

type Step = 
    'home'
  | 'branch' 
  | 'productType' 
  | 'bouquetStyle' 
  | 'priceColor' 
  | 'flowerType' 
  | 'cart' 
  | 'payment' 
  | 'delivery' 
  | 'complete'
  | 'tracking';

export default function App() {
  const [step, setStep] = useState<Step>('home');
  const [branchId, setBranchId] = useState<number | null>(null);
  const [productType, setProductType] = useState<ProductType>('bouquet');
  const [bouquetStyle, setBouquetStyle] = useState<BouquetStyle>('round');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedColor, setSelectedColor] = useState<FlowerColor>('pink');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedBouquetStyle, setSelectedBouquetStyle] = useState<number | null>(null);
  const [selectedVaseColorId, setSelectedVaseColorId] = useState<number | null>(null);
  const [selectedFlowerTypes, setSelectedFlowerTypes] = useState<FlowerType[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [savedOrders, setSavedOrders] = useState<OrderData[]>([]);

   
  const handleProduct = () => {
    setStep('productType');
  };

  const handleProductTypeSelect = (type: ProductType) => {
    setProductType(type);
    if (type === 'bouquet') {
      setStep('priceColor');
    } else {
      setStep('priceColor');
    }
  };

  const handleBouquetStyleSelect = (style: BouquetStyle) => {
    setBouquetStyle(style);
    setStep('priceColor');
    // Fetch bouquet data with product_type_id = 1
    fetchBouquetData(1);
  };

  const fetchBouquetData = async (productTypeId: number) => {
    try {
        const response = await fetch(`${API_BASE}/bouquets/${productTypeId}`);
        const data = await response.json();
        // Process the bouquet data as needed
        console.log(data);
    } catch (error) {
        console.error('Error fetching bouquet data:', error);
    }
  };

  const handlePriceColorSelect = (price: number, color: FlowerColor, productId?: number | null, bouquetStyleId?: number | null) => {
    setSelectedPrice(price);
    setSelectedColor(color);
    setSelectedProductId(productId ?? null);
    // For vase: bouquetStyleId will be vaseColorId, for bouquet: it's the actual style ID
    if (productType === 'bouquet') {
      setSelectedBouquetStyle(bouquetStyleId ?? null);
    } else {
      setSelectedVaseColorId(bouquetStyleId ?? null);
    }
    setStep('flowerType');
  };

  const handleFlowerTypeSelect = (dbFlowerTypes: DbFlowerType[]) => {
    // Map database flower names to FlowerType enum values
    const flowerNameToType: Record<string, FlowerType> = {
      'กุหลาบ': 'rose',
      'ลิลลี่': 'lily',
      'ทิวลิป': 'tulip',
      'กล้วยไม้': 'orchid',
      'ทานตะวัน': 'sunflower',
      'ดอกซามาดิเฮ้': 'samadihae',
    };
    
    const flowerTypes: FlowerType[] = dbFlowerTypes
      .map(f => flowerNameToType[f.flower_name])
      .filter((ft): ft is FlowerType => ft !== undefined);
    
    setSelectedFlowerTypes(flowerTypes);
    const newItem: CartItem = {
      id: Date.now().toString(),
      productType,
      bouquetStyle: productType === 'bouquet' ? selectedBouquetStyle ?? undefined : undefined,
      price: selectedPrice,
      color: selectedColor,
      flowerTypes: flowerTypes,
      productId: selectedProductId ?? undefined,
      vaseColorId: selectedVaseColorId ?? undefined,
      flowerTypeIds: dbFlowerTypes.map(f => f.flower_id),
      imageUrl: getProductImageUrl(),
    };
    setCart([...cart, newItem]);
    setStep('cart');
  };

  const getProductImageUrl = () => {
    if (productType === 'vase') {
      return 'https://images.unsplash.com/photo-1646487134240-7262dfc8a830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG93ZXIlMjB2YXNlJTIwYXJyYW5nZW1lbnR8ZW58MXx8fHwxNzY0NjUwNjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }
    if (bouquetStyle === 'round') {
      return 'https://images.unsplash.com/photo-1612796495278-65e44b09325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3VuZCUyMGZsb3dlciUyMGJvdXF1ZXR8ZW58MXx8fHwxNzY0NjcyNjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }
    return 'https://images.unsplash.com/photo-1762394947969-b798082075fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25nJTIwZmxvd2VyJTIwYm91cXVldHxlbnwxfHx8fDE3NjQ2NzI2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  };



  const handleAddMoreItems = () => {
    setStep('productType');
  };

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleToDelivery = () => {
    setStep('delivery');
  }


  // Determine API base (use VITE env if provided, otherwise use localhost:3000 for dev)
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : '');
  
  const [Sendername, setSendername] = useState<string | null>(null);
  const [Senderaddress, setSenderaddress] = useState<string | null>(null);
  const [Senderphone, setSenderphone] = useState<string | null>(null);
  const [Deliverytype, setDeliverytype] = useState<'pickup' | 'delivery'>('delivery');
  const [Cardmessage, setCardmessage] = useState<string | undefined>(undefined);

  const handleDeliveryConfirm = (name: string, address: string, phone: string, deliveryType: 'pickup' | 'delivery',selectedBranchId: number, cardMessage?: string) => {
    setSendername(name);
    setSenderaddress(address);
    setSenderphone(phone);
    setDeliverytype(deliveryType);
    setCardmessage(cardMessage);
    setBranchId(selectedBranchId);
    setStep('payment');
  }
  const AssigeToDatabase = (slipOkData: JSON) => {
    (async () => {
      try {
        // validate cart items have productId (database product_id required)
        const missingProduct = cart.find(it => !it.productId);
        if (missingProduct) {
          throw new Error('พบสินค้าที่ยังไม่มี product_id จากการเลือก โปรดเลือกรายการใหม่อีกครั้ง');
        }
        console.log("Submitting",slipOkData)
        console.log("Submitting method",slipOkData.method)
        const payload: any = {
          branch_id: branchId || null,
          pickup: Deliverytype === 'pickup',
          promotion_id: null,
          customer: { name: Sendername, phone: Senderphone },
          receiver: { name: Sendername, phone: Senderphone, address: Deliverytype === 'pickup' ? 'ที่ร้าน' : Senderaddress },
          customer_note: Cardmessage || null,
          total_amount: cart.reduce((sum, item) => sum + item.price, 0),
          payment: slipOkData.data,
          method: slipOkData.method ,
          items: cart.map((it) => ({
            product_id: (it as any).productId,
            qty: 1,
            price_total: it.price,
            bouquet_style_id: it.productType === 'bouquet' ? it.bouquetStyle : undefined,
            vase_color_id: it.productType === 'vase' ? it.vaseColorId : undefined,
            flowers: (it as any).flowerTypeIds || []
          }))
        };

        const url = API_BASE ? `${API_BASE}/api/orders` : '/api/orders';
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        let data: any = null;
        const contentType = resp.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await resp.json();
        } else {
          const txt = await resp.text();
          // surface non-JSON response for debugging
          throw new Error(`Server returned non-JSON response (status ${resp.status}): ${txt.slice(0,200)}`);
        }
        if (!resp.ok) throw new Error(data?.detail || data?.error || 'Failed to create order');
        const order: OrderData = {
          orderId: data.order_code || `ORD${Date.now().toString().slice(-8)}`,
          items: cart,
          totalAmount: payload.total_amount,
          customerName: Sendername,
          address: Senderaddress,
          phone: Senderphone,
          branch: branchId,
          deliveryType: Deliverytype,
          cardMessage: Cardmessage,
        };
        setOrderData(order);
        setSavedOrders([...savedOrders, order]);
        // optionally clear cart
        setCart([]);
        setStep('complete');
      } catch (err: any) {
        console.error('Order create failed', err);
        alert('ไม่สามารถบันทึกคำสั่งซื้อได้: ' + (err.message || err));
      }
    })();
  };

  const handleBackToHome = () => {
    setBranchId(null);
    setProductType('bouquet');
    setBouquetStyle('round');
    setSelectedPrice(0);
    setSelectedColor('pink');
    setSelectedFlowerTypes([]);
    setCart([]);
    setOrderData(null);
    setStep('home');
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleCheckOrder = () => {
    setStep('tracking');
  };

  function handleBranchSelect(branchId: number): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-white">
      <SnowEffect />
      {step === 'home' && (
        <Home
          onNext={handleProduct}
          onCheckOrder={() => setStep('tracking')}
        />
      )}
      {step === 'branch' && (
        <BranchSelection 
          onNext={handleBranchSelect}
          onCheckOrder={() => setStep('tracking')}
        />
      )}
      {step === 'productType' && (
        <ProductTypeSelection onSelect={handleProductTypeSelect} />
      )}
      {step === 'bouquetStyle' && (
        <BouquetStyleSelection onSelect={handleBouquetStyleSelect} />
      )}
      {step === 'priceColor' && (
        <PriceColorSelection
          productType={productType}
          bouquetStyle={bouquetStyle}
          onSelect={handlePriceColorSelect}
        />
      )}
      {step === 'flowerType' && (
        <FlowerTypeSelection
          productType={productType}
          bouquetStyle={bouquetStyle}
          price={selectedPrice}
          color={selectedColor}
          imageUrl={getProductImageUrl()}
          onFlowerTypeSelect={handleFlowerTypeSelect}
        />
      )}
      {step === 'cart' && (
        <Cart
          items={cart}
          onAddMore={handleAddMoreItems}
          onCheckout={handleToDelivery}
          onRemove={handleRemoveFromCart}
        />
      )}
      {step === 'payment' && (
        <Payment
          totalAmount={cart.reduce((sum, item) => sum + item.price, 0)}
          onConfirm={(slipFile) => {
      // slipFile คือ File object ที่ได้จาก Payment
      console.log('Payment slip:', slipFile);
      console.log('method',slipFile.method);
      console.log('data qr',slipFile.data);
      AssigeToDatabase(slipFile);
      
    }}
          onCancel={() => setStep('cart')}
        />
      )}
      {step === 'delivery' && (
        <DeliveryInfo
          cartItems={cart}
          orderId={`ORD${Date.now().toString().slice(-8)}`}
          onConfirm={handleDeliveryConfirm}
        />
      )}
      {step === 'complete' && orderData && (
        <OrderComplete
          orderId={orderData.orderId}
          onCheckOrder={handleCheckOrder}
          onBackToHome={handleBackToHome}
        />
      )}
      {step === 'tracking' && (
        <OrderTracking
          savedOrders={savedOrders}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}
