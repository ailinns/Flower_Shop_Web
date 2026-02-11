import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingBag, TrendingUp, Users, Building2, LogOut, Package, Clock, Filter, X } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [dateRange, setDateRange] = useState('this-month');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [kpiView, setKpiView] = useState('revenue');
  const [productCategory, setProductCategory] = useState('all');
  const [operationalMetric, setOperationalMetric] = useState('all');
  const [compareMode, setCompareMode] = useState(false);

  const kpiData = [
    { label: 'รายได้รวม', value: '฿125,450', change: '+15%', color: 'bg-blue-500', icon: DollarSign },
    { label: 'คำสั่งซื้อทั้งหมด', value: '3,245', change: '+12%', color: 'bg-green-500', icon: ShoppingBag },
    { label: 'สาขาที่ใช้งานอยู่', value: '3', change: '0%', color: 'bg-purple-500', icon: Building2 },
    { label: 'ฐานลูกค้า', value: '1,892', change: '+8%', color: 'bg-orange-500', icon: Users }
  ];

  const monthlyRevenue = [
    { month: 'ม.ค.', revenue: 85000 },
    { month: 'ก.พ.', revenue: 92000 },
    { month: 'มี.ค.', revenue: 88000 },
    { month: 'เม.ย.', revenue: 95000 },
    { month: 'พ.ค.', revenue: 105000 },
    { month: 'มิ.ย.', revenue: 110000 },
    { month: 'ก.ค.', revenue: 115000 },
    { month: 'ส.ค.', revenue: 120000 },
    { month: 'ก.ย.', revenue: 118000 },
    { month: 'ต.ค.', revenue: 125000 },
    { month: 'พ.ย.', revenue: 130000 },
    { month: 'ธ.ค.', revenue: 125450 }
  ];

  const branchPerformance = [
    { branch: 'พิจิตร', revenue: 58000, orders: 1250 },
    { branch: 'แพร่', revenue: 42000, orders: 1100 },
    { branch: 'สงขลา', revenue: 25450, orders: 895 }
  ];

  const productCategoryData = [
    { name: 'ช่อดอกไม้', value: 65, color: '#4DA3FF' },
    { name: 'แจกัน', value: 25, color: '#14B8A6' },
    { name: 'อุปกรณ์เสริม', value: 10, color: '#F59E0B' }
  ];

  const topPerformers = [
    { name: 'สาขาใจพิจิตร', metric: 'รายได้สูงสุด', value: '฿58,000' },
    { name: 'ช่อกุหลาบสีชมพู', metric: 'ขายดีที่สุด', value: 'ขายได้ 1,245 ชิ้น' },
    { name: 'เบ้น ทองแท้ (ช่างจัดดอกไม้)', metric: 'คะแนนสูงสุด', value: '4.9/5.0' }
  ];

  const clearAllFilters = () => {
    setDateRange('this-month');
    setSelectedBranches([]);
    setKpiView('revenue');
    setProductCategory('all');
    setOperationalMetric('all');
    setCompareMode(false);
  };

  const toggleBranch = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter(id => id !== branchId));
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Executive Dashboard</h1>
              <p className="text-sm text-gray-600">ข้อมูลภาพรวมและ KPI ของบริษัท</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-500 text-white' : 'bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>ฟิลเตอร์</span>
              </button>
              <button
                onClick={() => navigate('/executive/users')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                จัดการสมาชิก
              </button>
              <button
                onClick={() => navigate('/executive/promotions')}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                จัดการโปรโมชั่น
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-gray-900">ตัวกรองข้อมูล</h3>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                ล้างทั้งหมด
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">ช่วงเวลา</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="today">วันนี้</option>
                  <option value="this-week">สัปดาห์นี้</option>
                  <option value="this-month">เดือนนี้</option>
                  <option value="this-year">ปีนี้</option>
                  <option value="last-month">เดือนที่แล้ว</option>
                  <option value="last-year">ปีที่แล้ว</option>
                  <option value="custom">กำหนดเอง</option>
                </select>
              </div>

              {/* Compare Mode Toggle */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">โหมดเปรียบเทียบ</label>
                <div className="flex items-center gap-3 h-[42px]">
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      compareMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {compareMode ? 'เปิด' : 'ปิด'}
                  </button>
                  <span className="text-sm text-gray-600">
                    {compareMode ? 'กำลังเปรียบเทียบกับช่วงก่อนหน้า' : 'ไม่เปรียบเทียบ'}
                  </span>
                </div>
              </div>

              {/* KPI View Selection */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">มุมมอง KPI</label>
                <select
                  value={kpiView}
                  onChange={(e) => setKpiView(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="revenue">รายได้</option>
                  <option value="orders">จำนวนออเดอร์</option>
                  <option value="aov">มูลค่าเฉลี่ยต่อออเดอร์ (AOV)</option>
                  <option value="growth">อัตราการเติบโต</option>
                </select>
              </div>

              {/* Product Category Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">หมวดหมู่สินค้า</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="bouquet">ช่อดอกไม้</option>
                  <option value="vase">แจกัน</option>
                  <option value="top-products">สินค้าขายดี Top 10</option>
                  <option value="comparison">เปรียบเทียบสัดส่วน</option>
                </select>
              </div>

              {/* Operational Metric Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">ตัวชี้วัดการดำเนินงาน</label>
                <select
                  value={operationalMetric}
                  onChange={(e) => setOperationalMetric(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="delivery-success">% จัดส่งสำเร็จ</option>
                  <option value="pending-orders">ออเดอร์ค้าง</option>
                  <option value="avg-fulfillment">เวลาเฉลี่ยการดำเนินการ</option>
                  <option value="payment-issues">ปัญหาการชำระเงิน</option>
                </select>
              </div>

              {/* Branch/Province Selection */}
              <div className="md:col-span-3">
                <label className="block text-sm text-gray-700 mb-2">เลือกสาขา</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setSelectedBranches([])}
                    className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                      selectedBranches.length === 0 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ทุกสาขา
                  </button>
                  <button
                    onClick={() => toggleBranch('phichit')}
                    className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                      selectedBranches.includes('phichit')
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    พิจิตร
                  </button>
                  <button
                    onClick={() => toggleBranch('phrae')}
                    className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                      selectedBranches.includes('phrae')
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    แพร่
                  </button>
                  <button
                    onClick={() => toggleBranch('songkhla')}
                    className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                      selectedBranches.includes('songkhla')
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    สงขลา
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            <div className="mt-6 flex flex-wrap gap-2">
              {dateRange !== 'this-month' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  ช่วงเวลา: {
                    dateRange === 'today' ? 'วันนี้' :
                    dateRange === 'this-week' ? 'สัปดาห์นี้' :
                    dateRange === 'this-year' ? 'ปีนี้' :
                    dateRange === 'last-month' ? 'เดือนที่แล้ว' :
                    dateRange === 'last-year' ? 'ปีที่แล้ว' : 'กำหนดเอง'
                  }
                  <button onClick={() => setDateRange('this-month')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {compareMode && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2">
                  โหดเปรียบเทียบ: เปิด
                  <button onClick={() => setCompareMode(false)} className="hover:bg-purple-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBranches.length > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                  สาขาที่เลือก: {selectedBranches.length} สาขา
                  <button onClick={() => setSelectedBranches([])} className="hover:bg-green-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {kpiView !== 'revenue' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  KPI: {kpiView === 'orders' ? 'จำนวนออเดอร์' : kpiView === 'aov' ? 'AOV' : 'อัตราการเติบโต'}
                  <button onClick={() => setKpiView('revenue')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {productCategory !== 'all' && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center gap-2">
                  หมวดหมู่: {
                    productCategory === 'bouquet' ? 'ช่อดอกไม้' :
                    productCategory === 'vase' ? 'แจกัน' :
                    productCategory === 'top-products' ? 'Top 10' : 'เปรียบเทียบ'
                  }
                  <button onClick={() => setProductCategory('all')} className="hover:bg-orange-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.color} rounded-xl flex items-center justify-center`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  kpi.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-3xl text-gray-900 mb-1">{kpi.value}</p>
              <p className="text-sm text-gray-600">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl mb-6 text-gray-900">แนวโน้มรายได้รายเดือน</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#4DA3FF" strokeWidth={3} dot={{ fill: '#4DA3FF', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Performance & Product Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Branch Performance */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl mb-6 text-gray-900">ผลการดำเนินงานของสาขา</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#4DA3FF" radius={[8, 8, 0, 0]} name="รายได้ ($)" />
                <Bar yAxisId="right" dataKey="orders" fill="#14B8A6" radius={[8, 8, 0, 0]} name="คำสั่งซื้อ" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product Categories */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl mb-6 text-gray-900">ยอดขายตามหมวดหมู่</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl mb-6 text-gray-900">ผลงานชั้นนำ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {topPerformers.map((performer, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">{performer.metric}</p>
                    <p className="text-gray-900">{performer.name}</p>
                  </div>
                </div>
                <p className="text-2xl text-blue-600">{performer.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Branch Details Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl text-gray-900">รายละเอียดสาขา</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">สาขา</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">รายได้</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">คำสั่งซื้อ</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">มูลค่าเฉลี่ยต่อคำสั่งซื้อ</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">พนักงาน</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {branchPerformance.map((branch, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-900">สาขา{branch.branch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">${branch.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-900">{branch.orders}</td>
                    <td className="px-6 py-4 text-gray-900">${(branch.revenue / branch.orders).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-900">{8 + index * 2}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        ใช้งานอยู่
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}