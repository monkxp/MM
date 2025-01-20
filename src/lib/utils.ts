import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateJoinCode() {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function genUUIDv4() {
  return uuidv4();
}
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

export function formatDateHeader(date: Date): string {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (date.toDateString() === today) {
    return "Today";
  }

  if (date.toDateString() === yesterday) {
    return "Yesterday";
  }

  // Format: "Sunday, January 12th"
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formatted = formatter.format(date);
  const day = date.getDate();
  const suffix = getDaySuffix(day);

  // Replace the day number with day + suffix
  return formatted.replace(day.toString(), day + suffix);
}

export function getDaySuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function getAttachmentName(path: string) {
  return path.split("/").pop()?.split(".")[1];
}

export const sanitizeS3Key = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9-_\.]/g, "-") // Replace unsafe chars with hyphen
    .replace(/\s+/g, "-") // Replace spaces with hyphen
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .toLowerCase(); // Convert to lowercase
};

export function getFileType(path: string) {
  const fileType = path.split(".").pop();
  switch (fileType) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "tiff":
    case "ico":
    case "webp":
      return "image";
    // case "mp4":
    // case "avi":
    // case "mov":
    // case "wmv":
    // case "flv":
    //   return "video";
    // case "mp3":
    // case "wav":
    // case "ogg":
    // case "aac":
    //   return "audio";
    case "pdf":
      return "pdf";
    default:
      return "file";
  }
}
