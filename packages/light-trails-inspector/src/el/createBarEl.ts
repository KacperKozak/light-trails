import { FrameType, TrailFrame } from 'light-trails'
import { InspectorOptions } from '../inspectorOptions'

const bg: Record<FrameType, string> = {
    [FrameType.Tween]: '#4d7a16',
    [FrameType.Set]: 'lightgray',
    [FrameType.Delay]: '#666',
    [FrameType.Pause]: 'lightgray',
    [FrameType.Callback]: 'darkgray',
}

export const createBarEl = (
    frame: TrailFrame,
    options: InspectorOptions,
    skipped: boolean,
) => {
    const el = document.createElement('div')
    const htmlPayload =
        ('renderer' in frame && ((frame.renderer as any)?.__EL as HTMLElement)) ||
        undefined

    if (htmlPayload) {
        el.textContent = `[${htmlPayload.tagName}] `
    } else {
        el.textContent = `${frame.type}`
    }

    el.title = `[${frame.startAt} - ${frame.startAt + frame.duration}] ${frame.type}`

    if ('values' in frame) {
        const values = ` (${Object.keys(frame.values).join(', ')})`
        el.textContent += values
        el.title += values
    }

    el.onclick = () => {
        // eslint-disable-next-line no-console
        console.log(frame)
    }

    if (htmlPayload) {
        el.onmouseover = () => {
            htmlPayload.style.outline = '2px solid red'
            htmlPayload.style.outlineOffset = '2px'
        }
        el.onmouseout = () => {
            htmlPayload.style.outline = ''
            htmlPayload.style.outlineOffset = ''
        }
    }

    el.style.opacity = skipped ? '0.3' : '1'
    el.style.height = '14px'
    el.style.lineHeight = '14px'
    el.style.fontSize = '10px'
    el.style.textIndent = '5px'
    // el.style.overflow = 'hidden'
    el.style.whiteSpace = 'nowrap'
    el.style.marginBottom = '1px'
    el.style.color = 'white'
    el.style.marginLeft = frame.startAt / options.scale + 'px'

    switch (frame.type) {
        case FrameType.Pause:
        case FrameType.Set:
            el.style.width = 'auto'
            el.style.color = bg[frame.type]
            el.style.borderLeft = `2px solid ${bg[frame.type]}`
            break

        default:
            el.style.backgroundColor = bg[frame.type]
            el.style.width = frame.duration / options.scale + 'px'
            el.style.borderRadius = '3px'
            break
    }

    return el
}
