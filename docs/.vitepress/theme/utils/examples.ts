import type { ViewerLang } from 'data-visor-vue'

export const JSON_EXAMPLE: string = `{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "roles": [
        "admin",
        "user"
      ],
      "meta": {
        "verified": true,
        "score": 9.5
      }
    },
    {
      "id": 2,
      "name": "Bob",
      "roles": [
        "user"
      ],
      "meta": {
        "verified": false,
        "score": 7.2
      }
    },
    {
      "id": 3,
      "name": "Carlos",
      "roles": [
        "moderator"
      ],
      "meta": {
        "verified": true,
        "score": 8.1
      }
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 3
  },
  "config": {
    "theme": "dark",
    "locale": "en-US",
    "features": {
      "search": true,
      "export": false
    }
  }
}`

export const YAML_EXAMPLE: string = `users:
  - id: 1
    name: Alice
    roles:
      - admin
      - user
    meta:
      verified: true
      score: 9.5
  - id: 2
    name: Bob
    roles:
      - user
    meta:
      verified: false
      score: 7.2
  - id: 3
    name: Carlos
    roles:
      - moderator
    meta:
      verified: true
      score: 8.1
pagination:
  page: 1
  perPage: 10
  total: 3
config:
  theme: dark
  locale: en-US
  features:
    search: true
    export: false`

export const XML_EXAMPLE: string = `<?xml version="1.0" encoding="UTF-8" ?>
 <root>
     <users>
         <id>1</id>
         <name>Alice</name>
         <roles>admin</roles>
         <roles>user</roles>
         <meta>
             <verified>true</verified>
             <score>9.5</score>
         </meta>
     </users>
     <users>
         <id>2</id>
         <name>Bob</name>
         <roles>user</roles>
         <meta>
             <verified>false</verified>
             <score>7.2</score>
         </meta>
     </users>
     <users>
         <id>3</id>
         <name>Carlos</name>
         <roles>moderator</roles>
         <meta>
             <verified>true</verified>
             <score>8.1</score>
         </meta>
     </users>
     <pagination>
         <page>1</page>
         <perPage>10</perPage>
         <total>3</total>
     </pagination>
     <config>
         <theme>dark</theme>
         <locale>en-US</locale>
         <features>
             <search>true</search>
             <export>false</export>
         </features>
     </config>
 </root>`

export const LANG_EXAMPLE: Record<ViewerLang, string> = {
  json: JSON_EXAMPLE,
  yaml: YAML_EXAMPLE,
  xml: XML_EXAMPLE,
}
