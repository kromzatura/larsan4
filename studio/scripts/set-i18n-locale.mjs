/*
  Backfill the document-internationalization language field for existing docs.
  Usage:
    pnpm -C studio run set-lang -- --dataset <dataset> --project <projectId> --lang en
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
const token = getArg('token', process.env.SANITY_WRITE_TOKEN)
const lang = (getArg('lang', 'en') || 'en').toLowerCase()
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2024-10-31'

if (!project || !dataset) {
  console.error('Missing --project or --dataset (or SANITY_STUDIO_* env vars).')
  process.exit(1)
}

console.log(`Using projectId="${project}", dataset="${dataset}"`)
const client = createClient({ projectId: project, dataset, token, apiVersion, useCdn: false })

const TYPES = ['page','post','product','productCategory','category','navigation','settings','contact']

async function main(){
  const ids = await client.fetch(
    `array::compact([${TYPES.map((t)=>`...*[_type=="${t}" && !defined(language)]._id`).join(',')}])`
  )

  if (!ids?.length){
    console.log('No documents missing language field. Done.')
    return
  }

  console.log(`Updating ${ids.length} docs to language="${lang}"...`)
  const tx = client.transaction()
  ids.forEach((id)=> tx.patch(id, (p)=> p.set({language: lang})))
  await tx.commit()
  console.log('Language backfill complete.')
}

main().catch((err)=>{ console.error(err); process.exit(1) })
