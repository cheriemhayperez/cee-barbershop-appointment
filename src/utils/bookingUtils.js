export function barberText(barber, barberLabel, forOwner = false) {
  if (barber === 'any') {
    return forOwner ? 'No preference' : 'Any available barber';
  }

  return barberLabel;
}
