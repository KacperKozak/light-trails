# Light trails

![TypeScript](https://img.shields.io/npm/types/typescript) ![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) ![bundle size](https://img.shields.io/bundlephobia/min/light-trails) ![min zip bundle size](https://img.shields.io/bundlephobia/minzip/light-trails) ![npm](https://img.shields.io/npm/v/light-trails?label=light-trails) ![npm](https://img.shields.io/npm/v/light-trails-inspector?label=light-trails-inspector) ![CI](https://github.com/KacperKozak/light-trails/workflows/CI/badge.svg)


The extendable animation library with timeline inspector.

```bash
yarn add light-trails
# or
npm install light-trails
```


# Quick Features

- **Highly extendable** with a lot of small parts which you can replace
- Advanced **animation inspector** as a separate package
- Easy **composition** even for completely different renderers
- Written in **TypeScript** so it's come with pretty good typings
- Rock-solid **declarative** way of doing animations
- Build for **large animation sets** - previously as part of [Phenomenon](https://github.com/react-phenomenon/phenomenon) web slides engine, now it's a stand-alone package


# Example

**[CodeSandbox Demo](https://codesandbox.io/s/light-trails-b9pn5)**

```js
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

```js
import { inspector } from 'light-trails-inspector'

// ...

const animation = lightTrails(/* … */)

inspector(animation)
```


# Documentation

## Trails

To make an animation first of all we have to start with `trail()` function.
Under this name you can find a composition of *renderer* (by default it's a HTML/CSS renderer) and set of *operators* which describes animation steps.

There is a example of fade in trail:

```js
const fadeInTrail = trail('h1', [
  fromTo({ opacity: val(0, 1) }, 400)
])
```

You probably wandering what the hack are `fromTo()` and `val()` function?!
Let me explain what's going on.

The `fromTo` is one of operators which takes object with functions that can return a value in specific time.

```js
fromTo({ opacity: (n) => … }, 400)
```

Parameter `n` is the percentage value from 0 to 1. 
For example if animation will be at 200ms this function will be cal with `n = 0.5`.
You can make your own function or use one of build in function creator. It depends how you want to change this value. The most common builds in are `val(0, 100, 'px')` and `color('#FFF', '#000')`.

There are more operator functions which can work together, for example `set()` when you want to change value immediately or `delay()`:

```js
const fadeInTrail = trail('h1', [
  set({ display: ['none', 'block']}),
  delay(1000),
  fromTo({ opacity: val(0, 1) }, 400),
])
```

## Controller

Previously mention `trail` function carries only information about animation steps for specific element.
To run our animation we have to have a controller named `lightTrails` in this lib:

```js
const fadeInTrail = trail('h1', [
  set({ display: ['none', 'block']}),
  delay(1000),
  fromTo({ opacity: val(0, 1) }, 400)
])

const animation = lightTrails(fadeInTrail)

animation.play()
```

The plural in the name reveals a one of the key features of this library.
And you guessed it. It's not about one trail, it's about composition.


## Composition

To run related trails you can use one of many functions, the simplest ones are `sequence` and `parallel` which I think are self-explanatory.

Let's use them in some example: We have two different trails, one for `body` background color and second one for the `h1` fade in animation:

```js
const bodyTrail = trail('body', [
  fromTo({ backgroundColor: color('#000', '#FFF') }, 1400)
])

const fadeInTrail = trail('h1', [
  set({ display: ['none', 'block']}),
  delay(1000),
  fromTo({ opacity: val(0, 1) }, 400)
])
```

And we want run them one after the other, let's use `sequence` function.

```js
const combinedTrails = sequence([bodyTrail, fadeInTrail])
```

No we have single trail so we can finally run our trail using controller as it was before:

```js
const animation = lightTrails(combinedTrails)

animation.play()
```
