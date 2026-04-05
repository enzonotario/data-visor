import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ImageResponse, type ImageResponseResult } from 'takumi-js/response'
import { brand } from './brand.js'
import { buildIconSvg } from './icon-svg.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsPublic = join(__dirname, '../../../docs/public')
const webExtStoreListing = join(__dirname, '../../../packages/data-visor-web-ext/store-listing')

const S128 = 96 / 512

function IconPng() {
  const grad = `linear-gradient(145deg, ${brand.bgFrom} 0%, ${brand.bgTo} 100%)`
  return (
    <div
      style={{
        width: 512,
        height: 512,
        borderRadius: 96,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: grad,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <span
          style={{
            fontSize: 180,
            fontWeight: 700,
            color: brand.brace,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {'{'}
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 120,
              height: 14,
              borderRadius: 7,
              backgroundColor: brand.bar1,
            }}
          />
          <div
            style={{
              width: 90,
              height: 14,
              borderRadius: 7,
              backgroundColor: brand.bar2,
              marginLeft: 20,
            }}
          />
          <div
            style={{
              width: 70,
              height: 14,
              borderRadius: 7,
              backgroundColor: brand.bar3,
              marginLeft: 36,
            }}
          />
        </div>
        <span
          style={{
            fontSize: 180,
            fontWeight: 700,
            color: brand.brace,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {'}'}
        </span>
      </div>
    </div>
  )
}

function ChromeStoreIcon128() {
  const grad = `linear-gradient(145deg, ${brand.bgFrom} 0%, ${brand.bgTo} 100%)`
  const br = Math.round(96 * (96 / 512))
  const fz = Math.round(180 * S128)
  const gap = Math.max(4, Math.round(24 * S128))
  const barH = Math.max(3, Math.round(14 * S128))
  const barR = Math.max(2, Math.round(7 * S128))
  return (
    <div
      style={{
        width: 128,
        height: 128,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: br,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: grad,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.14), 0 0 8px rgba(255,255,255,0.22)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap,
          }}
        >
          <span
            style={{
              fontSize: fz,
              fontWeight: 700,
              color: brand.brace,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {'{'}
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Math.max(3, Math.round(16 * S128)),
            }}
          >
            <div
              style={{
                width: Math.round(120 * S128),
                height: barH,
                borderRadius: barR,
                backgroundColor: brand.bar1,
              }}
            />
            <div
              style={{
                width: Math.round(90 * S128),
                height: barH,
                borderRadius: barR,
                backgroundColor: brand.bar2,
                marginLeft: Math.round(20 * S128),
              }}
            />
            <div
              style={{
                width: Math.round(70 * S128),
                height: barH,
                borderRadius: barR,
                backgroundColor: brand.bar3,
                marginLeft: Math.round(36 * S128),
              }}
            />
          </div>
          <span
            style={{
              fontSize: fz,
              fontWeight: 700,
              color: brand.brace,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {'}'}
          </span>
        </div>
      </div>
    </div>
  )
}

function ChromeStorePromoSmall() {
  const grad = 'linear-gradient(128deg, #0e7490 0%, #2563eb 42%, #4338ca 72%, #1e1b4b 100%)'
  const fz = 56
  const gap = 14
  const barH = 10
  const barR = 5
  return (
    <div
      style={{
        width: 440,
        height: 280,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: grad,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap,
        }}
      >
        <span
          style={{
            fontSize: fz,
            fontWeight: 700,
            color: '#e0f2fe',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {'{'}
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 140,
              height: barH,
              borderRadius: barR,
              backgroundColor: '#bae6fd',
            }}
          />
          <div
            style={{
              width: 108,
              height: barH,
              borderRadius: barR,
              backgroundColor: '#7dd3fc',
              marginLeft: 22,
            }}
          />
          <div
            style={{
              width: 82,
              height: barH,
              borderRadius: barR,
              backgroundColor: '#38bdf8',
              marginLeft: 42,
            }}
          />
        </div>
        <span
          style={{
            fontSize: fz,
            fontWeight: 700,
            color: '#e0f2fe',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {'}'}
        </span>
      </div>
    </div>
  )
}

function OgImage({ iconDataUrl }: { iconDataUrl: string }) {
  const grad = `linear-gradient(125deg, ${brand.ogBgFrom} 0%, ${brand.ogBgTo} 55%, ${brand.bgTo} 100%)`
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 72,
        paddingRight: 72,
        backgroundImage: grad,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 680,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: brand.title,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: -1,
          }}
        >
          Data Visor
        </span>
        <span
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: brand.subtitle,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          JSON · YAML · XML viewer for Vue — powered by Shiki
        </span>
      </div>
      <img
        src={iconDataUrl}
        width={280}
        height={280}
        alt="Data Visor"
        style={{
          borderRadius: 56,
          objectFit: 'cover',
        }}
      />
    </div>
  )
}

async function responseToBuffer(res: ImageResponseResult): Promise<Buffer> {
  await res.ready
  const ab = await res.arrayBuffer()
  return Buffer.from(ab)
}

async function main() {
  await mkdir(docsPublic, { recursive: true })
  await mkdir(webExtStoreListing, { recursive: true })

  const iconRes = new ImageResponse(<IconPng />, {
    width: 512,
    height: 512,
    format: 'png',
    loadDefaultFonts: true,
  })
  const iconPng = await responseToBuffer(iconRes)
  const iconPath = join(docsPublic, 'icon.png')
  await writeFile(iconPath, iconPng)

  await writeFile(join(docsPublic, 'icon.svg'), buildIconSvg(), 'utf8')

  const iconDataUrl = `data:image/png;base64,${iconPng.toString('base64')}`
  const ogRes = new ImageResponse(<OgImage iconDataUrl={iconDataUrl} />, {
    width: 1200,
    height: 630,
    format: 'png',
    loadDefaultFonts: true,
  })
  await writeFile(join(docsPublic, 'og.png'), await responseToBuffer(ogRes))

  const chrome128Res = new ImageResponse(<ChromeStoreIcon128 />, {
    width: 128,
    height: 128,
    format: 'png',
    loadDefaultFonts: true,
  })
  await writeFile(
    join(webExtStoreListing, 'chrome-store-icon-128.png'),
    await responseToBuffer(chrome128Res),
  )

  const promoRes = new ImageResponse(<ChromeStorePromoSmall />, {
    width: 440,
    height: 280,
    format: 'jpeg',
    quality: 92,
    loadDefaultFonts: true,
  })
  await writeFile(
    join(webExtStoreListing, 'chrome-store-promo-small-440x280.jpg'),
    await responseToBuffer(promoRes),
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
