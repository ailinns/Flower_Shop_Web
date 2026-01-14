import { QrCode, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface PaymentProps {
  totalAmount: number;
  // pass the selected slip file (or null) back to parent
  onConfirm: (slip: File | null) => void;
  onCancel: () => void;
}

export function Payment({ totalAmount, onConfirm, onCancel }: PaymentProps) {
  const [slip, setSlip] = useState<File | null>(null);

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlip(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    if (slip) {
      onConfirm(slip);
    }
  };

  const isValid = slip !== null;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[#AEE6FF]/30">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white">
            <QrCode className="w-8 h-8" style={{ color: '#62C4FF' }} />
          </div>
          <h1 className="mb-2 text-gray-900">ชำระเงิน</h1>
          <p className="text-gray-700">สแกน QR Code เพื่อชำระเงิน</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="w-64 h-64 bg-gray-100 rounded-2xl flex items-center justify-center border-2" style={{ borderColor: '#62C4FF' }}>
              <div className="text-center">
                <QrCode className="w-32 h-32 mx-auto mb-2" style={{ color: '#62C4FF' }} />
                <p className="text-sm text-gray-600">QR Code สำหรับชำระเงิน</p>
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#AEE6FF40' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">ยอดชำระ</span>
              <span className="text-gray-900">฿{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <span className="text-gray-900">ยอดที่ต้องชำระ</span>
              <span className="text-gray-900">฿{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Slip Upload */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-700">แนบสลิปการโอนเงิน <span className="text-red-500">*</span></label>
            {slip ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2" style={{ borderColor: '#62C4FF' }}>
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5" style={{ color: '#62C4FF' }} />
                  <span className="text-sm text-gray-700">{slip.name}</span>
                </div>
                <button
                  onClick={() => setSlip(null)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSlipUpload}
                  className="hidden"
                />
                <div className="w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer hover:bg-gray-50 transition-all" style={{ borderColor: '#62C4FF' }}>
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#62C4FF' }} />
                  <p className="text-sm text-gray-600">คลิกเพื่อเลือกไฟล์</p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={onCancel}
            className="py-4 rounded-xl border-2 bg-white text-gray-700 hover:bg-gray-50 transition-all"
            style={{ borderColor: '#62C4FF' }}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="py-4 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isValid ? '#62C4FF' : '#d1d5db',
            }}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}