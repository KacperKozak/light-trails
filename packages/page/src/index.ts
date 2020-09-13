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

const leftVal = val(0, 100, '%')

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

const initAnimation = lightTrails(
    parallel([
        cascade(trailAnimations, {
            offset: (i: number) => i * 30,
        }),
        sequence([
            delay(1300),
            cascade([titleTrail, pTrail, mainTrail], {
                offset: (i: number) => i * 300,
            }),
        ]),
    ]),
)

initAnimation.play()

const colorVar = colorChain('#FF00F0')

const bodyColorTrial = trail('body', [
    fromTo({ '--color': colorVar('#00F0F0') }, 1000),
    fromTo({ '--color': colorVar('#FF00F0') }, 1000),
])

const colorAnimation = lightTrails(bodyColorTrial)

colorAnimation.prepare()
const { total } = colorAnimation.getStatus()

window.addEventListener('scroll', () => {
    const { documentElement, body } = document

    const percent =
        (documentElement.scrollTop || body.scrollTop) /
        ((documentElement.scrollHeight || body.scrollHeight) -
            documentElement.clientHeight)
    colorAnimation.seek(total * percent)
})

const inspectorButton = document.querySelector<HTMLButtonElement>('#inspector')!

const showInspector = () => {
    inspector(initAnimation)
    inspectorButton.hidden = true
}

showInspector() // TODO remove

inspectorButton.addEventListener('click', showInspector)
