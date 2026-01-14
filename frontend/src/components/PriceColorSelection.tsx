import { useEffect, useState } from 'react';
import { BouquetStyle, FlowerColor, ProductType } from '../App';
import { getVaseColors, getVases } from '../api/vase.api';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PriceColorSelectionProps {
  productType: ProductType;
  bouquetStyle?: BouquetStyle;
  // pass back selected product_id (if available) and vase_color_id (if applicable)
  onSelect: (price: number, color: FlowerColor, productId?: number | null, vaseColorId?: number | null) => void;
}

export function PriceColorSelection({ productType, bouquetStyle, onSelect }: PriceColorSelectionProps) {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [dbPrices, setDbPrices] = useState<{ value: number; label: string; id?: number }[]>([]);
  const [dbColors, setDbColors] = useState<{ id: number; label?: string; hex?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // default static values for bouquets
  const staticPrices = [
    { value: 500, label: '฿500' },
    { value: 800, label: '฿800' },
    { value: 1200, label: '฿1,200' },
    { value: 1500, label: '฿1,500' },
  ];

  const staticColors: { value: FlowerColor; label: string; hex: string }[] = [
    { value: 'pink', label: 'ชมพู', hex: '#FFC0CB' },
    { value: 'red', label: 'แดง', hex: '#DC143C' },
    { value: 'white', label: 'ขาว', hex: '#FFFFFF' },
    { value: 'yellow', label: 'เหลือง', hex: '#FFD700' },
    { value: 'purple', label: 'ม่วง', hex: '#9370DB' },
  ];

  // Map Thai color names to enum values (for legacy support)
  const colorNameToEnum: Record<string, string> = {
    'ชมพู': 'pink',
    'แดง': 'red',
    'ขาว': 'white',
    'เหลือง': 'yellow',
    'ม่วง': 'purple',
  };

  // When productType is 'vase', load vases and vase colors from API
  useEffect(() => {
    let mounted = true;
    // load products for both bouquets and vases (backend supports product_type_id)
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const productTypeId = productType === 'vase' ? undefined : 1;
        const [vases, colors] = await Promise.all([getVases(productTypeId as any), getVaseColors()]);
        if (!mounted) return;
        // Map products to price options
        const priceOpts = (vases || []).map((p: any) => {
          const raw = p.price ?? p.product_price ?? 0;
          const num = Number(raw || 0);
          return { value: num, label: `${p.product_name} — ${num.toLocaleString()} ฿`, id: p.product_id };
        }).sort((a, b) => a.value - b.value);
        setDbPrices(priceOpts);
        // Map vase colors
        const colorOpts = colors.map((c: any) => ({ id: c.vase_color_id, label: c.color_name ?? c.vase_color_name ?? String(c.vase_color_id), hex: c.hex }));
        setDbColors(colorOpts);
        // do not auto-select — require user to choose explicitly
        setSelectedPrice(null);
        setSelectedColor(null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'โหลดข้อมูลจากฐานข้อมูลไม่สำเร็จ');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [productType]);

  const getImageUrl = () => {
    if (productType === 'vase') {
      return 'https://images.unsplash.com/photo-1646487134240-7262dfc8a830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG93ZXIlMjB2YXNlJTIwYXJyYW5nZW1lbnR8ZW58MXx8fHwxNzY0NjUwNjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }
    if (bouquetStyle === 'round') {
      return 'https://images.unsplash.com/photo-1612796495278-65e44b09325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3VuZCUyMGZsb3dlciUyMGJvdXF1ZXR8ZW58MXx8fHwxNzY0NjcyNjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }
    return 'https://images.unsplash.com/photo-1762394947969-b798082075fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25nJTIwZmxvd2VyJTIwYm91cXVldHxlbnwxfHx8fDE3NjQ2NzI2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  };

  const handleNext = () => {
    if (selectedPrice !== null && selectedColor !== null) {
      // If productType is 'vase', convert color name to enum; otherwise it's already enum
      const colorEnum = productType === 'vase' 
        ? colorNameToEnum[selectedColor] || (selectedColor as FlowerColor)
        : (selectedColor as FlowerColor);
      // find selected product id from dbPrices
      const prod = dbPrices.find(p => p.value === selectedPrice);
      const productId = prod?.id ?? null;
      // find selected vase color id
      const colorObj = dbColors.find(c => (c.label || String(c.id)) === selectedColor);
      const vaseColorId = colorObj?.id ?? null;
      onSelect(selectedPrice, colorEnum, productId, vaseColorId);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[#AEE6FF]/30 max-w-2xl mx-auto">
          <h1 className="mb-2 text-gray-900">เลือกราคาและสี</h1>
          <p className="text-gray-700">กรุณาเลือกราคาและสีที่คุณต้องการ</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image Preview */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src={getImageUrl()}
                alt="ตัวอย่างสินค้า"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right: Price and Color Options */}
          <div className="flex flex-col">
            {/* Price Options */}
              <div className="mb-8">
                <h3 className="mb-4 text-gray-800">เลือกราคา</h3>
                {productType === 'vase' ? (
                  loading ? (
                    <div>กำลังโหลด...</div>
                  ) : error ? (
                    <div className="text-red-600">{error}</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {dbPrices.map((price) => (
                        <button
                          key={`${price.id}-${price.value}`}
                          onClick={() => setSelectedPrice(price.value)}
                          className="p-4 rounded-xl border-2 transition-all"
                          style={{
                            borderColor: selectedPrice === price.value ? '#62C4FF' : '#e5e7eb',
                            backgroundColor: selectedPrice === price.value ? '#62C4FF' : 'white',
                            color: selectedPrice === price.value ? 'white' : '#374151',
                          }}
                        >
                          <div>{price.label}</div>
                        </button>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {staticPrices.map((price) => (
                      <button
                        key={price.value}
                        onClick={() => setSelectedPrice(price.value)}
                        className="p-4 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: selectedPrice === price.value ? '#62C4FF' : '#e5e7eb',
                          backgroundColor: selectedPrice === price.value ? '#62C4FF' : 'white',
                          color: selectedPrice === price.value ? 'white' : '#374151',
                        }}
                      >
                        <div>{price.label}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            {/* Color Options */}
            <div className="mb-8">
              <h3 className="mb-4 text-gray-800">เลือกสี</h3>
              {productType === 'vase' ? (
                loading ? (
                  <div>กำลังโหลดสี...</div>
                ) : error ? (
                  <div className="text-red-600">{error}</div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {dbColors.map((c) => {
                      // ใช้ Thai name โดยตรง ทำให้ flexible สำหรับสีใหม่
                      const colorValue = c.label || String(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelectedColor(colorValue)}
                          className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
                          style={{
                            borderColor: selectedColor === colorValue ? '#62C4FF' : '#e5e7eb',
                            backgroundColor: 'white',
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded-full border-2"
                            style={{
                              backgroundColor: c.hex || '#ccc',
                              borderColor: '#999',
                            }}
                          />
                          <span className="text-sm text-gray-700">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {staticColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
                      style={{
                        borderColor: selectedColor === color.value ? '#62C4FF' : '#e5e7eb',
                        backgroundColor: 'white',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full border-2"
                        style={{
                          backgroundColor: color.hex,
                          borderColor: '#999',
                        }}
                      />
                      <span className="text-sm text-gray-700">{color.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={selectedPrice === null || selectedColor === null}
              className="w-full py-4 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
              style={{
                backgroundColor: selectedPrice !== null && selectedColor !== null ? '#62C4FF' : '#d1d5db',
              }}
            >
              ต่อไป
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}