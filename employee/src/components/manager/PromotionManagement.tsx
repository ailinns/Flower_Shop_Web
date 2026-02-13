import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Calendar, TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import { useState } from 'react';

export default function PromotionManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'expired'>('active');

  const promotions = {
    active: [
      {
        id: 'PROMO001',
        code: 'ROSE20',
        name: 'ส่วนลด 20% ช่อกุหลาบ',
        description: 'ลด 20% สำหรับช่อกุหลาบทุกแบบ',
        startDate: '2025-12-20',
        endDate: '2025-12-31',
        minAmount: 500,
        discount: 20,
        usageCount: 45,
        totalDiscount: '฿2,340'
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
        usageCount: 123,
        totalDiscount: '฿6,150'
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
        usageCount: 28,
        totalDiscount: '฿1,820'
      }
    ],
    scheduled: [
      {
        id: 'PROMO004',
        code: 'NEWYEAR30',
        name: 'ปีใหม่ลด 30%',
        description: 'ส่วนลดพิเศษ 30% ฉลองปีใหม่',
        startDate: '2026-01-01',
        endDate: '2026-01-03',
        minAmount: 0,
        discount: 30,
        usageCount: 0,
        totalDiscount: '฿0'
      }
    ],
    expired: [
      {
        id: 'PROMO005',
        code: 'XMAS25',
        name: 'คริสต์มาส ลด 25%',
        description: 'ส่วนลดพิเศษช่วงคริสต์มาส',
        startDate: '2025-12-23',
        endDate: '2025-12-25',
        minAmount: 300,
        discount: 25,
        usageCount: 156,
        totalDiscount: '฿9,750'
      }
    ]
  };

  const stats = [
    { 
      label: 'โปรโมชั่นที่ใช้งานอยู่', 
      value: promotions.active.length.toString(), 
      color: 'bg-green-500', 
      icon: Tag 
    },
    { 
      label: 'ยอดส่วนลดรวม (เดือนนี้)', 
      value: '฿10,310', 
      color: 'bg-blue-500', 
      icon: DollarSign 
    },
    { 
      label: 'จำนวนการใช้ (เดือนนี้)', 
      value: '196', 
      color: 'bg-purple-500', 
      icon: Users 
    },
    { 
      label: 'อัตราการใช้เฉลี่ย', 
      value: '38%', 
      color: 'bg-orange-500', 
      icon: TrendingUp 
    }
  ];

  const togglePromotion = (promoId: string) => {
    console.log('Toggle promotion:', promoId);
    // In real app, this would update the database
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'free-shipping':
        return <TrendingUp className="w-4 h-4" />;
      case 'bundle':
        return <Tag className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'bg-blue-100 text-blue-800';
      case 'free-shipping':
        return 'bg-green-100 text-green-800';
      case 'bundle':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const currentPromotions = activeTab === 'active' ? promotions.active : 
                           activeTab === 'scheduled' ? promotions.scheduled : 
                           promotions.expired;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/manager/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl text-gray-900">จัดการโปรโมชั่น</h1>
                <p className="text-sm text-gray-600">สาขาพิจิตร</p>
              </div>
            </div>
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
                onClick={() => setActiveTab('active')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'active'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ใช้งานอยู่ ({promotions.active.length})
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'scheduled'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                กำหนดการ ({promotions.scheduled.length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'expired'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                หมดอายุ ({promotions.expired.length})
              </button>
            </div>
          </div>

          {/* Promotions List */}
          <div className="p-6">
            <div className="space-y-4">
              {currentPromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-gray-900">{promo.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getTypeBadgeColor(promo.type)}`}>
                          {getTypeIcon(promo.type)}
                          {promo.type === 'percentage' ? 'ส่วนลด %' : 
                           promo.type === 'free-shipping' ? 'ฟรีค่าส่ง' : 
                           'แพ็คเกจ'}
                        </span>
                        {promo.value > 0 && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            -{promo.value}%
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{promo.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>เริ่ม: {new Date(promo.startDate).toLocaleDateString('th-TH')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <span>สิ้นสุด: {new Date(promo.endDate).toLocaleDateString('th-TH')}</span>
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-600">ขั้นต่ำ:</span> {promo.minAmount} ฿
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-600">ส่วนลด:</span> {promo.discount}%
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">ใช้งาน: {promo.usageCount} ครั้ง</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">ส่วนลดรวม: {promo.totalDiscount}</span>
                        </div>
                      </div>
                    </div>

                    {activeTab === 'active' && (
                      <div className="ml-4">
                        <button
                          onClick={() => togglePromotion(promo.id)}
                          className={`p-3 rounded-lg transition-colors ${
                            promo.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title={promo.isActive ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'}
                        >
                          {promo.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar for Active Promotions */}
                  {activeTab === 'active' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>ความคืบหน้า</span>
                        <span>{Math.round((promo.usageCount / 200) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((promo.usageCount / 200) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {currentPromotions.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">ไม่มีโปรโมชั่นในหมวดนี้</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-2">หมายเหตุ</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• โปรโมชั่นทั้งหมดถูกกำหนดโดยผู้บริหาร</li>
                <li>• คุณสามารถเปิด/ปิดการใช้งานโปรโมชั่นในสาขาของคุณได้</li>
                <li>• ข้อมูลการใช้งานจะอัพเดทแบบเรียลไทม์</li>
                <li>• หากต้องการสร้างโปรโมชั่นใหม่ กรุณาติดต่อผู้บริหาร</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}