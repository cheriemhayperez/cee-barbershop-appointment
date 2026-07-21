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
  const weekDates = getWeekDates();
  const priceMap = Object.fromEntries(services.map((s) => [s.name, parsePrice(s.price)]));

  const confirmed = appointments.filter((a) => a.status === 'confirmed');
  const pending = appointments.filter((a) => a.status === 'pending');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');
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
    .sort((a, b) => b.count - a.count);

  const weeklyTrend = weekDates.map((date) => ({
    date,
    label: new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' }),
    count: appointments.filter((a) => a.date === date).length,
  }));

  const maxWeekly = Math.max(...weeklyTrend.map((d) => d.count), 1);
  const maxService = Math.max(...popularServices.map((s) => s.count), 1);
  const maxBarber = Math.max(...barberBookings.map((b) => b.count), 1);

  const upcoming = [...appointments]
    .filter((a) => a.status !== 'cancelled')
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 5);

  const activeBarbers = barbers.filter((b) => b.status === 'active').length;
  const avgVisits = customers.length
    ? (customers.reduce((s, c) => s + c.visits, 0) / customers.length).toFixed(1)
    : '0';

  return {
    kpis: [
      { label: "Today's Appointments", value: String(todayAppts.length), hint: todayAppts.length ? 'Scheduled for today' : 'None today' },
      { label: 'Total Bookings', value: String(appointments.length), hint: `${confirmed.length} confirmed` },
      { label: 'Pending', value: String(pending.length), hint: 'Awaiting confirmation' },
      { label: 'Customers', value: String(customers.length), hint: `${avgVisits} avg visits` },
      { label: 'Active Barbers', value: String(activeBarbers), hint: `${services.filter((s) => s.status === 'active').length} services live` },
    ],
    statusBreakdown: [
      { label: 'Confirmed', count: confirmed.length, color: '#2e7d32' },
      { label: 'Pending', count: pending.length, color: '#f57f17' },
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
