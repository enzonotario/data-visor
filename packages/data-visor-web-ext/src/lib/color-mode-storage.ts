import { storage } from 'wxt/utils/storage'

export type UiColorMode = 'auto' | 'light' | 'dark'

export const uiColorMode = storage.defineItem<UiColorMode>('local:dataVisorUiColorMode', {
  fallback: 'auto',
})
