import "server-only";

const updatedAt = new Date();

export function getSiteUpdated(): { dateTime: string; label: string } {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  }).format(updatedAt);

  return {
    dateTime: updatedAt.toISOString().slice(0, 10),
    label: `Last Updated: ${formattedDate}`,
  };
}
