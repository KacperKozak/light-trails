const { pow, sin } = Math
const PI = Math.PI

export const easeInOut = (n: number) => 0.5 * (sin((n - 0.5) * PI) + 1)
export const easeIn = (n: number) => pow(n, 1.675)
export const easeOut = (n: number) => 1 - pow(1 - n, 1.675)
export const linear = (x: number) => x
