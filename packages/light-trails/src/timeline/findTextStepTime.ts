import { TrailFrame, FrameType } from '../types'

interface NextStepTime {
    nextTime: number
    pause: boolean
    end: boolean
    nextTimeIndex: number
}

export const findTextStepTime = (
    prevTime: number,
    prevTimeIndex: number,
    nextTime: number,
    total: number,
    frames: TrailFrame[],
): NextStepTime => {
    for (const frame of frames) {
        if (
            frame.type === FrameType.Pause &&
            frame.startAt >= prevTime &&
            frame.startAt <= nextTime &&
            frame.startIndex > prevTimeIndex
        ) {
            return {
                nextTime: frame.startAt,
                nextTimeIndex: frame.startIndex,
                pause: true,
                end: false,
            }
        }
    }

    if (nextTime > total) {
        return {
            nextTime: total,
            nextTimeIndex: 0,
            pause: true,
            end: true,
        }
    }

    return {
        nextTime,
        nextTimeIndex: 0,
        pause: false,
        end: false,
    }
}
