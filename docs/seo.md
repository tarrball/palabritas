# SEO and Metadata Documentation

This document explains the SEO and social media optimization implemented for Palabritas.

## Overview

Palabritas uses a **single default social card approach** without Server-Side Rendering (SSR). All meta tags and structured data are embedded in the static `index.html` file that gets served to crawlers and social media scrapers.

## Implementation Details

### Meta Tags

The following meta tags are included in `src/index.html`:

#### Basic SEO
- `<title>`: Descriptive title optimized for search
- `<meta name="description">`: Comprehensive game description
- `<meta name="keywords">`: Relevant search keywords
- `<meta name="author">`: Content creator attribution
- `<link rel="canonical">`: Canonical URL to prevent duplicate content

#### Open Graph (Facebook, LinkedIn, etc.)
- `og:title`: Game title optimized for social sharing
- `og:description`: Engaging description for social previews
- `og:image`: High-quality social preview image (1200×630)
- `og:url`: Canonical URL
- `og:type`: Set to "website"
- `og:site_name`: Brand name

#### Twitter Cards
- `twitter:card`: Set to "summary_large_image"
- `twitter:title`: Twitter-optimized title
- `twitter:description`: Twitter-optimized description
- `twitter:image`: Same high-quality image as Open Graph
- `twitter:site`: Twitter handle

### Structured Data (JSON-LD)

A JSON-LD script provides structured data for search engines:
- `@type: WebSite`: Identifies the site as a website
- Includes name, URL, description, and logo
- Publisher information
- `potentialAction`: Describes the "Play Game" action

### Static Files

#### robots.txt
Located at `/robots.txt`, allows all crawlers and references the sitemap:
- Allows all user agents
- References sitemap location
- Allows crawling of assets

#### sitemap.xml
Located at `/sitemap.xml`, currently includes:
- Root URL (https://palabs.app/)
- Lastmod date
- Weekly change frequency
- Priority 1.0

### Favicon and Icons

Multiple icon formats for different contexts:
- `favicon.ico`: Traditional favicon
- `favicon-16x16.png`: 16×16 PNG favicon
- `favicon-32x32.png`: 32×32 PNG favicon
- `apple-touch-icon.png`: 180×180 Apple touch icon

## Asset Requirements

### Images Used

1. **Social Preview Image**: `src/assets/social/og-default.jpg`
   - Dimensions: 1200×630 pixels
   - Used for Open Graph and Twitter Card previews
   - Should be high quality and visually appealing

2. **Brand Logo**: `src/assets/brand/logo-512.png`
   - Dimensions: 512×512 pixels (square)
   - Used in JSON-LD structured data
   - Should be the main brand logo

3. **Favicons**: Located in `src/assets/icons/`
   - `favicon-16x16.png`: 16×16 pixels
   - `favicon-32x32.png`: 32×32 pixels

4. **Apple Touch Icon**: `src/apple-touch-icon.png`
   - Dimensions: 180×180 pixels
   - Used by iOS devices

### Replacing Images

To update the social preview or brand assets:

1. **Social Preview Image**:
   - Replace `src/assets/social/og-default.jpg`
   - Maintain 1200×630 dimensions
   - Keep filename the same

2. **Brand Logo**:
   - Replace `src/assets/brand/logo-512.png`
   - Maintain 512×512 dimensions (square)
   - Keep filename the same

3. **Favicons**:
   - Replace files in `src/assets/icons/`
   - Maintain specified dimensions
   - Keep filenames the same

## Build Configuration

The `angular.json` file has been updated to include the static files:
- `robots.txt`
- `sitemap.xml`
- `apple-touch-icon.png`

These files are copied to the root of the built application during the build process.

## Limitations and Future Enhancements

### Current Approach: Single Default Card

- **Pros**: 
  - Simple to implement and maintain
  - Works without SSR
  - Fast performance
  - Consistent branding

- **Cons**: 
  - Same preview for all pages/games
  - Cannot show game-specific information in social previews
  - Limited personalization

### Future Enhancements

For more advanced social media optimization, consider:

1. **Prerendering**: Use Angular Universal or build-time prerendering to generate static HTML for specific routes
2. **Dynamic Meta Tags**: Implement route-specific meta tags for different games or sections
3. **API-based Meta Generation**: Create serverless functions to generate dynamic meta tags
4. **Game-specific Images**: Generate social preview images for individual games

## Testing

### Local Testing

After building the application:

```bash
npm run build
```

Verify meta tags in the built HTML:

```bash
DIST_INDEX=$(ls dist/**/browser/index.html | head -n1)
grep -iE '<title>|meta name="description"|rel="canonical"|property="og:|name="twitter:|application/ld\\+json' "$DIST_INDEX"
```

### Social Media Preview Testing

Use these tools to test social media previews:
- **Facebook**: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: [Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [Post Inspector](https://www.linkedin.com/post-inspector/)

### SEO Testing

- **Google Search Console**: Monitor indexing and search performance
- **Google's Rich Results Test**: Verify structured data
- **PageSpeed Insights**: Check performance impact of meta tags

## Maintenance

### Regular Updates

1. **Sitemap**: Update lastmod date when content changes significantly
2. **Meta Descriptions**: Review and optimize based on search performance
3. **Images**: Update social preview images for seasonal content or major updates
4. **Structured Data**: Keep JSON-LD data current with any site changes

### Monitoring

- Monitor Google Search Console for crawling issues
- Track social media engagement on shared links
- Review Core Web Vitals to ensure meta tags don't impact performance