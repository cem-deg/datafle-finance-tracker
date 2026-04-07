"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

export function useFlashMessage(
  message: string | null,
  setMessage: Dispatch<SetStateAction<string | null>>,
  duration = 4000
) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMessage(null);
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [duration, message, setMessage]);
}
