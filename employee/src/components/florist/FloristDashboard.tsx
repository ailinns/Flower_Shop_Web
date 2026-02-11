import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Clock, CheckCircle, Package } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  items: string;
  status: string;
  assignedTime: string;
  dueTime: string;
  completedTime?: string;
}

export default function FloristDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage or use initial data
  useEffect(() => {
    const savedOrders = localStorage.getItem('florist_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const initialOrders = [
        {
          id: 'ORD7F8K2M',
          customerName: 'เอกกี้ ขยี้ใจ',
          items: 'ช่อดอกไม้ กุหลาบ ดาวเรือง (กลาง) x2',
          status: 'preparing',
          assignedTime: '2025-12-04 15:00',
          dueTime: '2025-12-04 17:00'
        },
        {
          id: 'ORD9X2L5N',
          customerName: 'กวางซี่ ปีซ่า',
          items: 'แจกัน ดอกเดซี่ (ใหญ่) x1',
          status: 'preparing',
          assignedTime: '2025-12-04 15:30',
          dueTime: '2025-12-04 18:00'
        },
        {
          id: 'ORDM4P8Q1',
          customerName: 'เปาเป๊า เป๋าเปา',
          items: 'ช่อดอกไม้ ทิวลิป (กลาง) x3',
          status: 'ready',
          assignedTime: '2025-12-04 14:00',
          dueTime: '2025-12-04 16:30',
          completedTime: '2025-12-04 16:15'
        }
      ];
      setOrders(initialOrders);
      localStorage.setItem('florist_orders', JSON.stringify(initialOrders));
    }
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'อยู่ระหว่างจัดเตรียม', value: orders.filter(o => o.status === 'preparing').length, color: 'bg-yellow-500', icon: Clock },
    { label: 'พร้อมจัดส่ง', value: orders.filter(o => o.status === 'ready').length, color: 'bg-green-500', icon: CheckCircle },
    { label: 'รายการจัดเตรียม', value: orders.length, color: 'bg-blue-500', icon: Package }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      'preparing': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'กำลังจัดเตรียม' },
      'ready': { bg: 'bg-green-100', text: 'text-green-800', label: 'พร้อมจัดส่ง' }
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Florist Dashboard</h1>
              <p className="text-sm text-gray-600">จัดเตรียมดอกไม้</p>
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
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหารหัสคำสั่งซื้อ"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/florist/order/${order.id}`, { state: { order } })}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl text-blue-600 mb-1">{order.id}</h3>
                  <p className="text-gray-900">{order.customerName}</p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">รายการสินค้า :</p>
                <p className="text-gray-900">{order.items}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">วันที่สั่งซื้อ :</span>
                  <span className="text-gray-900">{order.assignedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">วันครบกำหนด :</span>
                  <span className="text-gray-900">{order.dueTime}</span>
                </div>
                {order.completedTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">สำเร็จ :</span>
                    <span className="text-green-600">{order.completedTime}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                {getStatusBadge(order.status)}
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  รายละเอียดคำสั่งซื้อ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
