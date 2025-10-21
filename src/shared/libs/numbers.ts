export const isOdd = (num: number): boolean => Boolean(num % 2);

export const isEven = (num: number): boolean => !isOdd(num);
