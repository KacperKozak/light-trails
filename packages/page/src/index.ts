import {
    cascade,
    colorChain,
    fromTo,
    lightTrails,
    SimpleTrailFunction,
    trail,
    val,
    delay,
    color,
    parallel,
    sequence,
} from 'light-trails'
import { inspector } from 'light-trails-inspector'

const nextColor = colorChain('#FFFFFF')

const titleTrail = trail('h1', [
    fromTo(
        {
            color: nextColor('#FF00F0'),
            opacity: val(0, 1),
        },
        1000,
    ),
    fromTo({ color: nextColor('#00F0F0') }, 1000),
])

const pTrail = trail('.top p', [
    fromTo(
        {
            opacity: val(0, 1),
            y: val(-10, 0, 'px'),
        },
        1000,
    ),
])

const mainTrail = trail('main', [delay(800), fromTo({ opacity: val(0, 1) }, 1000)])

const trailAnimations: SimpleTrailFunction[] = []

const leftVal = val(0, window.innerWidth, 'px')

const trialsCount = Math.round(window.innerWidth / 20)

for (let i = 0; i < trialsCount; i++) {
    const el = document.createElement('span')
    el.classList.add('trail')
    el.style.left = leftVal(i / (trialsCount + 0.5 - Math.random())) as string

    const size = Math.max(0.2, Math.random())

    trailAnimations.push(
        trail(el, [
            fromTo(
                {
                    opacity: val(0, Math.min(size, 0.8)),
                    y: val(0, window.innerHeight * Math.random(), 'px'),
                    scale: val(0, size),
                },
                800,
            ),
        ]),
    )

    document.body.appendChild(el)
}

trailAnimations.sort(() => 0.5 - Math.random())

const animation = lightTrails(
    parallel([
        cascade(trailAnimations, {
            offset: (i: number) => i * 50,
        }),
        sequence([
            delay(1300),
            cascade([titleTrail, pTrail, mainTrail], {
                offset: (i: number) => i * 300,
            }),
        ]),
    ]),
)

animation.play()

// inspector(animation)
