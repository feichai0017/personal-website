// Deterministic pseudo-random helpers to avoid hydration mismatches.
export const createSeededRandom = (seed: number) => {
  let current = seed;
  return () => {
    const x = Math.sin(current) * 10000;
    current += 1;
    return x - Math.floor(x);
  };
};

export const seedFromString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 1;
};
