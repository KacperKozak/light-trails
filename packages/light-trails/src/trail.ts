import { SimpleTrailFunction, TrailFunction, Renderer } from './types'
import { htmlElementRenderer } from './renderers/htmlElementRenderer'

export const trail = (
    target: Renderer | HTMLElement | string,
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

const findRenderer = (target: Renderer | HTMLElement | string): Renderer => {
    if (typeof target === 'function') {
        return target
    }

    if (typeof target === 'string' || target instanceof HTMLElement) {
        return htmlElementRenderer(target)
    }

    throw new Error(`[lighting:animate] Invalid renderer (${target!.toString()})`)
}
