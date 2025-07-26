# Teresa Health - GitHub Pages Deployment

This is a React/Vite application deployed to GitHub Pages at https://chw708.github.io

## Deployment Setup

The app is automatically deployed via GitHub Actions when you push to the main branch.

### Required GitHub Settings:

1. **Repository Settings**:
   - Go to your repository Settings > Pages
   - Set Source to "GitHub Actions"
   - The deploy.yml workflow will handle the build and deployment

2. **Repository Name**: 
   - Your repository should be named `chw708.github.io` (matching your username)
   - This enables the site to be accessible at `https://chw708.github.io/`

### Local Development:

```bash
npm install
npm run dev
```

### Manual Build:

```bash
npm run build:gh-pages
```

The built files will be in the `dist/` folder.

### Troubleshooting:

If the site doesn't load:
1. Check GitHub Actions tab for build errors
2. Ensure GitHub Pages is enabled in repository settings
3. Verify the source is set to "GitHub Actions"
4. Make sure the repository name is `chw708.github.io`

## Features

- Morning, Midday, and Night health check-ins
- AI-powered health scoring and advice
- Emotional support chatbot
- Dashboard with health trends
- Multi-language support (English/Korean)
- Responsive design optimized for mobile and desktop