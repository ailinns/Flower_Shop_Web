import { QrCode, Upload, X } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
interface PaymentProps {
  totalAmount: number;
  // pass the selected slip file (or null) back to parent
  onConfirm: (slipjson: JSON) => void;
  onCancel: () => void;
}

export function Payment({ totalAmount, onConfirm, onCancel }: PaymentProps) {
  const [slip, setSlip] = useState<File | null>(null);
  const [slipOkData, setslipOkData] = useState([]);

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlip(e.target.files[0]);
      console.log("update");
    }
  };
  console.log("selected",slip)
  const handleConfirm = () => {
    if (slip) {
      slipSubmit();
    }
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
          onConfirm(data.data);
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
                <img src={`https://promptpay.io/0637503711/${totalAmount}.png`}></img>
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