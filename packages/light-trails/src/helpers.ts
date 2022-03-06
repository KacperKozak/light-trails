export const mapValues = <T, R>(
    object: { [key: string]: T },
    mapFunction: (value: T) => R,
) =>
    Object.fromEntries(
        Object.entries(object).map(([key, value]) => [key, mapFunction(value)]),
    )

export const limit = (value: number, min = 0, max = 1) =>
    Math.min(Math.max(value, min), max)

export const querySelector = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement | null

    if (!element) {
        throw new Error(`[light-trails] Element (${selector}) not found`)
    }

    return element
}
