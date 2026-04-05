import { storage } from 'wxt/utils/storage'

export const shikiDarkSyntaxTheme = storage.defineItem<string>('local:dataVisorShikiDarkSyntax', {
  fallback: 'github-dark',
})

export const shikiLightSyntaxTheme = storage.defineItem<string>('local:dataVisorShikiLightSyntax', {
  fallback: 'github-light',
})
