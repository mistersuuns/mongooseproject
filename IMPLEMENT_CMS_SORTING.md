# Implementing CMS Sorting on Live Site (Option 1)

## Step 1: Add Scripts to Your Pages

Add these scripts to your HTML pages **before the closing `</body>` tag**:

### For `publications.html`:
```html
<script src="/js/cms-sort.js"></script>
<script src="/js/cms-render.js"></script>
```

### For `people.html`:
```html
<script src="/js/cms-sort.js"></script>
<script src="/js/cms-render.js"></script>
```

### For `news.html`:
```html
<script src="/js/cms-sort.js"></script>
<script src="/js/cms-render.js"></script>
```

## Step 2: Identify Where Items Are Displayed

Since Framer HTML is minified, you need to find where publications/people/news are displayed:

1. **Open your site in browser**: `https://earnest-quokka-5963b7.netlify.app/publications`
2. **Right-click** on a publication item → **Inspect Element**
3. **Note the HTML structure** and find a **unique selector** or **parent container**

## Step 3: Mark the Container

Add a `data` attribute to the container where items are displayed:

### Option A: If you can edit the HTML directly
```html
<div data-cms-publications>
    <!-- Existing publications will be replaced here -->
</div>
```

### Option B: If HTML is minified (use JavaScript)
Add this script **after** the render script:
```html
<script>
// Find and mark the container
document.addEventListener('DOMContentLoaded', function() {
    // Adjust selector based on your HTML structure
    const container = document.querySelector('main') || document.querySelector('#main');
    if (container) {
        container.setAttribute('data-cms-publications', '');
    }
});
</script>
```

## Step 4: Customize Rendering

Edit `/site/js/cms-render.js` to match your HTML structure:

1. **Update selectors** in `renderPublications()`, `renderPeople()`, `renderNews()`
2. **Customize HTML template** to match your design
3. **Add CSS classes** that match your existing styles

## Step 5: Test

1. **Set `order` values** in Decap CMS for some items
2. **Commit and push** changes
3. **Visit your site** - items should appear in the order you set

## Troubleshooting

**Items not appearing?**
- Check browser console for errors
- Verify JSON files are accessible: `/data/publications.json`
- Check container selector matches your HTML

**Wrong styling?**
- Update HTML template in `cms-render.js` to match your CSS
- Add your existing CSS classes to the generated HTML

**Order not working?**
- Verify `order` field is set in CMS
- Check that JSON files include the `order` field
- Run `npm run extract-cms` to regenerate JSON if needed

## Alternative: Gradual Migration

If you can't find the exact container, you can:

1. **Add a new section** at the top/bottom of the page
2. **Render sorted items there** first
3. **Hide old static content** with CSS
4. **Gradually migrate** as you identify containers

```html
<!-- Add this to your page -->
<div id="cms-publications-container"></div>

<style>
/* Hide old static content once new one works */
.old-publications { display: none; }
</style>
```
