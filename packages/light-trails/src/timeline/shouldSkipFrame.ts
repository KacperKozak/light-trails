import { TrailFrame } from '../types'

export const shouldSkipFrame = (
    currentTime: number,
    currentTimeIndex: number,
    frame: TrailFrame,
) => {
    if (frame.startAt > currentTime) return true
    if (frame.startAt === currentTime && frame.startIndex > currentTimeIndex) return true
    return false
}
