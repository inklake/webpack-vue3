const path = require('path')
const dotenv = require('dotenv')

function loadEnvConfig() {
  const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV ?? 'development'}`)
  return dotenv.config({ path: envPath, debug: process.env.DEBUG })?.parsed
}

module.exports.loadEnvConfig = loadEnvConfig
