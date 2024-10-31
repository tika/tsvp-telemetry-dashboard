import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Capitalise each letter of a string
export function capitalise(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
