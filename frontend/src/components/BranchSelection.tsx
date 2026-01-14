import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Branch, getBranches, getRegions, type Region } from "../api/branch.api";

interface BranchSelectionProps {
  // pass back branch_id (number) instead of name
  onNext: (branchId: number) => void;
  onCheckOrder?: () => void;
}

export function BranchSelection({ onNext, onCheckOrder }: BranchSelectionProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<number | "">("");
  const [selectedBranchId, setSelectedBranchId] = useState<number | "">("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [branchLoading, setBranchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // โหลดภาคเมื่อ component mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRegions();
        if (mounted) setRegions(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "เกิดข้อผิดพลาด");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // โหลดสาขาเมื่อเลือกภาค
  useEffect(() => {
    if (selectedRegionId === "") {
      setBranches([]);
      setSelectedBranchId("");
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setBranchLoading(true);
        setError(null);
        const data = await getBranches(selectedRegionId as number);
        if (mounted) setBranches(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "เกิดข้อผิดพลาด");
      } finally {
        if (mounted) setBranchLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedRegionId]);

  // หาชื่อสาขาจาก id ที่เลือก
  const handleNext = () => {
    if (selectedBranchId !== "") {
      onNext(Number(selectedBranchId));
    }
  };

  const disabled = !selectedRegionId || !selectedBranchId || !!error;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[#AEE6FF]/30">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-white shadow-lg">
            <MapPin className="w-10 h-10" style={{ color: "#62C4FF" }} />
          </div>
          <h1 className="mb-2 text-gray-900">ยินดีต้อนรับสู่ร้านดอกไม้</h1>
          <p className="text-gray-700">กรุณาเลือกภาค และ สาขาที่คุณต้องการ</p>
        </div>

        {/* เลือกภาค */}
        <div className="mb-6">
          <label className="block mb-3 text-gray-700">เลือกภาค</label>

          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value ? Number(e.target.value) : "")}
            disabled={loading}
            className="w-full px-4 py-4 rounded-lg border-2 outline-none transition-all disabled:opacity-60"
            style={{
              borderColor: selectedRegionId ? "#AEE6FF" : "#e5e7eb",
              backgroundColor: "white",
            }}
          >
            <option value="">
              {loading ? "กำลังโหลด..." : "-- กรุณาเลือกภาค --"}
            </option>

            {regions.map((r) => (
              <option key={r.region_id} value={r.region_id}>
                {r.region_name}
              </option>
            ))}
          </select>

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* เลือกสาขา (แสดงเฉพาะเมื่อเลือกภาค) */}
        {selectedRegionId && (
          <div className="mb-6">
            <label className="block mb-3 text-gray-700">เลือกสาขา</label>

            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value ? Number(e.target.value) : "")}
              disabled={branchLoading || branches.length === 0}
              className="w-full px-4 py-4 rounded-lg border-2 outline-none transition-all disabled:opacity-60"
              style={{
                borderColor: selectedBranchId ? "#AEE6FF" : "#e5e7eb",
                backgroundColor: "white",
              }}
            >
              <option value="">
                {branchLoading ? "กำลังโหลดสาขา..." : branches.length === 0 ? "ไม่มีสาขาในภาคนี้" : "-- กรุณาเลือกสาขา --"}
              </option>

              {branches.map((b) => (
                <option key={b.branch_id} value={b.branch_id}>
                  {b.branch_name} {b.province_name ? `(${b.province_name})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={disabled}
          className="w-full py-4 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: !disabled ? "#62C4FF" : "#d1d5db",
          }}
        >
          ต่อไป
        </button>

        {onCheckOrder && (
          <button
            onClick={onCheckOrder}
            className="w-full py-4 rounded-lg border-2 bg-white text-gray-700 transition-all hover:bg-gray-50 mt-3"
            style={{ borderColor: "#AEE6FF" }}
          >
            ตรวจสอบคำสั่งซื้อ
          </button>
        )}
      </div>
    </div>
  );
}
