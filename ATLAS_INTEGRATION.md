# Atlas Integration Documentation

## 🎯 Overview

Atlas has been successfully integrated into InvoiceHub to provide subscription management, pricing, and feature gating capabilities.

## ✅ What's Implemented

### 1. **Core Setup**
- ✅ Atlas package installed (`@runonatlas/private-next@0.2.1`)
- ✅ AtlasProvider wrapped in app layout with Clerk authentication
- ✅ Server-side Atlas client configured
- ✅ API routes created at `/api/atlas-api/*`

### 2. **New Pages**
- ✅ **Pricing Page** (`/app/pricing`) - Full merchant pricing interface
- ✅ **Customer Portal** (`/app/customer-portal`) - Customer subscription management
- ✅ Both pages added to sidebar navigation

### 3. **Feature Protection**
- ✅ Export functionality protected with `FeatureProtect` component
- ✅ Advanced analytics protected with `useFeaturesAllowed` hook
- ✅ Multiple protection examples created

## 🔧 Required Environment Variables

Add to your `.env.local` file:

```bash
ATLAS_API_KEY="your_atlas_api_key_here"
```

Get your API key from: https://atlas.runo.com

## 📁 File Structure

```
├── components/
│   ├── atlas-provider.tsx           # Atlas client provider
│   └── feature-protection-examples.tsx # Feature protection components
├── lib/
│   └── atlas-server.tsx            # Atlas server client
├── app/
│   ├── layout.tsx                  # AtlasProvider integration
│   ├── api/atlas-api/[[...slug]]/route.ts # Atlas API routes
│   └── app/(routes)/
│       ├── pricing/page.tsx        # Pricing page
│       └── customer-portal/page.tsx # Customer portal
└── components/app-sidebar.tsx       # Updated navigation
```

## 🛡️ Feature Protection Examples

### Using the FeatureProtect Component

```typescript
import { FeatureProtect } from "@runonatlas/private-next/client";

<FeatureProtect
  disallowedFallback={<div>Upgrade to access this feature!</div>}
  features={["premium-feature"]}
>
  <PremiumComponent />
</FeatureProtect>
```

### Using the useFeaturesAllowed Hook

```typescript
import { useFeaturesAllowed } from "@runonatlas/private-next/client";

const { isAllowed } = useFeaturesAllowed(["export-data"]);

return isAllowed ? <ExportButton /> : <UpgradePrompt />;
```

### Backend Protection

```typescript
import { atlasServerClient } from "@/lib/atlas-server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  
  const { ok } = await atlasServerClient.areFeaturesAllowed(userId, [
    "api-access"
  ]);

  if (!ok) {
    return new Response("Feature not enabled", { status: 403 });
  }

  return new Response("Access granted!");
}
```

## 🎛️ Available Features to Gate

Configure these features in your Atlas dashboard:

- `export-data` - Data export functionality
- `advanced-analytics` - Advanced reporting and analytics
- `multiple-clients` - Unlimited client management
- `bulk-operations` - Bulk actions on invoices
- `api-access` - API access for integrations
- `custom-branding` - White-label branding options

## 🚀 Usage

### 1. **Access Pricing Page**
Navigate to `/app/pricing` to manage subscriptions

### 2. **Customer Portal**
Navigate to `/app/customer-portal` for billing management

### 3. **Feature Protection**
Import and use the protection components:

```typescript
import { ProtectedExportButton, ProtectedAnalytics } from "@/components/feature-protection-examples";

// Use in your components
<ProtectedExportButton />
<ProtectedAnalytics />
```

## 🔍 Troubleshooting

### Common Issues

1. **500 Errors**: Usually missing `ATLAS_API_KEY`
2. **Authentication Errors**: Check Clerk integration
3. **Feature Not Working**: Verify feature names in Atlas dashboard

### Debug Steps

1. Check environment variables are set
2. Verify Atlas API key is valid
3. Check browser console for errors
4. Verify feature names match Atlas dashboard

## 📋 Next Steps

1. **Configure Features**: Set up your features in Atlas dashboard
2. **Add More Protection**: Apply feature gates to other parts of your app
3. **Test Subscriptions**: Test the complete subscription flow
4. **Customize Pricing**: Configure your pricing plans in Atlas

## 🔗 Links

- [Atlas Documentation](https://atlas.runo.com/docs)
- [Atlas Dashboard](https://atlas.runo.com)
- [Feature Configuration Guide](https://atlas.runo.com/docs/features)

---

**Atlas Integration Complete!** 🎉 Your InvoiceHub now has full subscription management capabilities. 