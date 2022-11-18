#!/usr/bin/env node --require=ts-node/register
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
const dir = resolve(__dirname, '../node_modules/.tapjs/core')
const f = resolve(dir, 'index.ts')
const tsconfig = resolve('../tsconfig.json')



const tsNodeReg = require.resolve('ts-node/register')


// get the 

const plugins = [...new Set(readFileSync('plugins.txt', 'utf8')
  .trim()
  .split('\n'))]

const imports: string[] = [
  '// generated, do not edit',
  '',
  `import { PluginHost } from './plugin-host'`,
  '',
]

const inst: string[] = [`export const Host =`]

plugins.forEach((p, i) => {
  imports.push(
    `import { plugin as Plugin${i} } from ${JSON.stringify(
      p
    )}`
  )
  inst.push(`Plugin${i}(`)
})

inst.push(`PluginHost`, ')'.repeat(plugins.length))

writeFileSync(
  'host.ts',
  `${imports.join('\n')}

${inst.join('\n')}
`
)
