import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Package, CheckCircle, XCircle, Upload, Camera } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

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

export default function RiderDeliveryDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const [delivery, setDelivery] = useState<Delivery | null>(location.state?.delivery || null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [failureReason, setFailureReason] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  // Load delivery from localStorage if not passed via state
  useEffect(() => {
    if (!delivery && orderId) {
      const savedDeliveries = localStorage.getItem('rider_deliveries');
      if (savedDeliveries) {
        const deliveries = JSON.parse(savedDeliveries);
        const foundDelivery = deliveries.find((d: Delivery) => d.id === orderId);
        if (foundDelivery) {
          setDelivery(foundDelivery);
        }
      }
    }
  }, [orderId, delivery]);

  const productImage = 'https://images.unsplash.com/photo-1672243691196-9b7f64cce1c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';

  const deliveryTimeline = [
    { label: 'คำสั่งซื้อ', status: 'completed', time: 'Dec 4, 2:30 PM' },
    { label: 'ยืนยันคำสั่งซื้อ', status: 'completed', time: 'Dec 4, 2:45 PM' },
    { label: 'เตรียมจัดสินค้า', status: 'completed', time: 'Dec 4, 3:30 PM' },
    { label: 'มอบหมายจัดส่ง', status: 'completed', time: 'Dec 4, 3:45 PM' },
    { label: 'กำลังจัดส่ง', status: delivery?.status === 'delivered' ? 'completed' : 'current', time: delivery?.status === 'delivered' ? 'Completed' : 'In Progress' },
    { label: 'จัดส่งสำเร็จ', status: delivery?.status === 'delivered' ? 'completed' : 'pending', time: delivery?.deliveredTime || '' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofImage(e.target.files[0]);
    }
  };

  const handleMarkDelivered = () => {
    if (!delivery) return;

    if (proofImage) {
      // Update delivery status in localStorage
      const savedDeliveries = localStorage.getItem('rider_deliveries');
      if (savedDeliveries) {
        const deliveries = JSON.parse(savedDeliveries);
        const currentTime = new Date().toLocaleString('th-TH', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        
        const updatedDeliveries = deliveries.map((d: Delivery) => 
          d.id === delivery.id 
            ? { ...d, status: 'delivered', deliveredTime: currentTime } 
            : d
        );
        localStorage.setItem('rider_deliveries', JSON.stringify(updatedDeliveries));
        
        setShowSuccessModal(false);
        toast.success('จัดส่งสำเร็จ', {
          description: `คำสั่งซื้อ ${delivery.id} จัดส่งสำเร็จแล้ว`
        });
        
        setTimeout(() => {
          navigate('/rider/dashboard');
        }, 1000);
      }
    } else {
      toast.error('กรุณาอัปโหลดรูปภาพ', {
        description: 'ต้องอัปโหลดหลักฐานการจัดส่งก่อน'
      });
    }
  };

  const handleMarkFailed = () => {
    if (!delivery || !failureReason.trim()) return;

    // Update delivery status in localStorage
    const savedDeliveries = localStorage.getItem('rider_deliveries');
    if (savedDeliveries) {
      const deliveries = JSON.parse(savedDeliveries);
      const updatedDeliveries = deliveries.map((d: Delivery) => 
        d.id === delivery.id 
          ? { ...d, status: 'failed' } 
          : d
      );
      localStorage.setItem('rider_deliveries', JSON.stringify(updatedDeliveries));
      
      setShowFailureModal(false);
      toast.error('จัดส่งล้มเหลว', {
        description: `เหตุผล: ${failureReason}`
      });
      
      setTimeout(() => {
        navigate('/rider/dashboard');
      }, 1000);
    }
  };

  if (!delivery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">ไม่พบข้อมูลการจัดส่ง</h2>
          <p className="text-gray-600 mb-6">ไม่พบข้อมูลที่คุณต้องการดู</p>
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>กลับสู่หน้าหลัก</span>
          </button>
          <h1 className="text-2xl text-gray-900">รายละเอียดการจัดส่ง</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900">ข้อมูลการจัดส่ง</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">รหัสคำสั่งซื้อ :</span>
                  <span className="text-blue-600">{delivery.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ระยะ :</span>
                  <span className="text-gray-900">{delivery.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">เวลาประมาณ :</span>
                  <span className="text-gray-900">{delivery.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">สถานะ :</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    delivery.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                    delivery.status === 'in-transit' ? 'bg-yellow-100 text-yellow-800' :
                    delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {delivery.status === 'assigned' ? 'พร้อมจัดส่ง' :
                     delivery.status === 'in-transit' ? 'ระหว่างจัดส่ง' :
                     delivery.status === 'delivered' ? 'จัดส่งสำเร็จ' : 'จัดส่งล้มเหลว'}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900">รายละเอียดลูกค้า</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ชื่อ</p>
                  <p className="text-gray-900">{delivery.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    เบอร์โทร
                  </p>
                  <a href={`tel:${delivery.phone}`} className="text-blue-600 hover:underline">
                    {delivery.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    ที่อยู่จัดส่ง
                  </p>
                  <p className="text-gray-900">{delivery.address}</p>
                  <button className="mt-2 text-blue-600 hover:underline text-sm">
                    เปิดในแผนที่ →
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5" />
                รายการสินค้า
              </h2>
              <div className="flex gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={productImage}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-gray-900">{delivery.items}</p>
                  <p className="text-sm text-gray-600 mt-1">พร้อมจัดส่ง</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900">สถานะรายการ</h2>
              <div className="space-y-4">
                {deliveryTimeline.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-500' 
                          : step.status === 'current'
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-gray-300'
                      }`}>
                        {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-white" />}
                      </div>
                      {index < deliveryTimeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${
                          step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className={`${
                        step.status === 'pending' ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {step.label}
                      </h4>
                      <p className="text-sm text-gray-600">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Proof */}
            {delivery.status !== 'delivered' && delivery.status !== 'failed' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl mb-4 text-gray-900 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  หลักฐานการจัดส่ง
                </h2>
                <div className="border-4 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="proof-image"
                  />
                  <label htmlFor="proof-image" className="cursor-pointer">
                    {proofImage ? (
                      <div className="flex flex-col items-center gap-3">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                        <p className="text-gray-900">{proofImage.name}</p>
                        <p className="text-sm text-gray-500">คลิ๊กเพื่อเปลี่ยน</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-700">อัปโหลดหลักฐานการจัดส่ง</p>
                        <p className="text-sm text-gray-500">รูปภาพสินค้าจัดส่ง</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {delivery.status !== 'delivered' && delivery.status !== 'failed' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl mb-4 text-gray-900">ทำเครื่องหมายจัดส่ง</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowSuccessModal(true)}
                    disabled={!proofImage}
                    className={`w-full py-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                      proofImage
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    จัดส่งสำเร็จ
                  </button>
                  <button
                    onClick={() => setShowFailureModal(true)}
                    className="w-full py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    จัดส่งล้มเหลว
                  </button>
                </div>
              </div>
            )}

            {delivery.status === 'delivered' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">จัดส่งสำเร็จ</h3>
                  <p className="text-gray-600">รายการนี้จัดส่งเรียบร้อยแล้ว</p>
                </div>
              </div>
            )}

            {delivery.status === 'failed' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">จัดส่งล้มเหลว</h3>
                  <p className="text-gray-600">รายการนี้จัดส่งไม่สำเร็จ</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">ยืนยันการจัดส่ง?</h3>
              <p className="text-gray-600 mb-6">
                 เมื่อยืนยันระบบจะแจ้งไปยังลูกค้า
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleMarkDelivered}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Failure Modal */}
      {showFailureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl mb-4 text-gray-900">รายงานการจัดส่งล้มเหลว</h3>
            <p className="text-gray-600 mb-4">กรุณาระบุเหตุผล :</p>
            <textarea
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              placeholder="ตัวอย่าง: ลูกค้าไม่อยู่, ที่อยู่ผิด..."
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowFailureModal(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleMarkFailed}
                disabled={!failureReason.trim()}
                className={`flex-1 py-3 rounded-xl transition-colors ${
                  failureReason.trim()
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ส่งรายงาน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
