export function overrideLocalStorageBehaviour() {
  const originalSetItem = localStorage.setItem;

  localStorage.setItem = function (key: string, value: string) {
    // Call the original setItem
    originalSetItem.call(this, key, value);

    // Dispatch the custom event
    const event = new Event("itemInserted", {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  };
}
