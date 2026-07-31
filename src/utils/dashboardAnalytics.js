const parsePrice = (priceStr) => {
  const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const getWeekDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};

export function getDashboardAnalytics({ appointments, services, barbers, customers }) {
  const today = todayIso();
  const currentMonth = today.slice(0, 7);
  const weekDates = getWeekDates();
  const priceMap = Object.fromEntries(services.map((s) => [s.name, parsePrice(s.price)]));

  const monthAppointments = appointments.filter((a) => a.date.startsWith(currentMonth));
  const confirmed = monthAppointments.filter((a) => a.status === 'confirmed');
  const completed = monthAppointments.filter((a) => a.status === 'completed');
  const cancelled = monthAppointments.filter((a) => a.status === 'cancelled');
  const todayAppts = appointments.filter((a) => a.date === today);

  const serviceCounts = appointments.reduce((acc, a) => {
    acc[a.service] = (acc[a.service] ?? 0) + 1;
    return acc;
  }, {});

  const popularServices = Object.entries(serviceCounts)
    .map(([name, count]) => ({ name, count, revenue: count * (priceMap[name] ?? 0) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const barberCounts = appointments
    .filter((a) => a.barber && a.barber !== 'No preference')
    .reduce((acc, a) => {
      acc[a.barber] = (acc[a.barber] ?? 0) + 1;
      return acc;
    }, {});

  const barberBookings = Object.entries(barberCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const weeklyTrend = weekDates.map((date) => ({
    date,
    label: new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' }),
    count: appointments.filter((a) => a.date === date).length,
  }));

  const maxWeekly = Math.max(...weeklyTrend.map((d) => d.count), 1);
  const maxService = Math.max(...popularServices.map((s) => s.count), 1);
  const maxBarber = Math.max(...barberBookings.map((b) => b.count), 1);

  const upcoming = [...appointments]
    .filter((a) => a.status === 'confirmed')
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 5);

  const activeBarbers = barbers.filter((b) => b.status === 'active').length;

  return {
    kpis: [
      { label: 'Today', value: String(todayAppts.length), accent: 'gold', icon: 'calendar' },
      { label: 'Bookings', value: String(appointments.length), accent: 'blue', icon: 'bookings' },
      { label: 'Completed', value: String(completed.length), accent: 'green', icon: 'completed' },
      { label: 'Customers', value: String(customers.length), accent: 'violet', icon: 'customers' },
      { label: 'Barbers', value: String(activeBarbers), accent: 'bronze', icon: 'barbers' },
    ],
    statusBreakdown: [
      { label: 'Confirmed', count: confirmed.length, color: '#2e7d32' },
      { label: 'Completed', count: completed.length, color: '#1565c0' },
      { label: 'Cancelled', count: cancelled.length, color: '#c62828' },
    ],
    popularServices,
    barberBookings,
    weeklyTrend,
    maxWeekly,
    maxService,
    maxBarber,
    upcoming,
  };
}
