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
      {showPointsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={handleSkipPoints}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#62C4FF' }}>
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-center mb-2 text-gray-900">สะสมแต้มรับสิทธิพิเศษ</h2>
            <p className="text-center text-gray-600 text-sm mb-6">
              กรอกเบอร์โทรเพื่อสะสมแต้มและรับส่วนลดในครั้งต่อไป
            </p>

            {/* Phone Input */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 text-sm">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0xx-xxx-xxxx"
                className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                style={{
                  borderColor: phoneNumber ? '#62C4FF' : '#e5e7eb',
                }}
              />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSkipPoints}
                className="py-3 rounded-xl border-2 text-gray-700 transition-all hover:bg-gray-50"
                style={{ borderColor: '#e5e7eb' }}
              >
                ข้าม
              </button>
              <button
                onClick={handleCollectPoints}
                disabled={!phoneNumber || phoneNumber.length < 9}
                className="py-3 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: phoneNumber && phoneNumber.length >= 9 ? '#62C4FF' : '#d1d5db',
                }}
              >
                สะสมแต้ม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}