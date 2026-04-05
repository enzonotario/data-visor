---
outline: [2, 3]
---

# Privacy Policy — Data Visor (browser extension)

**Effective date:** April 6, 2026  

This Privacy Policy describes how the **Data Visor** Chromium extension (**data-visor-web-ext**, Manifest V3) handles information when you use it. It is intended for disclosure in the Chrome Web Store and for users who install the extension.

## Summary

Data Visor **does not sell your data**, **does not run analytics or advertising**, and **does not send the contents of your documents to our servers**. Processing of JSON, YAML, and XML happens **locally in your browser** so the extension can show the tree viewer. Only **non-sensitive UI preferences** are stored with the extension’s **local storage** API.

## Who we are

The extension is developed as part of the open source **Data Visor** project. Repository: [github.com/enzonotario/data-visor](https://github.com/enzonotario/data-visor).

## What the extension does

When you open a supported document (for example `*.json`, `*.yaml`, `*.yml`, or `*.xml` over `http(s):`, or a local `file://` URL if you allowed file access), the extension may replace the page with the Data Visor UI so you can browse the structure. You can skip this behavior for a given URL by using the **`#raw`** fragment as described in the [extension overview](/web-ext/).

## Data we process and where it stays

| Topic | Details |
| --- | --- |
| **Document content** | Text extracted from the active tab is used **only on your device** to render the viewer. It is **not** uploaded to us or to third-party servers by the extension. |
| **URLs** | The current page URL may be used locally (for example to detect file type). It is **not** sent to us. |
| **Preferences** | Shell appearance (**Auto / Dark / Light**) and **Shiki** syntax highlighting theme choices are saved with **`chrome.storage`** (extension local storage) so your settings persist. These values stay **on your device** and are **not** synced to our infrastructure. |

We do **not** intentionally collect names, email addresses, account identifiers, or payment information through the extension.

## Permissions

- **`storage`** — Used only to read and write the extension preferences described above.

Host access follows Chrome’s model: the extension runs on matching URLs so it can offer the viewer on supported file types. **Local `file://` documents** require you to enable **“Allow access to file URLs”** for the extension in your browser settings; we do not bypass that control.

## Third parties

The extension bundles open source libraries (for example **Vue**, **Shiki**, and **data-visor-vue**) to run **inside your browser**. They are not used to send your file contents to external services for analytics or profiling as part of this extension’s design.

If you load a page over the network, **the site you visit** and **your network** may still see requests as in any normal browsing session; that is outside this extension’s storage and is governed by those sites and your browser.

## Children’s privacy

The extension is not directed at children under 13, and we do not knowingly collect personal information from children.

## Your choices

- You can **remove** the extension at any time from your browser’s extension settings.  
- You can **revoke** file URL access or other optional permissions in the same place.  
- You can use **`#raw`** to open a document without the Data Visor UI when supported.

## International users

If you are in the European Economic Area, the United Kingdom, or Switzerland, applicable privacy laws may grant you rights to access, correct, delete, or restrict processing of personal data. This extension is designed to minimize personal data; most processing is local. For questions, use the contact below.

## Changes

We may update this policy when the extension or store requirements change. The **Effective date** at the top will be revised when we do. Continued use after an update means you accept the revised policy.

## Contact

For privacy questions about this extension, please open an issue or discussion on [github.com/enzonotario/data-visor](https://github.com/enzonotario/data-visor) or contact the maintainer through the channels linked from [enzonotario.me](https://enzonotario.me).
