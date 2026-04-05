import { brand } from './brand.js'

export function buildIconSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="dvbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${brand.bgFrom}"/>
      <stop offset="100%" stop-color="${brand.bgTo}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#dvbg)"/>
  <text x="120" y="310" font-family="ui-sans-serif,system-ui,sans-serif" font-size="168" font-weight="700" fill="${brand.brace}">{</text>
  <rect x="208" y="186" width="120" height="14" rx="7" fill="${brand.bar1}"/>
  <rect x="228" y="226" width="90" height="14" rx="7" fill="${brand.bar2}"/>
  <rect x="248" y="266" width="70" height="14" rx="7" fill="${brand.bar3}"/>
  <text x="340" y="310" font-family="ui-sans-serif,system-ui,sans-serif" font-size="168" font-weight="700" fill="${brand.brace}">}</text>
</svg>`
}
