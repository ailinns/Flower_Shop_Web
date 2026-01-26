import { useState } from 'react';
import { MapPin, Home, Truck, MessageSquare } from 'lucide-react';

interface DeliveryInfoProps {
  orderId: string;
  onConfirm: (name: string, address: string, phone: string, deliveryType: 'pickup' | 'delivery', cardMessage?: string) => void;
}

export function DeliveryInfo({ orderId, onConfirm }: DeliveryInfoProps) {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery' | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cardMessage, setCardMessage] = useState('');

  const handleConfirm = () => {
    if (deliveryType === 'pickup' && name && phone) {
      onConfirm(name, '', phone, deliveryType, cardMessage);
    } else if (deliveryType === 'delivery' && name && address && phone) {
      onConfirm(name, address, phone, deliveryType, cardMessage);
    }
  };

  const isValid = deliveryType && name && phone && phone.length >= 9 && 
    (deliveryType === 'pickup' || (deliveryType === 'delivery' && address));

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[#AEE6FF]/30">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white">
            <MapPin className="w-8 h-8" style={{ color: '#62C4FF' }} />
          </div>
          <h1 className="mb-2 text-gray-900">กรอกข้อมูลจัดส่ง</h1>
          <p className="text-gray-700">กรุณาเลือกวิธีการรับสินค้า</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          {/* Order ID */}
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#AEE6FF40' }}>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">รหัสคำสั่งซื้อ</span>
              <span className="text-gray-900">{orderId}</span>
            </div>
          </div>

          {/* Delivery Type Selection */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700">วิธีการรับสินค้า <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeliveryType('pickup')}
                className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
                style={{
                  borderColor: deliveryType === 'pickup' ? '#62C4FF' : '#e5e7eb',
                  backgroundColor: deliveryType === 'pickup' ? '#62C4FF' : 'white',
                  color: deliveryType === 'pickup' ? 'white' : '#374151',
                }}
              >
                <Home className="w-8 h-8" />
                <span>รับที่ร้าน</span>
              </button>
              <button
                onClick={() => setDeliveryType('delivery')}
                className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
                style={{
                  borderColor: deliveryType === 'delivery' ? '#62C4FF' : '#e5e7eb',
                  backgroundColor: deliveryType === 'delivery' ? '#62C4FF' : 'white',
                  color: deliveryType === 'delivery' ? 'white' : '#374151',
                }}
              >
                <Truck className="w-8 h-8" />
                <span>จัดส่ง</span>
              </button>
            </div>
          </div>

          {/* Customer Information (shown only when delivery type is selected) */}
          {deliveryType && (
            <div className="space-y-6 border-t pt-6">
              {/* Name Input */}
              <div>
                <label className="block mb-2 text-gray-700">
                  ชื่อผู้รับ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="กรอกชื่อ-นามสกุล"
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                  style={{
                    borderColor: name ? '#62C4FF' : '#e5e7eb',
                  }}
                />
              </div>

              {/* Address Input (only for delivery) */}
              {deliveryType === 'delivery' && (
                
                <div>
                  <label className="block mb-2 text-gray-700">
                    ที่อยู่จัดส่ง <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="กรอกที่อยู่สำหรับจัดส่ง"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none"
                    style={{
                      borderColor: address ? '#62C4FF' : '#e5e7eb',
                    }}
                  />
                </div>
              )}

              {/* Phone Input */}
              <div>
                <label className="block mb-2 text-gray-700">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0xx-xxx-xxxx"
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                  style={{
                    borderColor: phone ? '#62C4FF' : '#e5e7eb',
                  }}
                />
              </div>

              {/* Card Message (Optional) */}
              <div>
                <label className="block mb-2 text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" style={{ color: '#62C4FF' }} />
                  ข้อความบนการ์ดอวยพร (ถ้ามี)
                </label>
                <textarea
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder="กรอกข้อความที่ต้องการให้แสดงบนการ์ด (ไม่บังคับ)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none"
                  style={{
                    borderColor: cardMessage ? '#62C4FF' : '#e5e7eb',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleConfirm}
          disabled={!isValid}
          className="w-full py-4 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          style={{
            backgroundColor: isValid ? '#62C4FF' : '#d1d5db',
          }}
        >
          ยืนยัน
        </button>

        {/* Warning Message */}
        {deliveryType && (
          <p className="text-sm text-red-500 text-center">
            * กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน
          </p>
        )}
      </div>
    </div>
  );
}