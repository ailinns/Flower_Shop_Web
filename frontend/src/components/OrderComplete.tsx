import { useState, useEffect } from 'react';
import { CheckCircle, ClipboardList, Home, Gift, X } from 'lucide-react';

interface OrderCompleteProps {
  orderId: string;
  onCheckOrder: () => void;
  onBackToHome: () => void;
}

export function OrderComplete({ orderId, onCheckOrder, onBackToHome }: OrderCompleteProps) {
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Show popup after 1 second
    const timer = setTimeout(() => {
      setShowPointsPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCollectPoints = () => {
    if (phoneNumber && phoneNumber.length >= 9) {
      alert(`บันทึกแต้มสำเร็จ! เบอร์: ${phoneNumber}`);
      setShowPointsPopup(false);
    }
  };

  const handleSkipPoints = () => {
    setShowPointsPopup(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[#AEE6FF]/30">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 bg-white shadow-lg">
            <CheckCircle className="w-16 h-16" style={{ color: '#62C4FF' }} />
          </div>
          <h1 className="mb-4 text-gray-900">สั่งซื้อสำเร็จ!</h1>
          <p className="text-gray-700 mb-2">
            ขอบคุณที่ใช้บริการร้านดอกไม้ของเรา
          </p>
          <p className="text-gray-600 text-sm">
            เราจะดำเนินการจัดเตรียมและจัดส่งสินค้าให้คุณโดยเร็วที่สุด
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <p className="text-sm text-gray-600 mb-2">รหัสคำสั่งซื้อของคุณ</p>
          <p className="text-2xl tracking-wide" style={{ color: '#62C4FF' }}>
            {orderId}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onCheckOrder}
            className="w-full py-4 rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ backgroundColor: '#62C4FF' }}
          >
            <ClipboardList className="w-5 h-5" />
            ตรวจสอบคำสั่งซื้อ
          </button>
          
          <button
            onClick={onBackToHome}
            className="w-full py-4 rounded-xl bg-white border-2 text-gray-700 flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
            style={{ borderColor: '#62C4FF' }}
          >
            <Home className="w-5 h-5" />
            กลับไปหน้าแรก
          </button>
        </div>

        {/* Decorative Element */}
        <div className="mt-8 text-6xl animate-bounce">
          🌸
        </div>
      </div>

      {/* Points Collection Popup */}
      
    </div>
  );
}