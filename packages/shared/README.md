# @low-seven/shared

Shared types and interfaces for the Low Seven monorepo.

## Installation

This package is automatically linked via workspace protocol. Add to your `package.json`:

```json
{
  "dependencies": {
    "@low-seven/shared": "workspace:*"
  }
}
```

## Usage

### Auth Types

```typescript
import type { User, Session, AdminUser } from "@low-seven/shared/auth";
```

### Stripe Types

```typescript
import type { 
  StripePaymentIntent, 
  PaymentIntentResponse 
} from "@low-seven/shared/stripe";
```

### API Types

```typescript
import type { 
  ApiResponse,
  Activity,
  Booking,
  CreateBookingRequest 
} from "@low-seven/shared/api";
```

## Exports

- `@low-seven/shared/auth` - Better-auth types and authentication interfaces
- `@low-seven/shared/stripe` - Stripe types and payment interfaces
- `@low-seven/shared/api` - API response types and database entities
