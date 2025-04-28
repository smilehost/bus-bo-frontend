// src/utils/debounce.ts
export function debounce<F extends (...args: any[]) => void>(func: F, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }
  