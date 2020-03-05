# Light trails

![TypeScript](https://img.shields.io/npm/types/typescript?style=flat-square) ![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square) ![bundle size](https://img.shields.io/bundlephobia/min/light-trails?style=flat-square) ![min zip bundle size](https://img.shields.io/bundlephobia/minzip/light-trails?style=flat-square)


The extendable TypeScript animation library with timeline inspector

**[CodeSandbox Demo](https://codesandbox.io/s/light-trails-b9pn5)**

```js
import { lightTrails, trail, fromTo, delay, val, color, parallel } from 'light-trails'
import { inspector } from 'light-trails-inspector'

const bodyTrail = trail('body', [
  fromTo({ backgroundColor: color('#FF0000', '#00FF00') }, 1500)
])

const titleTrail = trail('#title', [
  delay(500),
  fromTo({ opacity: val(0, 1) }, 500)
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
