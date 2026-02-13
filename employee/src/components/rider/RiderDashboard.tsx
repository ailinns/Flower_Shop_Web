import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Package, CheckCircle, Clock, MapPin, Truck } from 'lucide-react';

interface Delivery {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  items: string;
  status: string;
  distance: string;
  estimatedTime?: string;
  deliveredTime?: string;
}

export default function RiderDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  // Load deliveries from localStorage or use initial data
  useEffect(() => {
    const savedDeliveries = localStorage.getItem('rider_deliveries');
    if (savedDeliveries) {
      setDeliveries(JSON.parse(savedDeliveries));
    } else {
      const initialDeliveries = [
        {
          id: 'ORD7F8K2M',
          customerName: 'เอกกี้ ขยี้ใจ',
          address: '153 ต.อะไรเนี่ย อ.ว้ะฮู้ว จ.ยะเฮ้ย 63999',
          phone: '089-223-4555',
          items: 'ช่อดอกไม้ กุหลาบ ดาวเรือง (กลาง) x2',
          status: 'assigned',
          distance: '2.5 กม.',
          estimatedTime: '15 นาที'
        },
        {
          id: 'ORD9X2L5N',
          customerName: 'มาลาเกด้อน มาลอนเกด้า',
          address: '99/1 ต.พลูโต อ.ยูเรนัส จ.สุริยะ 99999',
          phone: '088-352-4052',
          items: 'ดอกไม้สุดเจ๋ง x1',
          status: 'assigned',
          distance: '4.2 กม.',
          estimatedTime: '25 นาที'
        },
        {
          id: 'ORDM4P8Q1',
          customerName: 'ฟองดุว สู้ๆ',
          address: '62/5 ต.ชาติไรนะ อ.ไทย จ.อิอิ 53200',
          phone: '093-111-3234',
          items: 'แจกันสุดโหด x2',
          status: 'delivered',
          distance: '3.1 กม.',
          deliveredTime: '2025-12-04 16:45'
        }
      ];
      setDeliveries(initialDeliveries);
      localStorage.setItem('rider_deliveries', JSON.stringify(initialDeliveries));
    }
  }, []);

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeFilter = statusFilter === 'all' 
    ? filteredDeliveries 
    : filteredDeliveries.filter(d => d.status === statusFilter);

  const stats = [
    { 
      label: 'มอบหมาย', 
      value: deliveries.filter(d => d.status === 'assigned').length, 
      color: 'bg-blue-500',
      icon: Package
    },
    { 
      label: 'ระหว่างจัดส่ง', 
      value: deliveries.filter(d => d.status === 'in-transit').length, 
      color: 'bg-yellow-500',
      icon: Truck
    },
    { 
      label: 'จัดส่งสำเร็จ', 
      value: deliveries.filter(d => d.status === 'delivered').length, 
      color: 'bg-green-500',
      icon: CheckCircle
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      'assigned': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'พร้อมจัดส่ง' },
      'in-transit': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'ระหว่างจัดส่ง' },
      'delivered': { bg: 'bg-green-100', text: 'text-green-800', label: 'จัดส่งสำเร็จ' },
      'failed': { bg: 'bg-red-100', text: 'text-red-800', label: 'จัดส่งล้มเหลว' }
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
              <h1 className="text-2xl text-gray-900">Rider Dashboard</h1>
              <p className="text-sm text-gray-600">จัดการเตรียมจัดส่งสินค้า</p>
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

        {/* Deliveries List */}
        <div className="space-y-4">
          {activeFilter.map(delivery => (
            <div
              key={delivery.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/rider/delivery/${delivery.id}`, { state: { delivery } })}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl text-blue-600 mb-1">{delivery.id}</h3>
                      <p className="text-gray-900">{delivery.customerName}</p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(delivery.status)}
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{delivery.address}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📞 {delivery.phone}</span>
                      <span>📦 {delivery.items}</span>
                    </div>
                  </div>

                  {delivery.status === 'assigned' && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">ระยะ : <span className="text-blue-600">{delivery.distance}</span></span>
                      <span className="text-gray-600">ประมาณเวลา : <span className="text-blue-600">{delivery.estimatedTime}</span></span>
                    </div>
                  )}

                  {delivery.deliveredTime && (
                    <div className="text-sm text-green-600">
                      จัดส่งเมื่อ {delivery.deliveredTime}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div>
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors whitespace-nowrap">
                    รายละเอียด
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
