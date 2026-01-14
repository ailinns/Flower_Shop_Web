import { BouquetStyle } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BouquetStyleSelectionProps {
  onSelect: (style: BouquetStyle) => void;
}

export function BouquetStyleSelection({ onSelect }: BouquetStyleSelectionProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/50 max-w-2xl mx-auto">
          <h1 className="mb-2 text-gray-900">เลือกแบบช่อ</h1>
          <p className="text-gray-700">เลือกรูปแบบช่อดอกไม้ที่คุณชอบ</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Round Bouquet */}
          <button
            onClick={() => onSelect('round')}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border-2 hover:border-[#62C4FF]"
            style={{ borderColor: '#f3f4f6' }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1612796495278-65e44b09325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3VuZCUyMGZsb3dlciUyMGJvdXF1ZXR8ZW58MXx8fHwxNzY0NjcyNjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="ช่อแบบกลม"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-gray-800">แบบกลม</h3>
              <p className="text-gray-600 text-sm">ช่อดอกไม้ทรงกลมสวยงาม ดูน่ารักและอบอุ่น</p>
            </div>
          </button>

          {/* Long Bouquet */}
          <button
            onClick={() => onSelect('long')}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border-2 hover:border-[#62C4FF]"
            style={{ borderColor: '#f3f4f6' }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1762394947969-b798082075fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25nJTIwZmxvd2VyJTIwYm91cXVldHxlbnwxfHx8fDE3NjQ2NzI2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="ช่อแบบยาว"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-gray-800">แบบยาว</h3>
              <p className="text-gray-600 text-sm">ช่อดอกไม้ทรงยาวสง่างาม ดูหรูหราและโดดเด่น</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}