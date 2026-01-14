import { useEffect, useState } from 'react';
import { getFlowerTypes, type FlowerType as DbFlowerType } from '../api/flower.api';
import { BouquetStyle, FlowerColor, ProductType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FlowerTypeSelectionProps {
  productType: ProductType;
  bouquetStyle?: BouquetStyle;
  price: number;
  color: FlowerColor;
  imageUrl: string;
  onFlowerTypeSelect: (flowerTypes: DbFlowerType[]) => void;
}

export function FlowerTypeSelection({
  productType,
  bouquetStyle,
  price,
  color,
  imageUrl,
  onFlowerTypeSelect,
}: FlowerTypeSelectionProps) {
  const [selectedFlowerTypes, setSelectedFlowerTypes] = useState<DbFlowerType[]>([]);
  const [dbFlowerTypes, setDbFlowerTypes] = useState<DbFlowerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static flower data for UI (emoji and default labels)
  const flowerIcons: Record<string, { label: string; icon: string }> = {
    'กุหลาบ': { label: 'กุหลาบ', icon: '🌹' },
    'ลิลลี่': { label: 'ลิลลี่', icon: '🌸' },
    'ทิวลิป': { label: 'ทิวลิป', icon: '🌷' },
    'กล้วยไม้': { label: 'กล้วยไม้', icon: '🏵️' },
    'ทานตะวัน': { label: 'ทานตะวัน', icon: '🌻' },
    'ดอกซามาดิเฮ้': { label: 'ดอกซามาดิเฮ้', icon: '🌼' },
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFlowerTypes();
        if (mounted) setDbFlowerTypes(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'เกิดข้อผิดพลาด');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getColorLabel = (color: FlowerColor): string => {
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

  const handleAddToCart = () => {
    if (selectedFlowerTypes.length > 0) {
      onFlowerTypeSelect(selectedFlowerTypes);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[#AEE6FF]/30 max-w-2xl mx-auto">
          <h1 className="mb-2 text-gray-900">เลือกชนิดดอกไม้</h1>
          <p className="text-gray-700">เลือกได้สูงสุด 2 ชนิด ({selectedFlowerTypes.length}/2)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image and Summary */}
          <div className="flex flex-col">
            <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg mb-6">
              <ImageWithFallback
                src={imageUrl}
                alt="ตัวอย่างสินค้า"
                className="w-full h-auto"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="mb-4 text-gray-800">สรุปรายการ</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>ประเภท:</span>
                  <span>{productType === 'bouquet' ? 'ช่อดอกไม้' : 'แจกันดอกไม้'}</span>
                </div>
                {productType === 'bouquet' && bouquetStyle && (
                  <div className="flex justify-between">
                    <span>แบบ:</span>
                    <span>{bouquetStyle === 'round' ? 'แบบกลม' : 'แบบยาว'}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ราคา:</span>
                  <span>฿{price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>สี:</span>
                  <span>{getColorLabel(color)}</span>
                </div>
                {selectedFlowerTypes.length > 0 && (
                  <div className="flex justify-between">
                    <span>ชนิดดอกไม้:</span>
                    <span>
                      {selectedFlowerTypes.map(ft => 
                        ft.flower_name
                      ).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Flower Type Selection */}
          <div className="flex flex-col">
            <h3 className="mb-4 text-gray-800">เลือกชนิดดอกไม้</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {loading ? (
                <div className="col-span-2 text-center py-8 text-gray-500">กำลังโหลด...</div>
              ) : error ? (
                <div className="col-span-2 text-center py-8 text-red-500">{error}</div>
              ) : dbFlowerTypes.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">ไม่พบข้อมูลช่อดอกไม้</div>
              ) : (
                dbFlowerTypes.map((flower) => {
                  const isSelected = selectedFlowerTypes.some((f) =>
                    f.flower_id === flower.flower_id
                  );
                  const canSelect = selectedFlowerTypes.length < 2 || isSelected;
                  const iconData = flowerIcons[flower.flower_name] || { label: flower.flower_name, icon: '🌼' };
                  
                  return (
                    <button
                      key={flower.flower_id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedFlowerTypes(
                            selectedFlowerTypes.filter((f) =>
                              f.flower_id !== flower.flower_id
                            )
                          );
                        } else if (canSelect) {
                          setSelectedFlowerTypes([
                            ...selectedFlowerTypes,
                            flower
                          ]);
                        }
                      }}
                      disabled={!canSelect}
                      className="p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        borderColor: isSelected ? '#62C4FF' : '#e5e7eb',
                        backgroundColor: isSelected ? '#62C4FF' : 'white',
                        color: isSelected ? 'white' : '#374151',
                      }}
                    >
                      <div className="text-4xl">{iconData.icon}</div>
                      <span>{flower.flower_name}</span>
                      {isSelected && (
                        <div className="text-xs mt-1 bg-white text-gray-700 px-2 py-1 rounded-full">
                          เลือกแล้ว
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={selectedFlowerTypes.length === 0}
              className="w-full py-4 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
              style={{
                backgroundColor: selectedFlowerTypes.length > 0 ? '#62C4FF' : '#d1d5db',
              }}
            >
              เพิ่มใส่ตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}