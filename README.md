# Light trails

![TypeScript](https://img.shields.io/npm/types/typescript) ![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) ![bundle size](https://img.shields.io/bundlephobia/min/light-trails) ![min zip bundle size](https://img.shields.io/bundlephobia/minzip/light-trails) ![CI](https://github.com/KacperKozak/light-trails/workflows/CI/badge.svg)


The extendable TypeScript animation library with timeline inspector

```bash
yarn add light-trails
# or
npm install light-trails
```

## Example

**[CodeSandbox Demo](https://codesandbox.io/s/light-trails-b9pn5)**

```js
import { lightTrails, trail, fromTo, delay, val, color, parallel } from 'light-trails'

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
```

## Inspector

```bash
yarn add --dev light-trails-inspector
# or
npm install --save-dev light-trails-inspector
```

```js
import { inspector } from 'light-trails-inspector'

// ...

inspector(animation)
```
