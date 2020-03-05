import { linear } from '../helpers'
import {
    Easing,
    SimpleTrailFunction,
    FrameType,
    RenderTrailFunction,
    SetValues,
    TweenValues,
} from '../types'

export const fromTo = (
    values: TweenValues,
    duration: number,
    easing: Easing = linear,
): RenderTrailFunction => startAt => renderer => [
    {
        type: FrameType.Tween,
        startAt,
        startIndex: 0,
        duration,
        values,
        renderer,
        easing,
    },
]

export const set = (values: SetValues): RenderTrailFunction => startAt => renderer => [
    {
        type: FrameType.Set,
        startAt,
        startIndex: 0,
        duration: 0,
        values,
        renderer,
    },
]

export const delay = (duration: number): SimpleTrailFunction => startAt => [
    {
        type: FrameType.Delay,
        startAt,
        startIndex: 0,
        duration,
    },
]

export const pause = (): SimpleTrailFunction => startAt => [
    {
        type: FrameType.Pause,
        startAt,
        startIndex: 0,
        duration: 0,
    },
]
