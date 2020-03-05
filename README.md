# Light trails

![TypeScript](https://img.shields.io/npm/types/typescript?style=flat-square) ![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)


The extendable TypeScript animation library with timeline inspector

```js
import { lightTrails, trail, fromTo, delay, val, parallel } from 'light-trails'
import { inspector } from 'light-trails-inspector'

const bodyTrail = trail('body', [
    fromTo({ opacity: val(0, 1) }, 400),
    delay(1000),
    fromTo({ backgroundColor: color('#FF0000', '#00FF00') }, 1500),
])

const titleTrail = trail('#title', [
    delay(1000),
    fromTo({ opacity: val(0, 1) }, 500),
])

const animation = lightTrails(
    parallel([
        bodyTrail,
        titleTrail,
    ])
)

animation.play()

inspector(animation)
```
