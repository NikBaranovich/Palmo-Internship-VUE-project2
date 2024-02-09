let timeout = null;

export function debounce(func, delayMs) {
  return new Promise((resolve, reject) => {

    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await func();
      resolve();
    }, delayMs || 100);
  });
}
