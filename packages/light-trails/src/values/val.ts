export const val =
    (a: number, b: number, suffix?: string) =>
    (n: number): string | number => {
        const val = (b - a) * n + a
        return suffix ? val + suffix : val
    }

export const valChain = (a: number, suffix?: string) => {
    let pref = a
    return (b: number) => {
        const newVal = val(pref, b, suffix)
        pref = b
        return newVal
    }
}
