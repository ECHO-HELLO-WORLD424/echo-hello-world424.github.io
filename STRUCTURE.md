# Gallery Frontend Structure

## Directory Layout

```
gallery_frontend/
├── index.html              # Welcome/Entry page (scroll-based animation)
├── collections.html        # Photo collections grid
├── gallery.html           # Individual gallery images view
├── entrypoint_template.html # Original template (can be removed)
├── css/
│   ├── variables.css      # Material Design 3 design tokens
│   ├── base.css          # Reset & base styles
│   ├── components.css    # Reusable components (buttons, tags, pagination)
│   ├── gallery.css       # Gallery grid styles
│   ├── modal.css         # Image modal/lightbox
│   ├── covers.css        # Collection covers
│   └── welcome.css       # Welcome page specific styles
└── js/
    ├── index.js          # Collections page logic
    ├── gallery.js        # Gallery page logic
    ├── app.js            # Shared utilities (if any)
    └── welcome.js        # Welcome page scroll animations
```

## Page Flow

1. **index.html (Welcome/Entry Page)**
   - Scroll-based reveal animation
   - Contact info: Email, GitHub, OpenReview, Discord
   - Navigation: This Page, Gallery, Publications
   - Links to: `collections.html`

2. **collections.html (Photo Collections)**
   - Displays collection covers with tags
   - Back button to `index.html`
   - Clicking a cover opens `gallery.html?tag=<tag>`

3. **gallery.html (Gallery Images)**
   - Displays images filtered by tag
   - Pagination, tag filter
   - Lightbox modal for full-size view
   - Back button to `collections.html`

## Placeholders to Fill

### index.html
- Line 30: Email address and mailto link
- Line 37: GitHub username and URL
- Line 44: OpenReview profile ID (appears twice)
- Line 51: Discord user ID and username
- Line 73: OpenReview profile ID (Publications link)

### Notes
- All pages use Material Design 3 dark theme
- Modular CSS for easy maintenance
- Responsive design for mobile/tablet/desktop
