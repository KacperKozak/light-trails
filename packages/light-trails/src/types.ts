export enum FrameType {
    Pause = 'Pause',
    Delay = 'Delay',
    Set = 'Set',
    Tween = 'Tween',
    Callback = 'Callback',
}

interface TrailFrameBase {
    type: FrameType
    startAt: number
    startIndex: number
    duration: number
}

export type Renderer = (values: Values) => void

export interface TrailFramePause extends TrailFrameBase {
    type: FrameType.Pause
    duration: 0
}

export interface TrailFrameDelay extends TrailFrameBase {
    type: FrameType.Delay
}

export interface TrailFrameSet extends TrailFrameBase {
    type: FrameType.Set
    duration: 0
    values: SetValues
    renderer: Renderer
}

export interface TrailFrameTween extends TrailFrameBase {
    type: FrameType.Tween
    values: TweenValues
    renderer: Renderer
    easing: Easing
}

export interface TrailFrameAction extends TrailFrameBase {
    type: FrameType.Callback
    callback: (isAfter: boolean) => void
}

export type TrailFrame =
    | TrailFrameSet
    | TrailFrameTween
    | TrailFramePause
    | TrailFrameDelay
    | TrailFrameAction

export interface Values {
    [key: string]: any
}

export interface SetValues {
    [key: string]: [any, any]
}

export interface TweenValues {
    [key: string]: (p: number) => any
}

export type Easing = (p: number) => number

export type SimpleTrailFunction = (startAt: number) => TrailFrame[]

export type RenderTrailFunction = (
    startAt: number,
) => (renderer: Renderer) => TrailFrame[]

export type TrailFunction = RenderTrailFunction | SimpleTrailFunction
