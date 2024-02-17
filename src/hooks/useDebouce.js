let timeout = null;

export function debounce(func, delayMs = 300) {
  return new Promise((resolve, reject) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await func();
      resolve();
    }, delayMs);
  });
}
