export function timeFilter(seconds: number, type?: string) {
  const hours = seconds / 3600;
  const wholeHours = Math.floor(hours);
  const roundedHours = Math.round(hours);
  const minutes = Math.floor((hours - wholeHours) * 60);
  if (type == "hours") {
    return `${roundedHours}h`;
  }
  if (hours >= 1) {
    return `${wholeHours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
