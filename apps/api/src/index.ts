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
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:3001', 
  'http://localhost:3000',
  'https://low-seven-web.vercel.app'
]

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
  return c.json({
    name: 'Low Seven Tours API',
    version: '1.0.0',
    description: 'API for managing tour activities, packages, bookings, payments, reviews, and guides',
    endpoints: {
      auth: {
        path: '/api/auth/*',
        description: 'Authentication endpoints',
        methods: ['GET', 'POST'],
      },
      activities: {
        path: '/api/activities',
        description: 'Manage tour activities',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      packages: {
        path: '/api/packages',
        description: 'Manage tour packages',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      bookings: {
        path: '/api/bookings',
        description: 'Manage customer bookings',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      payments: {
        path: '/api/payments',
        description: 'Process payments and manage transactions',
        methods: ['GET', 'POST'],
      },
      reviews: {
        path: '/api/reviews',
        description: 'Manage customer reviews',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      guides: {
        path: '/api/guides',
        description: 'Manage tour guides',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      webhooks: {
        path: '/api/webhooks',
        description: 'Webhook endpoints for external integrations',
        methods: ['POST'],
      },
    },
    documentation: 'Visit the respective endpoints for detailed information',
    status: 'online',
  })
})

export default app
