import { LightTrailsInstance, shouldSkipFrame } from 'light-trails'
import { createBarEl } from './el/createBarEl'
import { createLineEl } from './el/createLineEl'
import { createRootEl } from './el/createRootEl'
import { createSeekEl } from './el/createSeekEl'
import { createStatusEl } from './el/createStatusEl'
import { inspectorOptions } from './inspectorOptions'

export const inspector = (anim: LightTrailsInstance) => {
    let status = anim.getStatus()

    const rootEl = createRootEl(inspectorOptions)
    const barsWrapperEl = document.createElement('div')
    const statusEl = createStatusEl()
    const lineEl = createLineEl(inspectorOptions)
    const seekEl = createSeekEl(inspectorOptions, off => anim.seek(off))

    const userOptions = { ...anim.__dev.options }

    inspectorOptions.scale = anim.total / (inspectorOptions.width - 200)

    anim.__dev.options.onUpdate = () => {
        status = anim.getStatus()
        userOptions.onUpdate?.()
        render()
    }

    anim.__dev.options.onPause = () => {
        status = anim.getStatus()
        userOptions.onPause?.()
        render()
    }

    anim.__dev.options.onComplete = () => {
        status = anim.getStatus()
        userOptions.onComplete?.()
        render()
    }

    barsWrapperEl.style.maxHeight = '70vh'
    barsWrapperEl.style.overflow = 'auto'

    const render = () => {
        barsWrapperEl.innerHTML = ''
        anim.__dev.frames.forEach(frame => {
            barsWrapperEl.appendChild(
                createBarEl(
                    frame,
                    inspectorOptions,
                    shouldSkipFrame(status.currentTime, status.currentTimeIndex, frame),
                ),
            )
        })
        lineEl.update(status.currentTime)
        lineEl.el.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'center' })
        statusEl.update(status)
    }

    render()

    rootEl.appendChild(statusEl.el)
    rootEl.appendChild(seekEl)
    rootEl.appendChild(barsWrapperEl)
    rootEl.appendChild(lineEl.el)
    document.body.appendChild(rootEl)
}
