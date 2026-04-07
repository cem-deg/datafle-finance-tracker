"use client";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function getLocalDateInputValue(input: Date = new Date()): string {
  return [
    input.getFullYear(),
    pad(input.getMonth() + 1),
    pad(input.getDate()),
  ].join("-");
}

export function getLocalMonthInputValue(input: Date = new Date()): string {
  return [input.getFullYear(), pad(input.getMonth() + 1)].join("-");
}
