import { Renderer, Values } from '../types'

export const styleRenderer = (selector: ElementCSSInlineStyle | string): Renderer => {
    const element = selectElement(selector)

    const renderer: Renderer = values => {
            const {
                text,
                x,
                y,
                scale,
                scaleX,
                scaleY,
                skewX,
                skewY,
                rotate,
                ...styles
            } = values

            setCssValue(element, styles)

            if (text !== undefined) {
                element.textContent = text
            }

            const transform = getTransform({
                x,
                y,
                scale,
                scaleX,
                scaleY,
                skewX,
                skewY,
                rotate,
            })

            if (transform) {
                setCssValue(element, { transform })
            }
        }

        // Only for inspector
    ;(renderer as any).__EL = element

    return renderer
}

const selectElement = (selector: ElementCSSInlineStyle | string) => {
    if (typeof selector === 'string') {
        const element = document.querySelector(selector) as HTMLElement | null

        if (!element) {
            throw new Error(`[lighting] Element (${selector}) not found`)
        }

        return element
    }

    return selector as HTMLElement
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

    if (values.scaleX !== undefined) {
        val.push(`scaleX(${values.scaleX})`)
    }

    if (values.scaleY !== undefined) {
        val.push(`scaleY(${values.scaleY})`)
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
