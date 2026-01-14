export type Vase = {
  product_id: number;
  product_name: string;
  price: number;
  product_type_id?: number;
};

export type VaseColor = {
  vase_color_id: number;
  color_name?: string;
  hex?: string;
  [k: string]: any;
};

export async function getVases(productTypeId?: number): Promise<Vase[]> {
  const url = productTypeId ? `http://localhost:3000/api/vases?product_type_id=${productTypeId}` : `http://localhost:3000/api/vases`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('โหลดรายการแจกันไม่สำเร็จ');
  return res.json();
}

export async function getVaseColors(): Promise<VaseColor[]> {
  const res = await fetch(`http://localhost:3000/api/vase-colors`);
  if (!res.ok) throw new Error('โหลดสีแจกันไม่สำเร็จ');
  return res.json();
}
