import { SimpleTrailFunction } from '../types'
import { totalDuration } from '../timeline/totalDuration'

export const sequence =
    (frames: SimpleTrailFunction[]): SimpleTrailFunction =>
    (startAt) => {
        let offset = startAt
        return frames.flatMap((frameFn) => {
            const frame = frameFn(offset)
            offset = totalDuration(frame)
            return frame
        })
    }
