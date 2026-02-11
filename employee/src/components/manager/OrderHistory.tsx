import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, Calendar, Filter } from 'lucide-react';

export default function OrderHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: 'ORD7F8K2M',
      date: '2025-12-04 14:30',
      customer: 'เจมส์ วงศ์',
      phone: '089-223-4555',
      items: 'ช่อกุหลาบสีชมพู x2',
      total: 95.00,
      status: 'จัดส่งแล้ว',
      payment: 'โอนเงิน'
    },
    {
      id: 'ORD9X2L5N',
      date: '2025-12-04 15:15',
      customer: 'เจน สมิธ',
      phone: '085-652-3361',
      items: 'ช่อทานตะวัน x1',
      total: 78.00,
      status: 'กำลังจัดส่ง',
      payment: 'QR Code'
    },
    {
      id: 'ORDM4P8Q1',
      date: '2025-12-04 13:45',
      customer: 'ไมค์ จอห์น',
      phone: '092-901-2523',
      items: 'ช่อทิวลิป x3',
      total: 120.00,
      status: 'จัดส่งแล้ว',
      payment: 'QR Code'
    },
    {
      id: 'ORDK7H3W9',
      date: '2025-12-04 12:20',
      customer: 'ซาร่า บราวน์',
      phone: '063-345-6523',
      items: 'กล้วยไม้สีขาว x1',
      total: 85.00,
      status: 'จัดส่งแล้ว',
      payment: 'บัตรเครดิต'
    },
    {
      id: 'ORDP2N5M8',
      date: '2025-12-03 16:45',
      customer: 'ทอม วิลสัน',
      phone: '055-789-0123',
      items: 'แจกันแก้ว x2',
      total: 50.00,
      status: 'จัดส่งแล้ว',
      payment: 'โอนเงิน'
    },
    {
      id: 'ORDF9K3L1',
      date: '2025-12-03 11:30',
      customer: 'เอมิลี่ เดวิส',
      phone: '055-234-5678',
      items: 'ช่อกุหลาบสีชมพู x1',
      total: 45.00,
      status: 'ยกเลิก',
      payment: 'QR Code'
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'จัดส่งแล้ว': 'bg-green-100 text-green-800',
      'กำลังจัดส่ง': 'bg-blue-100 text-blue-800',
      'กำลังจัดเตรียม': 'bg-yellow-100 text-yellow-800',
      'ยกเลิก': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/manager/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>กลับสู่แดชบอร์ด</span>
          </button>
          <h1 className="text-2xl text-gray-900">ประวัติคำสั่งซื้อ</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">จำนวนคำสั่งซื้อทั้งหมด</p>
            <p className="text-3xl text-gray-900">{filteredOrders.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">ยอดรวมทั้งหมด</p>
            <p className="text-3xl text-blue-600">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">คำสั่งซื้อที่เสร็จสมบูรณ์</p>
            <p className="text-3xl text-green-600">
              {filteredOrders.filter(o => o.status === 'จัดส่งแล้ว').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาด้วยรหัสคำสั่งซื้อหรือชื่อลูกค้า..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
                <option value="กำลังจัดเตรียม">กำลังจัดเตรียม</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
              <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>ส่งออก</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">รหัสคำสั่งซื้อ</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">วันที่และเวลา</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">ลูกค้า</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">รายการ</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">ช่องทางชำระเงิน</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">ยอดรวม</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-blue-600">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.payment}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">ไม่พบคำสั่งซื้อ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}