# People Section Sorting

## Current Structure

People are organized in **two levels**:
1. **First level:** Grouped by Title/Role into sections (e.g., "Principal Investigators", "Postdocs", "Field Team")
2. **Second level:** Sorted by Name within each section

## How It Works

### In Framer
- People are filtered/grouped by their Title/Role
- Within each group, they're sorted alphabetically by Name
- This creates sections on the People page

### In Decap CMS

**Current setup:**
- `sortable_fields: ["name", "title", "section", "order"]`
- You can sort by any of these fields, but it's **single-level sorting only**

**For hierarchical sorting (section → name):**
- Use the **"Order"** field to manually set order within each section
- Or sort by "Title" first to group, then manually arrange within groups

## Fields Added

1. **Section/Group** (optional)
   - Override the section grouping
   - If blank, uses Title/Role for grouping

2. **Order** (optional)
   - Order within section
   - Lower numbers appear first
   - If blank, sorts alphabetically by name within section

## Usage

### Option 1: Use Title/Role for Sections
1. Set **Title/Role** (e.g., "Principal Investigator", "Postdoc")
2. Set **Order** for position within that section (1, 2, 3...)
3. People with same Title/Role will be grouped together
4. Within each group, sorted by Order (then Name if Order is blank)

### Option 2: Use Section Field
1. Set **Section/Group** explicitly (e.g., "Leadership", "Researchers", "Field Team")
2. Set **Order** for position within section
3. More control over grouping

## Note

Decap CMS's built-in sorting is **single-level only**. For true hierarchical sorting (section → name), you would need:
- Manual ordering using the "Order" field
- Or JavaScript on the live site to implement two-level sorting

## Recommendation

**For now:** Use the CMS sorting to sort by "Title" to see people grouped by role, then manually set "Order" values within each group to control the order within sections.

**Future:** If you implement Option 1 (JavaScript) for live site sorting, we can add two-level sorting logic there.
