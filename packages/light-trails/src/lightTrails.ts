import { totalDuration } from './timeline/totalDuration'
import { TrailFrame, SimpleTrailFunction } from './types'
import { render } from './timeline/render'
import { findTextStepTime } from './timeline/findTextStepTime'
import { prepareFrames } from './timeline/prepareFrames'

export interface LightTrailsInstance {
    prepare: () => void
    play: () => void
    pause: () => void
    seek(t: number): void
    getStatus(): LightingStatus
    total: number
    __dev: {
        options: LightTrailsOptions
        frames: TrailFrame[]
    }
}

export interface LightingStatus {
    playing: boolean
    ended: boolean
    started: boolean
    currentTime: number
    currentTimeIndex: number
    total: number
}

interface LightTrailsOptions {
    onPlay?(): void
    onPause?(): void
    onComplete?(): void
    onUpdate?(): void
}

export const lightTrails = (
    trailFunction: SimpleTrailFunction,
    options: LightTrailsOptions = {},
): LightTrailsInstance => {
    let currentTime = 0
    let currentTimeIndex = 0
    let playing = false

    const frames = prepareFrames(trailFunction(0))
    const total = totalDuration(frames)

    const prepare = () => {
        render(currentTime, currentTimeIndex, frames)
    }

    const seek = (time: number, offsetIndex = 0) => {
        currentTime = time
        currentTimeIndex = offsetIndex
        updateOnCurrent()
    }

    const updateOnCurrent = () => {
        render(currentTime, currentTimeIndex, frames)
        options.onUpdate?.()
    }

    const play = () => {
        let start = 0
        playing = true

        options.onPlay?.()

        const step = (time: number) => {
            if (!start) {
                start = time
                // skip first frame
                requestAnimationFrame(step)
                return
            }

            const diff = time - start
            start = time

            const { nextTime, nextTimeIndex, pause, end } = findTextStepTime(
                currentTime,
                currentTimeIndex,
                currentTime + diff,
                total,
                frames,
            )

            currentTime = nextTime
            currentTimeIndex = nextTimeIndex

            updateOnCurrent()

            if (end) {
                playing = false
                options.onComplete?.()
                return
            }

            if (!playing || pause) {
                playing = false
                options.onPause?.()
                return
            }

            requestAnimationFrame(step)
        }

        requestAnimationFrame(step)
    }

    const pause = () => {
        playing = false
    }

    const getStatus = (): LightingStatus => ({
        playing,
        ended: currentTime === total,
        started: currentTime > 0,
        currentTime,
        currentTimeIndex,
        total,
    })

    return {
        prepare,
        play,
        pause,
        seek,
        total,
        getStatus,
        __dev: { options, frames },
    }
}
