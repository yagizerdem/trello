import path from 'node:path'
import dotenv from 'dotenv'

// Resolve from this file's location so the script works from any cwd
const envPath = path.resolve(import.meta.dirname, '../.env.local')

const result = dotenv.config({ path: envPath, quiet: true })

if (result.error) {
  throw new Error(`Could not read ${envPath}: ${result.error.message}`)
}

export const env = result.parsed ?? {}
