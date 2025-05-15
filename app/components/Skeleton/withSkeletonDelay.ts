export function withSkeletonDelay(setSkeleton: (val: boolean) => void, delay = 800) {
    const timeoutId = setTimeout(() => {
      setSkeleton(true);
    }, delay);
  
    return () => {
      clearTimeout(timeoutId);
      setSkeleton(false);
    };
  }
  