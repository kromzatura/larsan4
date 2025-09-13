export const formatDate = (date: string): string => {
  // Extract just the date part (YYYY-MM-DD) to avoid timezone issues
  const dateOnly = date.split("T")[0];

  // Create date object treating it as local time
  const dateObj = new Date(dateOnly + "T00:00:00");

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return dateObj.toLocaleDateString("en-US", options);
};
