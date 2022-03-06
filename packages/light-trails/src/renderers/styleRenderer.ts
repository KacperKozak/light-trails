import { Renderer, Values } from '../types'

export const styleRenderer = (element: ElementCSSInlineStyle | HTMLElement): Renderer => {
    const renderer: Renderer = (values) => {
        const { text, x, y, scale, scaleX, scaleY, skewX, skewY, rotate, ...styles } =
            values

        setCssValue(element, styles)

        if (text !== undefined && element instanceof HTMLElement) {
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

export const setCssValue = (el: ElementCSSInlineStyle, value: any) => {
    Object.assign(el.style, value)
}
