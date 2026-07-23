import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from '@/layouts/admin/AdminLayout';
import CustomerLayout from '@/layouts/customer/CustomerLayout';

const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard/AdminDashboard'));
const AdminAppointments = lazy(() => import('@/pages/admin/Appointments/AdminAppointments'));
const AdminBarbers = lazy(() => import('@/pages/admin/Barbers/AdminBarbers'));
const AdminServices = lazy(() => import('@/pages/admin/Services/AdminServices'));
const AdminCustomers = lazy(() => import('@/pages/admin/Customers/AdminCustomers'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings/AdminSettings'));
const AdminSettingsLayout = lazy(() => import('@/pages/admin/Settings/AdminSettingsLayout'));
const AdminScheduleMaintenance = lazy(() => import('@/pages/admin/Settings/AdminScheduleMaintenance'));
const CustomerHome = lazy(() => import('@/pages/customer/Home/CustomerHome'));
const CustomerAbout = lazy(() => import('@/pages/customer/CustomerAbout'));
const CustomerBook = lazy(() => import('@/pages/customer/CustomerBook'));
const CustomerServices = lazy(() => import('@/pages/customer/CustomerServices'));
const CustomerContact = lazy(() => import('@/pages/customer/CustomerContact'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<CustomerHome />} />
        <Route path="about" element={<CustomerAbout />} />
        <Route path="services" element={<CustomerServices />} />
        <Route path="contact" element={<CustomerContact />} />
        <Route path="book" element={<CustomerBook />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="barbers" element={<AdminBarbers />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="settings" element={<AdminSettingsLayout />}>
          <Route index element={<AdminSettings />} />
          <Route path="schedule" element={<AdminScheduleMaintenance />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
