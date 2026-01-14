import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartProps {
  items: CartItem[];
  onAddMore: () => void;
  onCheckout: () => void;
  onRemove: (itemId: string) => void;
}

export function Cart({ items, onAddMore, onCheckout, onRemove }: CartProps) {
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  const getProductTypeLabel = (item: CartItem) => {
    if (item.productType === 'bouquet') {
      return `ช่อดอกไม้ - ${item.bouquetStyle === 'round' ? 'แบบกลม' : 'แบบยาว'}`;
    }
    return 'แจกันดอกไม้';
  };

  const getColorLabel = (color: string): string => {
    const colorLabels: Record<string, string> = {
      'pink': 'ชมพู',
      'red': 'แดง',
      'white': 'ขาว',
      'yellow': 'เหลือง',
      'purple': 'ม่วง',
      'ชมพู': 'ชมพู',
      'แดง': 'แดง',
      'ขาว': 'ขาว',
      'เหลือง': 'เหลือง',
      'ม่วง': 'ม่วง',
      'ฟ้า': 'ฟ้า',
      'ดำ': 'ดำ',
      'ใส': 'ใส',
    };
    return colorLabels[color] || color;
  };

  const flowerTypeLabels: Record<string, string> = {
    rose: 'กุหลาบ',
    lily: 'ลิลลี่',
    tulip: 'ทิวลิป',
    orchid: 'กล้วยไม้',
    sunflower: 'ทานตะวัน',
    samadihae: 'ดอกซามาดิเฮ้',
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[#AEE6FF]/30">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white">
            <ShoppingCart className="w-8 h-8" style={{ color: '#62C4FF' }} />
          </div>
          <h1 className="mb-2 text-gray-900">ตะกร้าสินค้า</h1>
          <p className="text-gray-700">รายการสินค้าของคุณ ({items.length} รายการ)</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <p className="text-gray-500 mb-6">ยังไม่มีสินค้าในตะกร้า</p>
            <button
              onClick={onAddMore}
              className="px-8 py-4 rounded-xl text-white"
              style={{ backgroundColor: '#62C4FF' }}
            >
              เริ่มสั่งซื้อ
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt="สินค้า"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="mb-2 text-gray-800">{getProductTypeLabel(item)}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>ชนิด: {item.flowerTypes.map(ft => flowerTypeLabels[ft]).join(', ')}</div>
                        <div>สี: {getColorLabel(item.color)}</div>
                        <div className="text-gray-800 mt-2">฿{item.price.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:bg-red-50"
                      style={{ color: '#ef4444' }}
                      title="ลบสินค้า"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">รวมทั้งหมด</span>
                <span className="text-gray-900">฿{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={onAddMore}
                className="py-4 rounded-xl border-2 bg-white text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                style={{ borderColor: '#62C4FF' }}
              >
                <Plus className="w-5 h-5" />
                เพิ่มรายการ
              </button>
              <button
                onClick={onCheckout}
                className="py-4 rounded-xl text-white"
                style={{ backgroundColor: '#62C4FF' }}
              >
                ชำระเงิน
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}