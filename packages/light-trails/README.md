# Light Trails

The extendable animation library with timeline inspector.

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
    fromTo({ backgroundColor: color('#FF0000', '#00FF00') }, 400),
])

lightTrails(elementTrail).play()
```

