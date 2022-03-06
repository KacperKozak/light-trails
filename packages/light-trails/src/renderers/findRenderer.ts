import { querySelector } from '../helpers'
import { Renderer } from '../types'
import { styleRenderer } from './styleRenderer'

export const findRenderer = (
    target: Renderer | ElementCSSInlineStyle | string,
): Renderer => {
    if (typeof target === 'function') {
        return target
    }

    const element = typeof target === 'string' ? querySelector(target) : target

    if (element instanceof HTMLElement || element instanceof SVGElement) {
        return styleRenderer(element)
    }

    throw new Error('[light-trails] Invalid renderer')
}
