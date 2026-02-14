# Making CMS Sorting Work on Live Site

## Current Situation

The CMS sorting only affects the **admin view** in Decap CMS. The live site pages are static HTML from Framer, so they don't automatically use the CMS data or sorting.

## Solution Options

### Option 1: JavaScript Dynamic Loading (Recommended)

Add JavaScript to your pages that:
1. Loads the CMS JSON data (`/data/publications.json`, etc.)
2. Sorts by the `order` field (respects your CMS sorting)
3. Dynamically renders items on the page

**Pros:**
- Works with your current static site
- Respects the `order` field from CMS
- No build process needed

**Cons:**
- Requires identifying where items are displayed in HTML
- Need to replace static content with dynamic rendering

### Option 2: Build Script

Create a script that:
1. Reads CMS Markdown files
2. Sorts by `order` field
3. Regenerates HTML pages with sorted content

**Pros:**
- Fully static (no JavaScript needed)
- Better SEO

**Cons:**
- Requires running build script after CMS changes
- More complex setup

### Option 3: Keep Using Framer Order

Continue using Framer's built-in ordering:
- Set order in Framer CMS
- Re-download site with `./update-content.sh`
- Framer's order is preserved in HTML

**Pros:**
- Simplest
- No code changes needed

**Cons:**
- Requires re-downloading entire site for order changes
- Can't use Decap CMS order field

## Implementation: Option 1 (JavaScript)

I've created `/site/js/cms-sort.js` that:
- Loads JSON data from `/data/`
- Sorts by `order` field (if set)
- Falls back to default sorting (year/date/name)

**Next Steps:**

1. **Identify where items are displayed** in your HTML pages
   - Look for publication lists, people grids, news sections
   - Note the HTML structure/selectors

2. **Add the script** to your pages:
   ```html
   <script src="/js/cms-sort.js"></script>
   <script>
     // Load and render sorted items
     loadAndRenderPublications();
   </script>
   ```

3. **Create render functions** that:
   - Use the sorted data from `cms-sort.js`
   - Generate HTML matching your current design
   - Replace static content

## Which Option Do You Prefer?

- **Option 1**: I'll help implement JavaScript dynamic loading
- **Option 2**: I'll create a build script
- **Option 3**: Keep using Framer (current workflow)

Let me know which approach you'd like to use!
