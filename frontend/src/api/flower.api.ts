export type FlowerType = {
  flower_id: number;
  flower_name: string;
};

export async function getFlowerTypes(): Promise<FlowerType[]> {
  const res = await fetch('/api/flower-types');
  if (!res.ok) throw new Error('โหลดรายชนิดดอกไม้ไม่สำเร็จ');
  return res.json();
}
