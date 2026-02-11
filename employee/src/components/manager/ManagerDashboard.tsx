import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, DollarSign, Users, LogOut, ShoppingBag, Clock, Filter, Calendar, ChevronDown, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState } from 'react';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [dateRange, setDateRange] = useState('today');
  const [orderStatus, setOrderStatus] = useState('all');
  const [productType, setProductType] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [stockStatus, setStockStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');

  const stats = [
    { label: 'ยอดขายวันนี้', value: '฿1,245', change: '+12%', color: 'bg-blue-500', icon: DollarSign },
    { label: 'คำสั่งซื้อวันนี้', value: '24', change: '+8%', color: 'bg-green-500', icon: ShoppingBag },
    { label: 'คำสั่งซื้อที่รอดำเนินการ', value: '7', change: '-15%', color: 'bg-yellow-500', icon: Clock },
    { label: 'สินค้าที่ขายอยู่', value: '42', change: '0%', color: 'bg-purple-500', icon: Package }
  ];

  const salesData = [
    { day: 'จ.', sales: 850 },
    { day: 'อ.', sales: 920 },
    { day: 'พ.', sales: 1100 },
    { day: 'พฤ.', sales: 890 },
    { day: 'ศ.', sales: 1300 },
    { day: 'ส.', sales: 1500 },
    { day: 'อา.', sales: 1200 }
  ];

  const topProducts = [
    { name: 'ช่อกุหลาบสีชมพู', sales: 45, revenue: '฿2,025' },
    { name: 'ช่อทานตะวัน', sales: 38, revenue: '฿1,444' },
    { name: 'ช่อทิวลิป', sales: 32, revenue: '฿1,344' },
    { name: 'กล้วยไม้สีขาว', sales: 28, revenue: '$1,540' }
  ];

  const recentOrders = [
    { id: 'ORD7F8K2M', customer: 'นายมาโนช โหด', amount: '฿95.00', status: 'กำลังจัดเตรียม', time: '10 นาทีที่แล้ว' },
    { id: 'ORD9X2L5N', customer: 'อดัม อะไร', amount: '฿78.00', status: 'จัดส่งแล้ว', time: '25 นาทีที่แล้ว' },
    { id: 'ORDM4P8Q1', customer: 'ไมค์ ไหมไทย', amount: '฿120.00', status: 'กำลังจัดส่ง', time: '1 ชั่วโมงที่แล้ว' }
  ];

  const clearAllFilters = () => {
    setDateRange('today');
    setOrderStatus('all');
    setProductType('all');
    setPaymentStatus('all');
    setStockStatus('all');
    setSelectedProduct('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Branch Manager Dashboard</h1>
              <p className="text-sm text-gray-600">สาขาพิจิตร</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-500 text-white' : 'bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>ฟิลเตอร์</span>
              </button>
              <button
                onClick={() => navigate('/manager/promotions')}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                โปรโมชั่น
              </button>
              <button
                onClick={() => navigate('/manager/products')}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                จัดการสินค้า
              </button>
              <button
                onClick={() => navigate('/manager/orders')}
                className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
              >
                ดูคำสั่งซื้อ
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-gray-900">ตัวกรองข้อมูล</h3>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                ล้างทั้งหมด
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">ช่วงเวลา</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="today">วันนี้</option>
                  <option value="yesterday">เมื่อวาน</option>
                  <option value="this-week">สัปดาห์นี้</option>
                  <option value="this-month">เดือนนี้</option>
                  <option value="this-year">ปีนี้</option>
                  <option value="custom">กำหนดเอง</option>
                </select>
              </div>

              {/* Order Status Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">สถานะออเดอร์</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="pending-payment">รอชำระเงิน</option>
                  <option value="pending-verification">รอตรวจสลิป</option>
                  <option value="preparing">กำลังจัดเตรียม</option>
                  <option value="ready-for-delivery">รอจัดส่ง</option>
                  <option value="delivered">จัดส่งสำเร็จ</option>
                  <option value="failed">จัดส่งไม่สำเร็จ</option>
                </select>
              </div>

              {/* Product Type Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">ประเภทสินค้า</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="bouquet">ช่อดอกไม้</option>
                  <option value="vase">แจกัน</option>
                  <option value="top-selling">สินค้าขายดี</option>
                </select>
              </div>

              {/* Specific Product Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">สินค้าเฉพาะ</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="1">ช่อกุหลาบสีชมพู</option>
                  <option value="2">ช่อทานตะวัน</option>
                  <option value="3">ช่อทิวลิป</option>
                  <option value="4">กล้วยไม้สีขาว</option>
                </select>
              </div>

              {/* Payment Verification Status Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">สถานะการตรวจสลิป</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="verified">ผ่าน</option>
                  <option value="rejected">ไม่ผ่าน</option>
                  <option value="pending">รอตรวจ</option>
                </select>
              </div>

              {/* Stock Status Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">สถานะสต็อก</label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="available">พร้อมขาย</option>
                  <option value="unavailable">ปิดขาย</option>
                  <option value="low-stock">สต็อกต่ำ</option>
                  <option value="out-of-stock">หมดสต็อก</option>
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            <div className="mt-6 flex flex-wrap gap-2">
              {dateRange !== 'today' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  ช่วงเวลา: {dateRange === 'yesterday' ? 'เมื่อวาน' : dateRange === 'this-week' ? 'สัปดาห์นี้' : dateRange === 'this-month' ? 'เดือนนี้' : dateRange === 'this-year' ? 'ปีนี้' : 'กำหนดเอง'}
                  <button onClick={() => setDateRange('today')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {orderStatus !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  สถานะ: {orderStatus}
                  <button onClick={() => setOrderStatus('all')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {productType !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  ประเภทสินค้า: {productType === 'bouquet' ? 'ช่อดอกไม้' : productType === 'vase' ? 'แจกัน' : 'สินค้าขายดี'}
                  <button onClick={() => setProductType('all')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 
                  stat.change.startsWith('-') ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl mb-4 text-gray-900">ยอดขายรายสัปดาห์</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4DA3FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl mb-4 text-gray-900">สินค้ายอดนิยม</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{product.name}</p>
                    <p className="text-sm text-gray-600">ขายได้ {product.sales} ชิ้น</p>
                  </div>
                  <p className="text-lg text-blue-600">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl text-gray-900">คำสั่งซื้อล่าสุด</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">รหัสคำสั่งซื้อ</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">ชื่อลูกค้า</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">ยอดเงิน</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">สถานะ</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">เวลา</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'จัดส่งแล้ว' ? 'bg-green-100 text-green-800' :
                        order.status === 'กำลังจัดส่ง' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}