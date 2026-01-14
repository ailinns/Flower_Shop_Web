
export type Region = {
  region_id: number;
  region_name: string;
};

export type Branch = {
  branch_id: number;
  branch_name: string;
  province_name?: string;
  region_id?: number;
  region_name?: string;
};

export async function getRegions(): Promise<Region[]> {
  const res = await fetch(`http://localhost:3000/api/regions`);
  if (!res.ok) throw new Error("โหลดรายชื่อภาคไม่สำเร็จ");
  return res.json();
}

export async function getBranches(regionId?: number): Promise<Branch[]> {
  const url = regionId 
    ? `http://localhost:3000/api/branches?region_id=${regionId}`
    : `http://localhost:3000/api/branches`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("โหลดรายชื่อสาขาไม่สำเร็จ");
  return res.json();
}
