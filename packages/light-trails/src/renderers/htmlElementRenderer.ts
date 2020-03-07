import { Renderer, Values } from '../types'

const selectElement = (selector: HTMLElement | string) => {
    if (typeof selector === 'string') {
        const element = document.querySelector(selector) as HTMLElement | null

        if (!element) {
            throw new Error(`[lighting] Element (${selector}) not found`)
        }

        return element
    }

    return selector as HTMLElement
}

export const htmlElementRenderer = (selector: HTMLElement | string): Renderer => {
    const element = selectElement(selector)

    const renderer: Renderer = values => {
        const { text, x, y, scale, skewX, skewY, ...styles } = values

        setCssValue(element, styles)

        if (text !== undefined) {
            element.textContent = text
        }

        const transform = getTransform({ x, y, scale, skewX, skewY })

        if (transform) {
            setCssValue(element, { transform })
        }
    }

    // @ts-ignore
    renderer.__EL = element

    return renderer
}

const getTransform = (values: Values) => {
    const val = []

    if (values.x !== undefined || values.y !== undefined) {
        const { x = 0, y = 0 } = values
        val.push(`translate(${x}, ${y})`)
    }

    if (values.rotate !== undefined) {
        val.push(`rotate(${values.rotate})`)
    }

    if (values.scale !== undefined) {
        val.push(`scale(${values.scale})`)
    }

    if (values.skewX !== undefined) {
        val.push(`skewX(${values.skewX})`)
    }

    if (values.skewY !== undefined) {
        val.push(`skewY(${values.skewY})`)
    }

    if (!val.length) {
        return undefined
    }

    return val.join(' ')
}

export const setCssValue = (el: HTMLElement, value: any) => {
    Object.assign(el.style, value)
}
