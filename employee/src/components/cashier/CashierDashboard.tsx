import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye, CheckCircle, Clock, XCircle, LogOut } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  date: string;
  paymentMethod: string;
}

export default function CashierDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage or use initial data
  useEffect(() => {
    const savedOrders = localStorage.getItem('cashier_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const initialOrders = [
        {
          id: 'ORD7F8K2M',
          customerName: 'เอกกี้ ขยี้ใจ',
          phone: '089-223-4555',
          total: 95.00,
          status: 'pending-verification',
          date: '2025-12-04 14:30',
          paymentMethod: 'QR Code'
        },
        {
          id: 'ORD9X2L5N',
          customerName: 'Jane Smith',
          phone: '085-652-3361',
          total: 78.00,
          status: 'pending-verification',
          date: '2025-12-04 15:15',
          paymentMethod: 'QR Code'
        },
        {
          id: 'ORDM4P8Q1',
          customerName: 'เบ้น เบ้นซ์',
          phone: '092-901-2523',
          total: 120.00,
          status: 'verified',
          date: '2025-12-04 13:45',
          paymentMethod: 'QR Code'
        },
        {
          id: 'ORDK7H3W9',
          customerName: 'นิววี่ วิ๊ดวิ้ว',
          phone: '063-345-6523',
          total: 85.00,
          status: 'verified',
          date: '2025-12-04 12:20',
          paymentMethod: 'QR Code'
        }
      ];
      setOrders(initialOrders);
      localStorage.setItem('cashier_orders', JSON.stringify(initialOrders));
    }
  }, []);

  const getStatusBadge = (status: string) => {
    const badges = {
      'pending-verification': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
        label: 'กำลังรอการยืนยัน'
      },
      'verified': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: 'ยืนยันสำเร็จ'
      },
      'rejected': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        label: 'ปฎิเสธ'
      }
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text} flex items-center gap-1 w-fit`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'กำลังรอการยืนยัน', value: orders.filter(o => o.status === 'pending-verification').length, color: 'bg-yellow-500' },
    { label: 'ยืนยันสำเร็จ', value: orders.filter(o => o.status === 'verified').length, color: 'bg-green-500' },
    { label: 'จำนวนคำสั่งซื้อ', value: orders.length, color: 'bg-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Cashier Dashboard</h1>
              <p className="text-sm text-gray-600">จัดการและยืนยันคำสั่งซื้อ</p>
            </div>
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

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                  {stat.value}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหารหัสคำสั่งซื้อ"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending-verification">กำลังรอ</option>
                <option value="verified">ยืนยันเรียบร้อย</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">รหัสคำสั่งซื้อ</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">ชื่อลูกค้า</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">จำนวน</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">สถานะ</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">วันที่สั่งซื้อ</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">เพิ่มเติม</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-blue-600">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ฿{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/cashier/order/${order.id}`, { state: { order } })}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
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
