import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye, CheckCircle, Clock, XCircle, LogOut } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  date: string;
  paymentMethod: string;
}

interface Employee {
  name: string;
  surname: string;
  branch_id: number;
}

export default function CashierDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [branchName, setBranchName] = useState('');

  // Load employee data and orders
  useEffect(() => {
    // Load employee data from localStorage
    const savedEmployee = localStorage.getItem('cashier_employee');
    console.log('Saved Employee:', savedEmployee);
    console.log("order",orders)
    if (savedEmployee) {
      const employeeData = JSON.parse(savedEmployee);
      setEmployee(employeeData);
      
      // Fetch branch name
      if (employeeData.branch_id) {
        fetch(`http://localhost:3000/api/branches`)
          .then(res => res.json())
          .then((branches: any[]) => {
            const branch = branches.find(b => b.branch_id === employeeData.branch_id);
            if (branch) {
              setBranchName(branch.branch_name);
            }
          })
          .catch(err => console.error('Failed to load branches:', err));
      }
    }

    // Load orders from backend API
    const employeeData = JSON.parse(savedEmployee || '{}');
    if (employeeData.branch_id) {
      fetch(`http://localhost:3000/api/order/branches/${employeeData.branch_id}`)
        .then(res => res.json())
        .then(data => {
          console.log('Fetched Orders Data:', data[0]);
          // Map database order fields to Order interface
          const mappedOrders = (Array.isArray(data) ? data : []).map((order: any) => ({
            id: order.order_code || order.order_id,
            customerName: order.customer_name || 'Unknown',
            phone: order.phone || '',
            total:  Number(order.total_amount) || 0,
            status: order.order_status,
            date: order.created_at ? new Date(order.created_at).toLocaleString('th-TH') : 'N/A',
            paymentMethod: order.payment_method_name || 'Unknown'
          }));
          console.log('data Orders:', data);
          console.log('Mapped Orders:', mappedOrders);
          setOrders(mappedOrders);
        })
        .catch(err => console.error('Failed to load orders:', err));
    }


  }, []);

  const getStatusBadge = (status: string) => {
    const badges = {
      'received': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
        label: 'กำลังรอการยืนยัน'
      },
      'preparing': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: 'ยืนยันสำเร็จ'
      },
      'rejected': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        label: 'ปฎิเสธ'
      }
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text} flex items-center gap-1 w-fit`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'กำลังรอการยืนยัน', value: orders.filter(o => o.status === 'received').length, color: 'bg-yellow-500' },
    { label: 'ยืนยันสำเร็จ', value: orders.filter(o => o.status === 'preparing').length, color: 'bg-green-500' },
    { label: 'จำนวนคำสั่งซื้อ', value: orders.length, color: 'bg-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Cashier Dashboard</h1>
              <p className="text-sm text-gray-600">จัดการและยืนยันคำสั่งซื้อ</p>
              {employee && branchName && (
                <p className="text-sm text-gray-500 mt-2">
                  <span className="text-gray-700">สาขา: <span className="font-semibold">{branchName}</span> | พนักงาน: <span className="font-semibold">{employee.name} {employee.surname}</span></span>
                </p>
              )}
            </div>
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

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                  {stat.value}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหารหัสคำสั่งซื้อ"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="received">กำลังรอ</option>
                <option value="preparing">ยืนยันเรียบร้อย</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">รหัสคำสั่งซื้อ</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">ชื่อลูกค้า</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">จำนวน</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">สถานะ</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">วันที่สั่งซื้อ</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">เพิ่มเติม</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-blue-600">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ฿{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/cashier/order/${order.id}`, { state: { order } })}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
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
