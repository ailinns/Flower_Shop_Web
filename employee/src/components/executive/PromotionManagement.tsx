import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Calendar, Plus, Edit2, Trash2, TrendingUp, Users, DollarSign, X } from 'lucide-react';
import { useState } from 'react';

export default function ExecutivePromotionManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'scheduled' | 'expired'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    discount: ''
  });

  const allPromotions = [
    {
      id: 'PROMO001',
      code: 'ROSE20',
      name: 'ส่วนลด 20% ช่อกุหลาบ',
      description: 'ลด 20% สำหรับช่อกุหลาบทุกแบบ',
      startDate: '2025-12-20',
      endDate: '2025-12-31',
      minAmount: 500,
      discount: 20,
      totalUsage: 187,
      totalDiscount: '฿12,480',
      status: 'active'
    },
    {
      id: 'PROMO002',
      code: 'FREESHIP',
      name: 'ฟรีค่าส่ง',
      description: 'ฟรีค่าจัดส่งสำหรับคำสั่งซื้อขั้นต่ำ ฿800',
      startDate: '2025-12-01',
      endDate: '2025-12-31',
      minAmount: 800,
      discount: 100,
      totalUsage: 456,
      totalDiscount: '฿22,800',
      status: 'active'
    },
    {
      id: 'PROMO003',
      code: 'FLOWER30',
      name: 'ส่วนลด 30% ดอกไม้',
      description: 'ลด 30% สำหรับช่อดอกไม้ทุกชนิด',
      startDate: '2025-12-15',
      endDate: '2025-12-28',
      minAmount: 300,
      discount: 30,
      totalUsage: 92,
      totalDiscount: '฿5,980',
      status: 'active'
    },
    {
      id: 'PROMO004',
      code: 'NEWYEAR30',
      name: 'ปีใหม่ลด 30%',
      description: 'ส่วนลดพิเศษ 30% ฉลองปีใหม่',
      startDate: '2026-01-01',
      endDate: '2026-01-03',
      minAmount: 0,
      discount: 30,
      totalUsage: 0,
      totalDiscount: '฿0',
      status: 'scheduled'
    },
    {
      id: 'PROMO005',
      code: 'XMAS25',
      name: 'คริสต์มาส ลด 25%',
      description: 'ส่วนลดพิเศษช่วงคริสต์มาส',
      startDate: '2025-12-23',
      endDate: '2025-12-25',
      minAmount: 300,
      discount: 25,
      totalUsage: 534,
      totalDiscount: '฿33,450',
      status: 'expired'
    }
  ];

  const stats = [
    { 
      label: 'โปรโมชั่นทั้งหมด', 
      value: allPromotions.length.toString(), 
      color: 'bg-blue-500', 
      icon: Tag 
    },
    { 
      label: 'ยอดส่วนลดรวม (เดือนนี้)', 
      value: '฿74,710', 
      color: 'bg-green-500', 
      icon: DollarSign 
    },
    { 
      label: 'จำนวนการใช้ (เดือนนี้)', 
      value: '1,269', 
      color: 'bg-purple-500', 
      icon: Users 
    },
    { 
      label: 'อัตราการใช้เฉลี่ย', 
      value: '42%', 
      color: 'bg-orange-500', 
      icon: TrendingUp 
    }
  ];

  const filteredPromotions = activeTab === 'all' ? allPromotions :
                             allPromotions.filter(p => p.status === activeTab);

  const handleCreatePromotion = () => {
    console.log('Creating promotion:', formData);
    setShowCreateModal(false);
    // Reset form
    setFormData({
      code: '',
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      discount: ''
    });
  };

  const handleEditPromotion = () => {
    console.log('Editing promotion:', formData);
    setShowEditModal(false);
    setEditingPromo(null);
  };

  const handleDeletePromotion = (promoId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบโปรโมชั่นนี้?')) {
      console.log('Deleting promotion:', promoId);
    }
  };

  const openEditModal = (promo: any) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      name: promo.name,
      description: promo.description,
      startDate: promo.startDate,
      endDate: promo.endDate,
      minAmount: promo.minAmount.toString(),
      discount: promo.discount.toString()
    });
    setShowEditModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">ใช้งานอยู่</span>;
      case 'scheduled':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">กำหนดการ</span>;
      case 'expired':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">หมดอายุ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/executive/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl text-gray-900">จัดการโปรโมชั่น</h1>
                <p className="text-sm text-gray-600">สร้างและจัดการโปรโมชั่นทั้งหมด</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              สร้างโปรโมชั่นใหม่
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'all'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ทั้งหมด ({allPromotions.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'active'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ใช้งานอยู่ ({allPromotions.filter(p => p.status === 'active').length})
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'scheduled'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                กำหนดการ ({allPromotions.filter(p => p.status === 'scheduled').length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'expired'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                หมดอายุ ({allPromotions.filter(p => p.status === 'expired').length})
              </button>
            </div>
          </div>

          {/* Promotions List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredPromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-sm font-mono">
                          {promo.code}
                        </span>
                        <h3 className="text-lg text-gray-900">{promo.name}</h3>
                        {getStatusBadge(promo.status)}
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          -{promo.discount}%
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{promo.description}</p>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>เริ่ม: {new Date(promo.startDate).toLocaleDateString('th-TH')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <span>สิ้นสุด: {new Date(promo.endDate).toLocaleDateString('th-TH')}</span>
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-600">ยอดขั้นต่ำ:</span> ฿{promo.minAmount}
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-600">ส่วนลด:</span> {promo.discount}%
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">ใช้งาน: {promo.totalUsage} ครั้ง</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">ส่วนลดรวม: {promo.totalDiscount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(promo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePromotion(promo.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl text-gray-900">
                {showCreateModal ? 'สร้างโปรโมชั่นใหม่' : 'แก้ไขโปรโมชั่น'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingPromo(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">โค้ดส่วนลด</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
                  placeholder="ROSE20"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">ชื่อโปรโมชั่น</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="ส่วนลด 20% ช่อกุหลาบ"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">รายละเอียด</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="ลด 20% สำหรับช่อกุหลาบทุกแบบ"
                />
              </div>

              {/* Date Range */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">วันที่เริ่มต้น</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Min Amount and Discount */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">ยอดขั้นต่ำ (฿)</label>
                  <input
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">ส่วนลด (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="20"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingPromo(null);
                }}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={showCreateModal ? handleCreatePromotion : handleEditPromotion}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showCreateModal ? 'สร้างโปรโมชั่น' : 'บันทึกการแก้ไข'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
