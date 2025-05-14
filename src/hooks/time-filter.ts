export function timeFilter(seconds: number) {
  const hours = seconds / 3600;
  const wholeHours = Math.floor(hours);
  const minutes = Math.floor((hours - wholeHours) * 60);

  if (hours >= 1) {
    return `${wholeHours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
