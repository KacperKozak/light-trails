import { SimpleTrailFunction } from '../types'

export const parallel = (frames: SimpleTrailFunction[]): SimpleTrailFunction => startAt =>
    frames.flatMap(frameFn => frameFn(startAt))
