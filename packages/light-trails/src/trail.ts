import { styleRenderer } from './renderers/styleRenderer'
import { Renderer, SimpleTrailFunction, TrailFunction } from './types'

export const trail = (
    target: Renderer | ElementCSSInlineStyle | string,
    operators: TrailFunction[],
): SimpleTrailFunction => {
    const renderer = findRenderer(target)

    return startAt => {
        let offset = startAt

        const frames = operators
            .map(operator => {
                let frame = operator(offset)

                if (typeof frame === 'function') {
                    frame = frame(renderer)
                }

                offset += Math.max(...frame.map(frame => frame.duration))
                return frame
            })
            .flat()

        return frames
    }
}

const findRenderer = (target: Renderer | ElementCSSInlineStyle | string): Renderer => {
    if (typeof target === 'function') {
        return target
    }

    if (
        typeof target === 'string' ||
        target instanceof HTMLElement ||
        target instanceof SVGElement
    ) {
        return styleRenderer(target)
    }

    throw new Error(`[lighting:animate] Invalid renderer (${(target as any).toString()})`)
}
