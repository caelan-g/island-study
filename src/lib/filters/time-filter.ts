/**
 * Formats time duration from seconds into human readable string
 *
 * Formats:
 * - Hours only: "5h"
 * - Hours and minutes: "5h 30m"
 * - Minutes only: "45m"
 *
 * Calculation:
 * - Converts seconds to hours
 * - Extracts whole hours
 * - Calculates remaining minutes
 * - Rounds hours when type is "hours"
 *
 * @param seconds - Duration in seconds to format
 * @param type - Optional "hours" to show only hours
 * @returns Formatted time string
 */
export function timeFilter(seconds: number, type?: string) {
  if (seconds < 0) {
    return "-";
  } else {
    try {
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
    } catch (error) {
      console.log("Error in timeFilter:", error);
      return "0m"; // Fallback value
    }
  }
}
