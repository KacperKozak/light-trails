import { TrailFrame } from '../types'

export const totalDuration = (frames: TrailFrame[]): number =>
    Math.max(...frames.map((frame) => frame.startAt + frame.duration))
