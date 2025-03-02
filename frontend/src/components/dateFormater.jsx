import React from "react";

function FormatLastSeen({ dateString }) {
  if (!dateString) return "";

  const givenDate = new Date(dateString);
  const currentDate = new Date();
  const diffInMs = currentDate - givenDate;

  // Convert to different time units
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Show appropriate time format
  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    // For older dates, show the full date and time
    return givenDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export default FormatLastSeen;
