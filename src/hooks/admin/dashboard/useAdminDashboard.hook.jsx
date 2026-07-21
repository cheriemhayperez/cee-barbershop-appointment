import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { getDashboardAnalytics } from '@/utils/dashboardAnalytics';

export function useAdminDashboard() {
  const appointments = useSelector((state) => state.appointments.appointments);
  const barbers = useSelector((state) => state.barbers.barbers);
  const services = useSelector((state) => state.services.services);
  const customers = useSelector((state) => state.customers.customers);

  const [selectedDate, setSelectedDate] = useState(null);
  const [dayModalOpen, setDayModalOpen] = useState(false);

  const analytics = useMemo(
    () => getDashboardAnalytics({ appointments, barbers, services, customers }),
    [appointments, barbers, services, customers]
  );

  const dayAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter((appt) => appt.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    setDayModalOpen(true);
  };

  const closeDayModal = () => setDayModalOpen(false);

  return {
    appointments,
    analytics,
    selectedDate,
    dayModalOpen,
    dayAppointments,
    handleDateSelect,
    closeDayModal,
  };
}
