export const todayHelper = () => new Date().toISOString().split('T')[0];

export const isYesterday = (dateStr: string): boolean => {
  const inputDate = new Date(dateStr);
  const now = new Date();

  // Normalize both dates to midnight
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate.getTime() === yesterday.getTime();
}