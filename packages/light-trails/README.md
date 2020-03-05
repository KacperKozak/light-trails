# Lighting

The extendable TypeScript animation library.

```
yarn add light-trails

npm install light-trails
```

## Examples

```js
import { lightTrails, trail, fromTo, delay, val } from 'light-trails'

const elementTrail = trail('#my-element', [
    fromTo({ opacity: val(0, 1) }, 400),
    delay(1000),
    fromTo({ opacity: val(1, 0) }, 400),
])

lightTrails(elementTrail).play()
```

Using `parallel`, `cascade` or `sequence`.

```js
import {
    lightTrails,
    trail,
    parallel,
    fromTo,
    delay,
    set,
    val,
    color,
    transform,
} from 'light-trails'

const bodyTrail = trail('body', [
    fromTo({ backgroundColor: color('#FF0000', '#00FF00') }, 1500),
])

const elementTrail = trail('#my-element', [
    delay(500),
    set({ display: ['none', 'block'] }),
    fromTo(
        {
            opacity: val(0, 1),
            transform: transform({
                y: val(-200, 0, 'px'),
                scale: val(0.9, 1),
                rotate: val(10, 0, 'deg'),
            }),
        },
        500,
    ),
])

const parallelTrail = parallel([bodyTrail, elementTrail])

const animation = lightTrails(parallelTrail, {
    onComplete() {
        console.log('onComplete')
        animation.play() // loop
    },
})

animation.seek(500)
animation.play()
```
