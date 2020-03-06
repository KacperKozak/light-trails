import 'core-js'
import { color } from './'

describe('color', () => {
    test('hex', () => {
        const colorFn = color('#FFF', '#000000')
        expect(colorFn(0)).toBe('rgba(255, 255, 255, 1)')
        expect(colorFn(0.5)).toBe('rgba(180, 180, 180, 1)')
        expect(colorFn(1)).toBe('rgba(0, 0, 0, 1)')
    })

    test('rgb', () => {
        const colorFn = color('rgb(255, 255, 255)', 'rgb(0, 0, 0)')
        expect(colorFn(0)).toBe('rgba(255, 255, 255, 1)')
        expect(colorFn(0.5)).toBe('rgba(180, 180, 180, 1)')
        expect(colorFn(1)).toBe('rgba(0, 0, 0, 1)')
    })

    test('rgba', () => {
        const colorFn = color('rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.8)')
        expect(colorFn(0)).toBe('rgba(255, 255, 255, 0.2)')
        expect(colorFn(0.5)).toBe('rgba(180, 180, 180, 0.5)')
        expect(colorFn(1)).toBe('rgba(0, 0, 0, 0.8)')
    })

    test('unknown', () => {
        expect(() => {
            color('lorem', 'ipsum')
        }).toThrow()
    })
})
