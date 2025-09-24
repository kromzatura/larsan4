/*
  Report slug collisions within the same language for configured types.
  Usage:
    pnpm -C studio run check-slugs -- --dataset <dataset> --project <projectId>
*/
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve('.env') })
if (fs.existsSync(path.resolve('.env.local'))) {
  dotenv.config({ path: path.resolve('.env.local') })
}
import {createClient} from '@sanity/client'

const args = process.argv.slice(2)
const getArg = (name, def) => {
  const i = args.findIndex((a) => a === `--${name}`)
  if (i !== -1 && args[i + 1]) return args[i + 1]
  return process.env[`SANITY_${name.toUpperCase()}`] || def
}

const dequote = (s) => (s || '').replace(/^['"]|['"]$/g, '')
const project = dequote(getArg('project', process.env.SANITY_STUDIO_PROJECT_ID)).trim()
const dataset = dequote(getArg('dataset', process.env.SANITY_STUDIO_DATASET)).trim()
const token = getArg('token', process.env.SANITY_READ_TOKEN || process.env.SANITY_WRITE_TOKEN)
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2024-10-31'

if (!project || !dataset) {
  console.error('Missing --project or --dataset (or SANITY_STUDIO_* env vars).')
  process.exit(1)
}

console.log(`Using projectId="${project}", dataset="${dataset}"`)
const client = createClient({ projectId: project, dataset, token, apiVersion, useCdn: false })

const TYPES = ['page','post','product','productCategory','category']

async function main(){
  const rows = await client.fetch(`
    [${TYPES.map((t)=>`...*[_type=="${t}" && defined(language) && defined(slug.current)]{ _id, _type, slug, language }`).join(',')}]
  `)

  const map = new Map()
  for (const d of rows){
    const key = `${d._type}|${d.language}|${d.slug.current}`
    const list = map.get(key) || []
    list.push(d)
    map.set(key, list)
  }

  const collisions = [...map.entries()].filter(([_, list])=> list.length>1)
  if (!collisions.length){
    console.log('No per-locale slug collisions found. ✅')
    return
  }
  console.log(`Found ${collisions.length} collisions:`)
  for (const [key, list] of collisions){
    console.log(`\n${key}`)
    list.forEach((d)=> console.log(` - ${d._id}`))
  }
  process.exitCode = 1
}

main().catch((err)=>{ console.error(err); process.exit(1) })
