import { handle } from '@hono/node-server/vercel'
import app from '../src/index'

// Vercel automatically provides environment variables
// No need to call dotenv.config() in serverless environment

export default handle(app)
