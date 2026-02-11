import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function ProductManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const products = [
    {
      id: 1,
      name: 'ช่อกุหลาบสีชมพู',
      category: 'ช่อดอกไม้',
      price: 45.00,
      stock: 25,
      status: 'ใช้งานอยู่',
      image: 'https://images.unsplash.com/photo-1672243691196-9b7f64cce1c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    },
    {
      id: 2,
      name: 'ช่อทานตะวัน',
      category: 'ช่อดอกไม้',
      price: 38.00,
      stock: 18,
      status: 'ใช้งานอยู่',
      image: 'https://images.unsplash.com/photo-1630787863782-194cfee87c79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    },
    {
      id: 3,
      name: 'ช่อทิวลิป',
      category: 'ช่อดอกไม้',
      price: 42.00,
      stock: 12,
      status: 'ใช้งานอยู่',
      image: 'https://images.unsplash.com/photo-1580403072903-36afa4f4c9f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    },
    {
      id: 4,
      name: 'กล้วยไม้สีขาว',
      category: 'ช่อดอกไม้',
      price: 55.00,
      stock: 8,
      status: 'ใช้งานอยู่',
      image: 'https://images.unsplash.com/photo-1577378978713-9bebf3db8312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    },
    {
      id: 5,
      name: 'แจกันแก้ว',
      category: 'แจกัน',
      price: 25.00,
      stock: 30,
      status: 'ใช้งานอยู่',
      image: 'https://images.unsplash.com/photo-1715028241504-b66bf0bf1910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    },
    {
      id: 6,
      name: 'แจกันเซรามิก',
      category: 'แจกัน',
      price: 32.00,
      stock: 5,
      status: 'สต็อกต่ำ',
      image: 'https://images.unsplash.com/photo-1761330439582-c7fd39368cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/manager/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>กลับสู่แดชบอร์ด</span>
          </button>
          <h1 className="text-2xl text-gray-900">จัดการสินค้า</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาสินค้า..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>เพิ่มสินค้า</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.status === 'ใช้งานอยู่' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-2xl text-blue-600">฿${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">สต็อก: {product.stock} ชิ้น</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span>แก้ไข</span>
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl mb-6 text-gray-900">เพิ่มสินค้าใหม่</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-800">ชื่อสินค้า</label>
                <input
                  type="text"
                  placeholder="กรอกชื่อสินค้า"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-800">หมวดหมู่</label>
                  <select className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none">
                    <option>ช่อดอกไม้</option>
                    <option>แจกัน</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-gray-800">ราคา</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-gray-800">จำนวนสต็อก</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-800">คำอธิบาย</label>
                <textarea
                  rows={3}
                  placeholder="กรอกคำอธิบายสินค้า"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-800">รูปภาพสินค้า</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <input type="file" className="hidden" id="product-image" />
                  <label htmlFor="product-image" className="cursor-pointer">
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">คลิกเพื่ออัปโหลดรูปภาพ</p>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  alert('Product added!');
                  setShowAddModal(false);
                }}
                className="flex-1 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
              >
                เพิ่มสินค้า
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}