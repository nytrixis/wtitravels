export const reducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = (): boolean => matchMedia('(hover: hover) and (pointer: fine)').matches;
