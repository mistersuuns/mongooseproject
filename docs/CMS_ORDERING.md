# Ordering CMS Entries

## How It Works

You can now control the order of publications, people, and news items using an **Order** field in Decap CMS.

## Using the Order Field

1. **Open Decap CMS**: Visit `https://your-site.netlify.app/admin/`
2. **Edit an entry**: Click on any publication, person, or news item
3. **Set the Order field**: 
   - Lower numbers appear first (1, 2, 3...)
   - Leave blank for default sorting
4. **Save**: Changes commit to GitHub automatically

## Default Sorting (when Order is blank)

- **Publications**: By year (newest first), then alphabetically by title
- **News**: By date (newest first), then alphabetically by title  
- **People**: Alphabetically by name

## Examples

**Publications:**
- Order: 1 → Appears first
- Order: 2 → Appears second
- Order: (blank) → Uses default (year, then title)

**People:**
- Order: 1 → Principal Investigator appears first
- Order: 2 → Postdocs appear second
- Order: (blank) → Uses default (alphabetical)

## Important Note

⚠️ **The Order field is stored in your CMS data**, but **your static HTML pages from Framer don't automatically use it**.

### Option 1: Use JavaScript (Recommended for Static Sites)

Add JavaScript to your pages that:
1. Loads the CMS data (JSON files)
2. Sorts by the `order` field
3. Dynamically reorders the displayed items

### Option 2: Rebuild Pages from CMS Data

Create a build script that:
1. Reads CMS data (Markdown files)
2. Generates HTML pages with items in the correct order
3. Replaces the static Framer pages

### Option 3: Keep Using Framer's Ordering

If you prefer to control order in Framer:
- Set order in Framer CMS
- Re-download site with `./update-content.sh`
- The Framer order will be preserved

## Current Setup

Right now, your site uses **static HTML from Framer**. The Order field in Decap CMS is available, but you'll need to implement one of the options above to use it on the live site.

**Quick Test:**
1. Add Order values in Decap CMS
2. Check `data/publications/*.md` files - you'll see `order: 1` in frontmatter
3. The field is there, ready to use when you implement sorting
