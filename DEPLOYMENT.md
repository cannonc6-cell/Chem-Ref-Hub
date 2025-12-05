# Deployment Guide - Chemical Reference Hub

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] Firebase project created
- [ ] Vercel/Netlify account (or preferred hosting)
- [ ] All Firebase credentials ready

---

## Step 1: Environment Setup ✅

### Create `.env.local`
Already created! Now fill in your actual Firebase credentials:

```bash
# Open .env.local and replace placeholder values with real ones
```

**Get credentials from**: Firebase Console → Project Settings → General

---

## Step 2: Firebase Configuration

### Security Rules ✅
`firebase.rules.json` has been created with secure defaults.

**To deploy**:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select Firestore/Database)
firebase init

# Deploy security rules
firebase deploy --only firestore:rules
```

### Optional: Enable Firebase App Check
1. Go to Firebase Console → App Check
2. Enable for your web app
3. Add reCAPTCHA v3 site key
4. Update code to initialize App Check

---

## Step 3: Build & Test

```bash
# Install dependencies
npm install

# Test development build
npm run dev

# Test production build
npm run build
npm run preview

# Run tests (if configured)
npm run test
```

---

## Step 4: Deploy to Vercel

### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option B: Vercel GitHub Integration
1. Push code to GitHub
2. Go to vercel.com
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Environment Variables in Vercel:
```
VITE_FIREBASE_API_KEY=<your_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_domain>
VITE_FIREBASE_PROJECT_ID=<your_project>
VITE_FIREBASE_STORAGE_BUCKET=<your_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_id>
VITE_FIREBASE_APP_ID=<your_app_id>
VITE_FIREBASE_MEASUREMENT_ID=<your_measurement_id>
```

---

## Step 5: Post-Deployment Checklist

### Immediately After Deploy:
- [ ] Test authentication flow
- [ ] Verify chemical data loads
- [ ] Test add/edit/delete operations
- [ ] Check PDF generation
- [ ] Test QR code generation
- [ ] Verify offline mode (PWA)
- [ ] Test on mobile devices

### Security Verification:
- [ ] Confirm HTTPS is active
- [ ] Check Firebase security rules are deployed
- [ ] Verify `.env.local` not in repository
- [ ] Test unauthorized access attempts
- [ ] Review Firebase Auth settings

### Performance:
- [ ] Run Lighthouse audit (aim for 90+ on all metrics)
- [ ] Check bundle size
- [ ] Verify service worker is active
- [ ] Test offline functionality

---

## Step 6: Monitoring Setup

### Error Tracking (Optional but Recommended)

**Option 1: Sentry** (Recommended)
```bash
npm install @sentry/react

# Add to main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

**Option 2: LogRocket**
```bash
npm install logrocket
```

**Option 3: Use ErrorBoundary** (Already implemented! ✅)
- Errors are caught and displayed gracefully
- In dev mode, shows error details
- In production, shows friendly error message

---

## Step 7: Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Update Firebase:
1. Firebase Console → Authentication → Settings
2. Add your custom domain to authorized domains

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Firebase Connection Issues
- Check environment variables are set correctly
- Verify Firebase project is active
- Check browser console for specific errors
- Ensure Firebase Auth authorized domains include your deployment URL

### CSS Not Loading
- Clear browser cache
- Check CSS imports in `main.jsx`
- Verify CSS files exist in `src/styles/`

### Service Worker Issues
```bash
# Unregister old service workers
# In browser console:
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(reg => reg.unregister()))
```

---

## Maintenance

### Regular Updates:
```bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

### Backup Strategy:
- Data is stored in localStorage (user's browser)
- Export backups regularly via Backup/Restore feature
- Consider implementing cloud sync with Firebase Firestore

---

## Production URLs

After deployment, your app will be available at:
- **Vercel**: `https://chem-ref-hub.vercel.app` (or custom domain)
- **Netlify**: `https://chem-ref-hub.netlify.app` (or custom domain)

---

## Success Criteria

✅ App loads without errors  
✅ Authentication works  
✅ All features functional  
✅ HTTPS enabled  
✅ PWA installable  
✅ Error boundary catches errors  
✅ Performance score 90+  

**Congratulations! Your Chemical Reference Hub is now live! 🎉**
