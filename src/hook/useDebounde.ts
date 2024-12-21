import { createSignal, onCleanup, createEffect } from "solid-js";

export function useDebounce<T>(value: () => T, delay: number) {
  const [debouncedValue, setDebouncedValue] = createSignal<T>(value());
  let timeoutId: ReturnType<typeof setTimeout>;

  const cleanup = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  // Watch for changes to the value
  createEffect(() => {
    const currentValue = value(); // Track the current value
    cleanup(); // Clear any pending timeout
    //@ts-ignore
    timeoutId = setTimeout(() => setDebouncedValue(currentValue), delay);
  });

  // Clean up the timeout when the component unmounts
  onCleanup(cleanup);

  return debouncedValue;
}
