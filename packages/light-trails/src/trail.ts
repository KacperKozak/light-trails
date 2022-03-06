import { findRenderer } from './renderers/findRenderer'
import { Renderer, SimpleTrailFunction, TrailFunction } from './types'

export const trail = (
    target: Renderer | ElementCSSInlineStyle | string,
    operators: TrailFunction[],
): SimpleTrailFunction => {
    const renderer = findRenderer(target)

    return (startAt) => {
        let offset = startAt

        const frames = operators
            .map((operator) => {
                let frame = operator(offset)

                if (typeof frame === 'function') {
                    frame = frame(renderer)
                }

                offset += Math.max(...frame.map((frame) => frame.duration))
                return frame
            })
            .flat()

        return frames
    }
}
