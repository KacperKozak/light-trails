import { delay, fromTo, lightTrails, pause, set, trail, val } from './'
import { action } from './operators'

describe('lightTrails', () => {
    const values = { a: null, b: null }

    const mainTrail = trail(
        (frameValues) => Object.assign(values, frameValues),
        [delay(100), set({ a: [0, 1] }), fromTo({ b: val(10, 100) }, 100)],
    )

    const anim = lightTrails(mainTrail)

    test('initial', () => {
        expect(values.a).toBe(null)
        expect(values.b).toBe(null)
    })

    test('prepare', () => {
        anim.prepare()
        expect(values.a).toBe(0)
        expect(values.b).toBe(10)
    })

    test('seek - tween', () => {
        anim.seek(100 + 50)
        expect(values.b).toBe(55)
    })

    test('seek - offset index', () => {
        anim.seek(100, 0)
        expect(values.a).toBe(0)
        anim.seek(100, 1)
        expect(values.a).toBe(1)
    })

    test('seek - end', () => {
        const { total } = anim.getStatus()
        anim.seek(total)
        expect(values.a).toBe(1)
        expect(values.b).toBe(100)
    })

    /*
     * Pause
     */

    const pauseTrail = trail(
        (frameValues) => Object.assign(values, frameValues),
        [delay(100), pause(), delay(100)],
    )

    test('findNextPause', () => {
        const pauseAnim = lightTrails(pauseTrail)

        expect(pauseAnim.findNextPauseTime()).toBe(100)
        pauseAnim.seek(150)
        expect(pauseAnim.findNextPauseTime()).toBe(200)
    })

    test('findPrevPause', () => {
        const pauseAnim = lightTrails(pauseTrail)

        expect(pauseAnim.findPrevPauseTime()).toBe(0)
        pauseAnim.seek(150)
        expect(pauseAnim.findPrevPauseTime()).toBe(100)
    })

    /*
     * Action
     */

    test('action', () => {
        const values = {}
        const callback = jest.fn()
        const actionTrail = trail(
            (frameValues) => Object.assign(values, frameValues),
            [delay(100), action(callback), delay(100)],
        )
        const actionAnim = lightTrails(actionTrail)

        actionAnim.seek(50)
        expect(callback).toHaveBeenCalledWith(false)
        actionAnim.seek(150)
        expect(callback).toHaveBeenCalledWith(true)
    })
})
