# Light trails

![TypeScript](https://img.shields.io/npm/types/typescript) ![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) ![bundle size](https://img.shields.io/bundlephobia/min/light-trails) ![min zip bundle size](https://img.shields.io/bundlephobia/minzip/light-trails) ![npm](https://img.shields.io/npm/v/light-trails?label=light-trails) ![npm](https://img.shields.io/npm/v/light-trails-inspector?label=light-trails-inspector) ![CI](https://github.com/KacperKozak/light-trails/workflows/CI/badge.svg)


The extendable animation library with timeline inspector.

```bash
yarn add light-trails
# or
npm install light-trails
```


# Features

- **Highly extendable** with a lot of small elements which you can replace
- Advanced **animation inspector** as a separate package
- Easy **composition** even for completely different renderers
- Timeline based so you can control the animation using **seek(t)**
- Written in **TypeScript** with pretty good typings
- Rock-solid **declarative** way of doing animations
- Build for **large animation sets** - previously as part of [Phenomenon](https://github.com/react-phenomenon/phenomenon) web slides engine, now a stand-alone package

# TOC

- [Trails](#trails)
  - [Controller](#controller)
  - [Composition](#composition)
- [API](#api)
  - [lightTrails(…)](#lighttrailstrail-options)
    - [.play()](#play)
    - [.pause()](#pause)
    - [.prepare()](#prepare)
    - [.getStatus()](#getstatus)
  - [Trail](#trail)
    - [Custom renderer](#custom-renderer)
  - [Composition](#composition-1)
    - [parallel(…)](#paralleltrails-array)
    - [sequence(…)](#sequencetrails-array)
    - [cascade(…)](#cascadetrails-array-options)
  - [Operators](#operators)
    - [fromTo(…)](#fromtovalues-object-duration-number-easing-function)
    - [set(…)](#setvalues-object)
    - [delay(…)](#delayduration-number)
    - [pause()](#pause-1)
  - [Values](#values)
    - [val(…)](#vala-number-b-number-suffix-string)
    - [color(…)](#colora-string-b-string)
    - [Value chaining](#value-chaining)
  - [FAQ](#faq)


# Example

**[CodeSandbox Demo](https://codesandbox.io/s/light-trails-b9pn5)**

```ts
import { lightTrails, trail, fromTo, delay, val, color, parallel } from 'light-trails'

const bodyTrail = trail('body', [
  fromTo({
    backgroundColor: color('#FF0000', '#00FF00')
  }, 1500)
])

const titleTrail = trail('#title', [
  delay(500),
  fromTo({
    y: val(0, 50, 'px'),
    opacity: val(0, 1),
    rotate: val(0, 360, 'deg'),
  }, 500)
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

First you have to install inspector:

```bash
yarn add --dev light-trails-inspector
# or
npm install --save-dev light-trails-inspector
```

And just put `lightTrails` instance into `inspector` function:

```ts
import { inspector } from 'light-trails-inspector'

// ...

const animation = lightTrails(/* … */)

inspector(animation)
```


# Documentation

## Trails

First of all, to make an animation we have to start with `trail()` function.
Under this name, you can find a combination of *renderer* (by default it's a HTML/CSS renderer) and a set of *operators* discarding animation steps.

There is a example of fade in trail:

```ts
const fadeInTrail = trail('h1', [
  fromTo({ opacity: val(0, 1) }, 400)
])
```

You are probably wander what `fromTo()` or `val()` are.
Let me explain what's going on.

The `fromTo` is one of the operators which takes an object with functions that can return a value in a specific time. Parameter `n` here is the percentage value from 0 to 1:

```ts
fromTo({ opacity: (n) => … }, 400)
```

For example, if the animation will be at 200ms this function will be called with `n = 0.5`.
Depending on what you want to do you can make your own *value function* or use one of build-in.  The most common are `val(0, 100, 'px')` and `color('#FFF', '#000')`.

There are more operators which can work together, for example `set()` when you want to change a value immediately or `delay()`:

```ts
const fadeInTrail = trail('h1', [
  set({ display: ['none', 'block']}),
  delay(1000),
  fromTo({ opacity: val(0, 1) }, 400),
])
```

## Controller

Previously mentioned `trail` function carries information about animation only for the specific element.
To run our animation we have to use controller `lightTrails`:

```ts
const fadeInTrail = trail('h1', [
  set({ display: ['none', 'block']}),
  delay(1000),
  fromTo({ opacity: val(0, 1) }, 400)
])

const animation = lightTrails(fadeInTrail)

animation.play()
```

Plural function name reveals one of the key features of this library, it's not about one trail but about composition.


## Composition

To run related trails together you have to use composition functions, the simplest ones are `sequence` and `parallel` which I think are self-explanatory.

For example: we have two different trails, one for `body` background color and a second one for `h1` fade-in animation:

```ts
const bodyTrail = trail('body', [
  fromTo({ backgroundColor: color('#000', '#FFF') }, 1400)
])

const fadeInTrail = trail('h1', [
  set({ display: ['none', 'block']}),
  delay(1000),
  fromTo({ opacity: val(0, 1) }, 400)
])
```

Assume we want to run them one after anther, let's use `sequence` function.

```ts
const combinedTrails = sequence([bodyTrail, fadeInTrail])
```

Now we have a single trail so we can finally run it using a controller as before:

```ts
const animation = lightTrails(combinedTrails)

animation.play()
```

Composition functions have exactly the same type as a trail, so you can combine them together e.g. `parallel` inside a `sequence`.

```ts
const combinedTrails = sequence([
  bodyTrail,
  parallel([
    topTrail,
    contentTrail,
    footerTrail,
  ])
])
```


# API

## `lightTrails(trail, [options])`

```ts
const animation = lightTrails(trail, {
  onPlay() {
    // animation starts playing
  },
  onComplete() {
    // animation is completed
  },
  onPause(manual) {
    // animation paused by `animation.pause()` (manual = true) or `pause()` operator
  },
  onUpdate() {
    // triggered on every frame
  }
})
```

### `lightTrails` instance:

#### `.play()`

Starts the animation

```ts
animation.play()
```

#### `.pause()`

Pauses the animation

```ts
animation.pause()
```

#### `.seek(t: number)`

Moves the animation head to a specific point in time

```ts
animation.seek(200)
```

#### `.prepare()`

Prepares the animation by assigning initial values, it is useful when you do not play the animation immediately.

```ts
animation.prepare()
```

#### `.getStatus()`
```ts
// Return object with current animation status
animation.getStatus()
```

```ts
{
  playing: boolean
  ended: boolean
  started: boolean
  currentTime: number
  currentTimeIndex: number
  total: number
}
```

# Trail

Trail is a combination of *renderer* function and *operators* array.
If you put `string` or `HTMLElement` as first argument it will use build-in HTML/CSS renderer.

`trail(renderer: string | HTMLElement | Function, operators: Array)`

Example:

```ts
const myTrail1 = trail('#my', [ … ])
const myTrail2 = trail(document.getElementById('my'), [ … ])
const myTrail3 = trail(document.body, [ … ])
const myTrail4 = trail(myCustomRendererFunction, [ … ])
```

The second argument is an array of operators, for example:

```ts
const myTrail = trail('#my', [
  set({ display: ['none', 'block']}),
  fromTo({ opacity: val(0, 1) }, 1000),
])

lightTrails(myTrail).play()
```

For more information, see the [operators](#operators) section.

## Custom renderer

It's possible to make your own renderer function. Let's assume that we want to "render" values as object. This may be useful for libraries like ThreeJS.

Full example:

```ts
const position = { x: 0 }

const myTrail = trail(
  (values) => {
    position.x = values.posX;
  },
  [
    fromTo({ posX: val(0, 100) }, 1000),
  ]
)

lightTrails(myTrail).seek(500)

console.log(position.x) // → 50
```

## Composition

Joins trails together.

### `parallel(trails: Array)`

Stack trails to run at the same time

```ts
const bodyTrail = trail('body', [ … ])
const fadeInTrail = trail('h1', [ … ])

// → aaaa
// → bbbb
// → cccc
const combinedTrails = parallel([bodyTrail, fadeInTrail, …])

lightTrails(combinedTrails).play()
```

### `sequence(trails: Array)`

Stack trails one after the other

```ts
// → aaaa
// →     bbbb
// →         cccc
const combinedTrails = sequence([bodyTrail, fadeInTrail, …])
```

### `cascade(trails: Array, options)`

Cascade with offset based on the index

```ts
// → aaaa
// →   bbbb
// →     bbbb
const combinedTrails = cascade([bodyTrail, fadeInTrail, …], {
  offset: (i) => i * 300
})
```

# Operators

## `fromTo(values: Object, duration: number, easing: Function)`

Smoothly changes values within a specified time.

Values object with functions which receive the percentage value from 0 to 1

```ts
{ valueName: (n: number) => any }
```

Example:

```ts
fromTo({
  height: val(0, 100, 'px'),
  width: (n) => Math.sin(n) * 100 + 'px',
})
```

## `set(values: Object)`

Sets a specific value depends on where animation head is.

Values object is array with two items (tuple)

```ts
{ valueName: [any, any] }
```

Example:

```ts
set({
  display: ['none', 'block'],
  height: [0, 'auto']
})
```

### `delay(duration: number)`

Delays next operators by given time

Example:

```ts
const elTrail = trail(el, [
  delay(200),
  fromTo({ opacity: val(1, 0) }, 200),
  delay(100),
  set({ display: ['block', 'none'] })
])
```


### `pause()`

Pauses animation in specific place:

```ts
const elTrail = trail(el, [
  fromTo({ opacity: val(0, 1) }, 200),
  pause(),
  fromTo({ opacity: val(1, 0) }, 200),
])
```

# Values

"Values" are small functions built specifically for `fromTo` operator. Basically it is a linear interpolation between values so you can use them wherever you like. 

## `val(a: number, b: number, suffix?: string)`

```ts
const opacity = val(0.2, 0.8)
const size = val(100, 200, 'px')

opacity(0) // 0.2
size(0.5) // '150px'
```

Example:

```ts
const size = val(100, 200, 'px')

const elTrail = trail(el, [
  fromTo({
    opacity: val(0.2, 0.8),
    width: size,
    height: size,
  }, 200),
])
```

## `color(a: string, b: string)`

Same thing as `val` but for colors.

```ts
const color1 = color('#FFF', '#000')
const color2 = color('rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)')

color1(0.5) // 'rgba(180, 180, 180, 1)'
color2(0.5) // 'rgba(0, 0, 0, 0.5)'
```

Example:

```ts
const elTrail = trail(el, [
  fromTo({
    color: color('#FFF', '#000'),
    backgroundColor:  color('rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)'),
  }, 200),
])
```

## Value chaining

```ts
valChain(a: number, suffix?: string)
colorChain(a: string)
```

Sometimes you have to change the same value multiple times starting from the previous value, for example:

```ts
const elTrail = trail(el, [
  fromTo({
    color: color('#FFF', '#000'),
    height: val(0, 50, 'px'),
  }, 200),
  fromTo({
    color: color('#000', '#ABC123'),
    height: val(50, 100, 'px'),
  }, 200),
])
```

Look at the next example, `valChain` or `colorChain` can be useful in this case:

```ts

const elColor = colorChain('#FFF')  // First, define starting values
const elHeight = valChain(0, 'px')

const elTrail = trail(el, [
  fromTo({
    color: elColor('#000'), // Put the next value
    height: elHeight(50),
  }, 200),
  fromTo({
    color: elColor('#ABC123'), // And so on
    height: elHeight(100),
  }, 200),
])
```

# FAQ

## How to loop animation?

There is no built-in option for that but you can play the animation again after completion, for example:


```ts
const bodyTrail = trail('body', [
  fromTo({ backgroundColor: color('#000', '#FFF') }, 1000)
])

const animation = lightTrails(bodyTrail, {
  onComplete() {
    animation.play()
  }
})

animation.play()
```

## Can I use this library with React?

Yep, simply use `useRef` and `useEffect` hooks:

```tsx
const MyComponent = () => {
  const ref = useRef(null)

  useEffect(() => {
    const elTrail = trail(ref.current, [
      fromTo({ opacity: val(0, 1) }, 1000)
    ])

    const animation = lightTrails(elTrail)
    animation.play()

    return () => animation.pause()
  }, [])

  return <div ref={ref}>Test</div>
} 
```
