export const serviceCatalog = [
  { name: 'Classic Cut', price: '$25', duration: '30 min', desc: 'Scissor or clipper cut with hot towel finish.' },
  { name: 'Fade & Beard', price: '$35', duration: '45 min', desc: 'Skin fade plus beard trim and line-up.' },
  { name: 'Hot Towel Shave', price: '$30', duration: '30 min', desc: 'Traditional straight-razor shave experience.' },
  { name: 'Kids Cut', price: '$18', duration: '25 min', desc: 'Gentle cuts for ages 12 and under.' },
  { name: 'Buzz Cut', price: '$20', duration: '20 min', desc: 'Clean, even buzz with optional fade.' },
  { name: 'VIP Package', price: '$55', duration: '75 min', desc: 'Cut, beard, hot towel, and scalp massage.' },
];

export const initialServices = serviceCatalog.map((item, index) => ({
  id: String(index + 1),
  name: item.name,
  price: item.price,
  duration: item.duration,
  status: 'active',
}));
