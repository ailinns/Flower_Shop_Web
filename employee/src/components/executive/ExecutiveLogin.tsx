import { BarChart3, Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExecutiveLoginProps {
  onLogin: () => void;
}

export default function ExecutiveLogin({ onLogin }: ExecutiveLoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/employee/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
        return;
      }
      onLogin();
      navigate('/executive/dashboard');
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl mb-2 text-gray-900">เข้าสู่ระบบผู้บริหาร</h1>
            <p className="text-gray-600">ดูข้อมูลภาพรวมของบริษัท</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="text-red-600">{error}</div>}
            <div>
              <label className="block mb-2 text-gray-800">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="executive"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-800 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรุณากรอกรหัสผ่าน"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}