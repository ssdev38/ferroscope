import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseRAM(ram: string): number {
  const value = parseFloat(ram);
  if (ram.includes('GiB')) return value;
  if (ram.includes('MiB')) return value / 1024;
  if (ram.includes('TiB')) return value * 1024;
  return value;
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
  });
}