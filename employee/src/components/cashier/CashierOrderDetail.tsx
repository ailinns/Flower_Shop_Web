import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, FileText, User, MapPin, Phone, DollarSign } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  date: string;
  paymentMethod: string;
}

export default function CashierOrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(location.state?.order || null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Load order from localStorage if not passed via state
  useEffect(() => {
    if (!order && orderId) {
      const savedOrders = localStorage.getItem('cashier_orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const foundOrder = orders.find((o: Order) => o.id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      }
    }
  }, [orderId, order]);

  // Mock payment slip image
  const paymentSlipUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800';

  // Mock order items
  const orderItems = [
    {
      id: 1,
      name: 'Pink Rose Bouquet',
      size: 'Medium',
      quantity: 2,
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1672243691196-9b7f64cce1c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    }
  ];

  const handleApprove = () => {
    if (!order) return;

    // Update order status in localStorage
    const savedOrders = localStorage.getItem('cashier_orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const updatedOrders = orders.map((o: Order) => 
        o.id === order.id ? { ...o, status: 'verified' } : o
      );
      localStorage.setItem('cashier_orders', JSON.stringify(updatedOrders));
      
      toast.success('อนุมัติคำสั่งซื้อสำเร็จ', {
        description: `คำสั่งซื้อ ${order.id} ได้รับการอนุมัติแล้ว`
      });
      
      setTimeout(() => {
        navigate('/cashier/dashboard');
      }, 1000);
    }
  };

  const handleReject = () => {
    if (!order || !rejectionReason.trim()) return;

    // Update order status in localStorage
    const savedOrders = localStorage.getItem('cashier_orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const updatedOrders = orders.map((o: Order) => 
        o.id === order.id ? { ...o, status: 'rejected' } : o
      );
      localStorage.setItem('cashier_orders', JSON.stringify(updatedOrders));
      
      toast.error('ปฎิเสธคำสั่งซื้อ', {
        description: `เหตุผล: ${rejectionReason}`
      });
      
      setTimeout(() => {
        navigate('/cashier/dashboard');
      }, 1000);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">ไม่พบคำสั่งซื้อ</h2>
          <p className="text-gray-600 mb-6">ไม่พบคำสั่งซื้อที่คุณต้องการดู</p>
          <button
            onClick={() => navigate('/cashier/dashboard')}
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
            onClick={() => navigate('/cashier/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>กลับสู่หน้าหลัก</span>
          </button>
          <h1 className="text-2xl text-gray-900">จัดการคำสั่งซื้อ</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900">รายละเอียดคำสั่งซื้อ</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">รหัสคำสั่งซื้อ :</span>
                  <span className="text-blue-600">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วันที่ :</span>
                  <span className="text-gray-900">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วิธีการชำระเงิน :</span>
                  <span className="text-gray-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">สถานะ :</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'pending-verification' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'verified' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'pending-verification' ? 'กำลังรอการยืนยัน' :
                     order.status === 'verified' ? 'ยืนยันสำเร็จ' : 'ปฎิเสธ'}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                ข้อมูลลูกค้า
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">ชื่อ</p>
                  <p className="text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    เบอร์โทร
                  </p>
                  <p className="text-gray-900">{order.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    ที่อยู่จัดส่ง
                  </p>
                  <p className="text-gray-900">153 ต.อะไรเนี่ย อ.ว้ะฮู้ว จ.ยะเฮ้ย 63999</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900">รายการสินค้า</h2>
              <div className="space-y-3">
                {orderItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">ขนาด : {item.size} • จำนวน : {item.quantity}</p>
                      <p className="text-blue-600 mt-1">฿ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between text-xl">
                  <span className="text-gray-900">ทั้งหมด :</span>
                  <span className="text-blue-600">฿ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Slip */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-4 text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                หลักฐานการชำระเงิน
              </h2>
              <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                <ImageWithFallback
                  src={paymentSlipUrl}
                  alt="Payment Slip"
                  className="w-full h-auto"
                />
              </div>
              <button
                onClick={() => window.open(paymentSlipUrl, '_blank')}
                className="mt-4 w-full py-2 text-blue-600 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                ขยายภาพ
              </button>
            </div>

            {/* Actions */}
            {order.status === 'pending-verification' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl mb-4 text-gray-900">ดำเนินการคำสั่งซื้อ</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    className="w-full py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    อนุมัติคำสั่งซื้อ
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    ปฎิเสธคำสั่งซื้อ
                  </button>
                </div>
              </div>
            )}

            {order.status === 'verified' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">ยืนยันคำสั่งซื้อเรียบร้อย</h3>
                  <p className="text-gray-600">รายการคำสั่งซื้อนี้ได้รับอนุมัติแล้ว</p>
                </div>
              </div>
            )}

            {order.status === 'rejected' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">คำสั่งซื้อถูกปฎิเสธ</h3>
                  <p className="text-gray-600">รายการคำสั่งซื้อนี้ถูกปฎิเสธแล้ว</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl mb-4 text-gray-900">ปฎิเสธคำสั่งซื้อ</h3>
            <p className="text-gray-600 mb-4">กรุณาระบุเหตุผลการปฎิเสธ :</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="เหตุผล : สลีปไม่ถูกต้อง"
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className={`flex-1 py-3 rounded-xl transition-colors ${
                  rejectionReason.trim()
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ยืนยันการปฎิเสธ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
