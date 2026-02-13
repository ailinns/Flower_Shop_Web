import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';

// Cashier Pages
import CashierLogin from './components/cashier/CashierLogin';
import CashierDashboard from './components/cashier/CashierDashboard';
import CashierOrderDetail from './components/cashier/CashierOrderDetail';

// Florist Pages
import FloristLogin from './components/florist/FloristLogin';
import FloristDashboard from './components/florist/FloristDashboard';
import FloristOrderDetail from './components/florist/FloristOrderDetail';

// Rider Pages
import RiderLogin from './components/rider/RiderLogin';
import RiderDashboard from './components/rider/RiderDashboard';
import RiderDeliveryDetail from './components/rider/RiderDeliveryDetail';

// Manager Pages
import ManagerLogin from './components/manager/ManagerLogin';
import ManagerDashboard from './components/manager/ManagerDashboard';
import ProductManagement from './components/manager/ProductManagement';
import OrderHistory from './components/manager/OrderHistory';
import PromotionManagement from './components/manager/PromotionManagement';

// Executive Pages
import ExecutiveLogin from './components/executive/ExecutiveLogin';
import ExecutiveDashboard from './components/executive/ExecutiveDashboard';
import ExecutivePromotionManagement from './components/executive/PromotionManagement';
import UserManagement from './components/executive/UserManagement';

// Home/Landing
import Landing from './components/Landing';

export default function App() {
  const [userRole, setUserRole] = useState<string | null>(null);

  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />
        
        {/* Cashier */}
        <Route path="/cashier/login" element={<CashierLogin onLogin={() => setUserRole('cashier')} />} />
        <Route path="/cashier/dashboard" element={<CashierDashboard />} />
        <Route path="/cashier/order/:orderId" element={<CashierOrderDetail />} />
        
        {/* Florist */}
        <Route path="/florist/login" element={<FloristLogin onLogin={() => setUserRole('florist')} />} />
        <Route path="/florist/dashboard" element={<FloristDashboard />} />
        <Route path="/florist/order/:orderId" element={<FloristOrderDetail />} />
        
        {/* Rider */}
        <Route path="/rider/login" element={<RiderLogin onLogin={() => setUserRole('rider')} />} />
        <Route path="/rider/dashboard" element={<RiderDashboard />} />
        <Route path="/rider/delivery/:orderId" element={<RiderDeliveryDetail />} />
        
        {/* Manager */}
        <Route path="/manager/login" element={<ManagerLogin onLogin={() => setUserRole('manager')} />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/products" element={<ProductManagement />} />
        <Route path="/manager/orders" element={<OrderHistory />} />
        <Route path="/manager/promotions" element={<PromotionManagement />} />
        
        {/* Executive */}
        <Route path="/executive/login" element={<ExecutiveLogin onLogin={() => setUserRole('executive')} />} />
        <Route path="/executive/dashboard" element={<ExecutiveDashboard />} />
        <Route path="/executive/promotions" element={<ExecutivePromotionManagement />} />
        <Route path="/executive/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}