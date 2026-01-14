import { Gift } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getVaseColors, getVases, type Vase, type VaseColor } from '../api/vase.api';

interface Props {
  onSelect: (productId: number, colorId?: number) => void;
}

export default function VaseSelection({ onSelect }: Props) {
  const [vases, setVases] = useState<Vase[]>([]);
  const [colors, setColors] = useState<VaseColor[]>([]);
  const [selectedVase, setSelectedVase] = useState<number | ''>('');
  const [selectedColor, setSelectedColor] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [vData, cData] = await Promise.all([getVases(), getVaseColors()]);
        if (!mounted) return;
        setVases(vData);
        setColors(cData);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'เกิดข้อผิดพลาด');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const selectedVaseItem = useMemo(() => vases.find(v => v.product_id === selectedVase), [vases, selectedVase]);

  const handleConfirm = () => {
    if (!selectedVase) return;
    onSelect(Number(selectedVase), selectedColor ? Number(selectedColor) : undefined);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-full bg-blue-50"><Gift /></div>
        <h3 className="text-lg font-medium">เลือกแบบแจกัน</h3>
      </div>

      {loading ? (
        <div>กำลังโหลด...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <label className="block text-sm mb-2">รุ่นแจกัน (ราคา)</label>
          <select
            value={selectedVase}
            onChange={(e) => setSelectedVase(e.target.value ? Number(e.target.value) : '')}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="">-- เลือกรุ่นแจกัน --</option>
            {vases.map(v => (
              <option key={v.product_id} value={v.product_id}>
                {v.product_name} — {typeof v.price === 'number' ? v.price.toLocaleString() + ' ฿' : v.price}
              </option>
            ))}
          </select>

          <label className="block text-sm mb-2">สีแจกัน</label>
          <div className="flex gap-2 mb-4 flex-wrap">
            {colors.map(c => (
              <button
                key={c.vase_color_id}
                onClick={() => setSelectedColor(c.vase_color_id)}
                type="button"
                className={`w-10 h-10 rounded border-2 ${selectedColor === c.vase_color_id ? 'ring-2 ring-offset-1' : ''}`}
                title={c.color_name || c.hex || String(c.vase_color_id)}
                style={{ background: c.hex || undefined }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={handleConfirm} disabled={!selectedVase} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
              ยืนยัน
            </button>
            <button onClick={() => { setSelectedVase(''); setSelectedColor(''); }} className="px-4 py-2 border rounded">
              รีเซ็ต
            </button>
          </div>

          {selectedVaseItem && (
            <div className="mt-4 text-sm text-gray-700">
              ราคาปัจจุบัน: <strong>{selectedVaseItem.price?.toLocaleString() ?? '-'} ฿</strong>
            </div>
          )}
        </>
      )}
    </div>
  );
}
