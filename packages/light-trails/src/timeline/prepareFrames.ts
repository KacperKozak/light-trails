import { TrailFrame } from '../types'

// @TODO make this immutable
export const prepareFrames = (frames: TrailFrame[]) => {
    frames.sort((a, b) => a.startAt - b.startAt)

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i]
        const prevFrame = frames[i - 1]
        const nextFrame = frames[i + 1]

        if (prevFrame && prevFrame.startAt === frame.startAt) {
            frame.startIndex = prevFrame.startIndex! + 1
        } else if (nextFrame && nextFrame.startAt === frame.startAt) {
            frame.startIndex = 1
        }
    }

    return frames
}
