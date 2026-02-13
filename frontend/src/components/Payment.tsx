import { QrCode, Upload, X, Banknote, CreditCard } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

type PaymentMethod = 'cash' | 'qr' | 'credit';

interface PaymentProps {
  totalAmount: number;
  // pass the selected slip file (or null) back to parent
  onConfirm: (slipjson: JSON) => void;
  onCancel: () => void;
}

export function Payment({ totalAmount, onConfirm, onCancel }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [slip, setSlip] = useState<File | null>(null);
  const [slipOkData, setslipOkData] = useState([]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlip(e.target.files[0]);
      console.log("update");
    }
  };
  const handleConfirm = () => {
    if (paymentMethod === 'qr' && slip) {
      slipSubmit();
    } else if (paymentMethod === 'cash') {
      handleCashPayment();
    } else if (paymentMethod === 'credit' && isValidCard()) {
      handleCreditCardPayment();
    }
  };

  const isValidCard = () => {
    return cardNumber.length === 16 && cardName && expiryDate && cvv.length === 3;
  };

  const handleCashPayment = () => {
    Swal.fire({
      title: "สำเร็จ",
      text: `ชำระเงินเงินสดจำนวน ${totalAmount} บาท`,
      icon: "success"
    });
    onConfirm({ method: 'cash', data: 'null' } as any);
  };

  const handleCreditCardPayment = () => {
    // ซ่อนหลักสุดท้ายของเลขบัตร
    const maskedCard = cardNumber.slice(-4).padStart(cardNumber.length, '*');
    Swal.fire({
      title: "สำเร็จ",
      text: `ชำระเงินด้วยบัตรเครดิต ${maskedCard}`,
      icon: "success"
    });
    onConfirm({ method: 'credit', data: cardNumber.slice(-4) } as any);
  };

  const checkText = async (text: string): Promise<boolean> => {
  const res = await fetch("http://localhost:3000/check-dupslip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

    const data = await res.json();
    return data.exists; // true / false
};

  const slipSubmit = async () => {
    Loading();
    try{
      console.log("trying",slip);
      const formData = new FormData();
      formData.append("files", slip);

      const res = await fetch("http://localhost:3000/check-slips", {
        method: "POST",
        body: formData,
      });
        
        const data = await res.json();
        setslipOkData(data.data);
        console.log("data", slipOkData);
        const isAvailable = await checkText(data.data.transRef);
        if (data.data.amount == totalAmount && data.data.success == true && isAvailable == true){
          Correct(data.data.amount);
          onConfirm({ method: 'qr', data: data.data} as any);
        } else{
          InCorrect("ข้อมูลชำระเงินไม่ถูกต้อง");
        }

      
    }catch(error){
      console.log("error test",error)
    }
  };

  const Correct = (amount: number) => {
    Swal.fire({
        title: "สำเร็จ",
        text: `ชำระเงินจำนวน ${amount} บาท`,
        icon: "success"
      });
  };

  const InCorrect = (ErrorText: string) => {
    Swal.fire({
        title: "ผิดพลาด",
        text: ErrorText,
        icon: "error"
      });
  };

  const Loading = () => {
    Swal.fire({
        title: "กรุณารอสักครู่",
        text: `กำลังตรวจสอบการชำระเงิน`,
      });
  };

  const isValid = 
    (paymentMethod === 'qr' && slip !== null) ||
    (paymentMethod === 'cash') ||
    (paymentMethod === 'credit' && isValidCard());

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[#AEE6FF]/30">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white">
            <QrCode className="w-8 h-8" style={{ color: '#62C4FF' }} />
          </div>
          <h1 className="mb-2 text-gray-900">เลือกวิธีการชำระเงิน</h1>
          <p className="text-gray-700">เลือกวิธีที่สะดวกสำหรับคุณ</p>
        </div>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'cash'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <Banknote className="w-8 h-8 mx-auto mb-2" style={{ color: paymentMethod === 'cash' ? '#62C4FF' : '#9CA3AF' }} />
            <p className="text-sm font-medium text-gray-900">เงินสด</p>
          </button>

          <button
            onClick={() => setPaymentMethod('qr')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'qr'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <QrCode className="w-8 h-8 mx-auto mb-2" style={{ color: paymentMethod === 'qr' ? '#62C4FF' : '#9CA3AF' }} />
            <p className="text-sm font-medium text-gray-900">QR Payment</p>
          </button>

          <button
            onClick={() => setPaymentMethod('credit')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'credit'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-8 h-8 mx-auto mb-2" style={{ color: paymentMethod === 'credit' ? '#62C4FF' : '#9CA3AF' }} />
            <p className="text-sm font-medium text-gray-900">Credit Card</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          {/* QR Code - Show only for QR Payment */}
          {paymentMethod === 'qr' && (
            <div className="flex justify-center mb-6">
              <div className="w-64 h-64 bg-gray-100 rounded-2xl flex items-center justify-center border-2" style={{ borderColor: '#62C4FF' }}>
                <div className="text-center">
                  <img src={`https://promptpay.io/0637503711/${totalAmount}.png`}></img>
                  <p className="text-sm text-gray-600">QR Code สำหรับชำระเงิน</p>
                </div>
              </div>
            </div>
          )}

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

          {/* Slip Upload - Show only for QR Payment */}
          {paymentMethod === 'qr' && (
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">แนบสลิปการโอนเงิน <span className="text-red-500">*</span></label>
              {slip ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2" style={{ borderColor: '#62C4FF' }}>
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5" style={{ color: '#62C4FF' }} />
                    <img src={slip && URL.createObjectURL(slip)} alt="slip"></img>
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
          )}

          {/* Credit Card Form - Show only for Credit Card */}
          {paymentMethod === 'credit' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block mb-2 text-gray-700">หมายเลขบัตร <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-blue-500"
                  style={{ borderColor: '#D1D5DB' }}
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">ชื่อผู้ถือบัตร <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="JOHN DOE"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-blue-500"
                  style={{ borderColor: '#D1D5DB' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-700">วันหมดอายุ <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) {
                        val = val.slice(0, 2) + '/' + val.slice(2, 4);
                      }
                      setExpiryDate(val);
                    }}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-blue-500"
                    style={{ borderColor: '#D1D5DB' }}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">CVV <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-blue-500"
                    style={{ borderColor: '#D1D5DB' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cash Payment - Show message only for Cash */}
          {paymentMethod === 'cash' && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-gray-800">ชำระเงินสดเมื่อรับสินค้า กรุณาเตรียมเงินให้พร้อม</p>
            </div>
          )}
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