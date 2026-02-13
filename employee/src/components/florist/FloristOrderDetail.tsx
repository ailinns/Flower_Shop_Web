import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Upload, Image as ImageIcon, XCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface Order {
  id: string;
  customerName: string;
  items: string;
  status: string;
  assignedTime: string;
  dueTime: string;
  completedTime?: string;
}

export default function FloristOrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(location.state?.order || null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Load order from localStorage if not passed via state
  useEffect(() => {
    if (!order && orderId) {
      const savedOrders = localStorage.getItem('florist_orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const foundOrder = orders.find((o: Order) => o.id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      }
    }
  }, [orderId, order]);

  const preparationSteps = [
    { id: 1, title: 'เตรียมดอกไม้', description: 'ดอกไม้พร้อมประกอบ' },
    { id: 2, title: 'เตรียมอุปกรณ์', description: 'ช่อ/แจกัน' },
    { id: 3, title: 'จัดดอกไม้', description: 'การจัดช่อดอกไม้' },
    { id: 4, title: 'ตกแต่งสินค้า', description: 'เพิ่มโบว์ ข้อความการ์ด' },
    { id: 5, title: 'ตรวจสอบคุณภาพสินค้า', description: 'ขั้นตอนสุดท้ายเตรียมจัดส่ง' }
  ];

  const toggleStep = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const handleComplete = () => {
    if (!order) return;

    if (completedSteps.length === preparationSteps.length && uploadedImage) {
      // Update order status in localStorage
      const savedOrders = localStorage.getItem('florist_orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const currentTime = new Date().toLocaleString('th-TH', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        
        const updatedOrders = orders.map((o: Order) => 
          o.id === order.id 
            ? { ...o, status: 'ready', completedTime: currentTime } 
            : o
        );
        localStorage.setItem('florist_orders', JSON.stringify(updatedOrders));
        
        toast.success('จัดเตรียมดอกไม้สำเร็จ', {
          description: `คำสั่งซื้อ ${order.id} พร้อมจัดส่งแล้ว`
        });
        
        setTimeout(() => {
          navigate('/florist/dashboard');
        }, 1000);
      }
    } else {
      toast.error('กรุณาทำตามขั้นตอนให้ครบถ้วน', {
        description: 'กรุณาทำตามขั้นตอนทั้งหมดและอัพโหลดรูปถ่ายก่อนดำเนินการ'
      });
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">ไม่พบคำสั่งซื้อ</h2>
          <p className="text-gray-600 mb-6">ไม่พบรหัสคำสั่งซื้อที่คุณต้องการดู</p>
          <button
            onClick={() => navigate('/florist/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  const allStepsCompleted = completedSteps.length === preparationSteps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/florist/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>กลับสู่หน้าหลัก</span>
          </button>
          <h1 className="text-2xl text-gray-900">เตรียมสินค้า</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900">ข้อมูลคำสั่งซื้อ</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">รหัสคำสั่งซื้อ :</span>
                  <span className="text-blue-600">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ชื่อ :</span>
                  <span className="text-gray-900">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วันที่ :</span>
                  <span className="text-gray-900">{order.assignedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วันครบกำหนด :</span>
                  <span className="text-gray-900">{order.dueTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">สถานะ :</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status === 'preparing' ? 'กำลังจัดเตรียม' : 'พร้อมจัดส่ง'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900">รายการสินค้า</h2>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-gray-900">{order.items}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900">ความคืบหน้าในการจัดเตรียม</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">ขั้นตอนที่เสร็จสมบูรณ์</span>
                  <span className="text-blue-600">{completedSteps.length}/{preparationSteps.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSteps.length / preparationSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Preparation Steps */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900">ขั้นตอนที่เสร็จสมบูรณ์</h2>
              <div className="space-y-3">
                {preparationSteps.map(step => (
                  <button
                    key={step.id}
                    onClick={() => order.status === 'preparing' && toggleStep(step.id)}
                    disabled={order.status !== 'preparing'}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      order.status !== 'preparing' 
                        ? 'opacity-50 cursor-not-allowed' 
                        : completedSteps.includes(step.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        completedSteps.includes(step.id)
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {completedSteps.includes(step.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Product Image */}
            {order.status === 'preparing' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl mb-4 text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  อัปโหลดรูปภาพสินค้า
                </h2>
                <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="product-image"
                    disabled={!allStepsCompleted}
                  />
                  <label htmlFor="product-image" className={allStepsCompleted ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}>
                    {uploadedImage ? (
                      <div className="flex flex-col items-center gap-3">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                        <p className="text-gray-900">{uploadedImage.name}</p>
                        <p className="text-sm text-gray-500">คลิ๊กเพื่อเปลี่ยน</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="w-16 h-16 text-gray-400" />
                        <p className="text-gray-700">อัปโหลดเสร็จสิ้น</p>
                        <p className="text-sm text-gray-500">
                          {allStepsCompleted ? 'PNG, JPG up to 10MB' : 'Complete all steps first'}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Complete Button */}
            {order.status === 'preparing' && (
              <button
                onClick={() => setShowCompleteModal(true)}
                disabled={!allStepsCompleted || !uploadedImage}
                className={`w-full py-4 rounded-xl transition-colors ${
                  allStepsCompleted && uploadedImage
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                สำเร็จ
              </button>
            )}

            {order.status === 'ready' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">พร้อมจัดส่ง</h3>
                  <p className="text-gray-600">รายการนี้เสร็จสมบูรณ์แล้ว</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Confirmation Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">ดำเนินการสำเร็จ?</h3>
              <p className="text-gray-600 mb-6">
                การดำเนินการนี้จะทำเครื่องหมายว่าคำสั่งซื้อพร้อมจัดส่งแล้ว ไรเดอร์จะได้รับการแจ้งเตือน
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
