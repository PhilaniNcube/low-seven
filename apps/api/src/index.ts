import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
import activitiesRoute from './routes/activities'
import packagesRoute from './routes/packages'
import bookingsRoute from './routes/bookings'
import paymentsRoute from './routes/payments'
import reviewsRoute from './routes/reviews'
import guidesRoute from './routes/guides'

const app = new Hono()

// CORS middleware - must be before routes
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3001', 'http://localhost:3000']

app.use('*', cors({
  origin: allowedOrigins,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app
.all('/api/auth/*', async (c) => {
  return await auth.handler(c.req.raw)
})
.route('/api/webhooks', paymentsRoute) // Webhook routes (no auth)
.route('/api/activities', activitiesRoute)
.route('/api/packages', packagesRoute)
.route('/api/bookings', bookingsRoute)
.route('/api/payments', paymentsRoute)
.route('/api/reviews', reviewsRoute)
.route('/api/guides', guidesRoute)
.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
