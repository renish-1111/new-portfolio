# Netlify Deployment Configuration

## Environment Variables Required

Add this environment variable in your Netlify dashboard (Site settings → Environment variables):

```
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

## Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 or higher

## What Was Fixed

### 1. ✅ Tailwind CSS Production Setup
- Removed CDN version (not for production)
- Installed `@tailwindcss/postcss` as a proper PostCSS plugin
- Created `tailwind.config.js` and `postcss.config.js`
- Created `index.css` with all custom styles and Tailwind directives

### 2. ✅ Missing CSS File
- Removed incorrect reference to non-existent `/index.css`
- All styles now properly imported through `index.tsx`

### 3. ✅ Gemini API Key Error
- Changed from `process.env.API_KEY` to `import.meta.env.VITE_GEMINI_API_KEY`
- Updated `.env.local` to use `VITE_` prefix (Vite convention)
- Removed unnecessary `define` configuration from `vite.config.ts`

## Important Notes

⚠️ **Remember to:**
1. Set `VITE_GEMINI_API_KEY` in Netlify environment variables
2. Replace `PLACEHOLDER_API_KEY` with your actual Google AI API key
3. Clear cache and redeploy if issues persist
