import { SimpleTrailFunction } from '../types'

interface CascadeOptions {
    offset: (index: number) => number
}

export const cascade = (
    frames: SimpleTrailFunction[],
    options: CascadeOptions,
): SimpleTrailFunction => startAt =>
    frames.flatMap((frameFn, index) => {
        const offset = options.offset(index) + startAt
        return frameFn(offset)
    })
