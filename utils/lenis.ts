type LenisInstance = {
  scroll: number;
  on: (event: string, callback: (args: { scroll: number }) => void) => void;
  off: (event: string, callback: (args: { scroll: number }) => void) => void;
};

export function getLenis(): LenisInstance | undefined {
  return (window as Window & { __lenis?: LenisInstance }).__lenis;
}

export function onLenisScroll(callback: (scroll: number) => void): () => void {
  let detach: (() => void) | undefined;

  const attach = () => {
    const lenis = getLenis();
    if (!lenis) return false;

    const handler = ({ scroll }: { scroll: number }) => callback(scroll);
    lenis.on('scroll', handler);
    callback(lenis.scroll);
    detach = () => lenis.off('scroll', handler);
    return true;
  };

  if (attach()) {
    return () => detach?.();
  }

  const intervalId = window.setInterval(() => {
    if (attach()) window.clearInterval(intervalId);
  }, 50);

  return () => {
    window.clearInterval(intervalId);
    detach?.();
  };
}
