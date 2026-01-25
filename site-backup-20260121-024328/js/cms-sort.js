/**
 * CMS Sorting Script
 * Loads CMS data and applies sorting based on the "order" field
 * Falls back to default sorting if order is not set
 */

// Sort function that respects the "order" field
function sortByOrder(items, defaultSortFn) {
    return items.sort((a, b) => {
        // If both have order, sort by order (lower numbers first)
        if (a.order !== undefined && a.order !== null && b.order !== undefined && b.order !== null) {
            return a.order - b.order;
        }
        // If only a has order, it comes first
        if (a.order !== undefined && a.order !== null) {
            return -1;
        }
        // If only b has order, it comes first
        if (b.order !== undefined && b.order !== null) {
            return 1;
        }
        // Neither has order, use default sorting
        return defaultSortFn ? defaultSortFn(a, b) : 0;
    });
}

// Load and sort publications
async function loadAndSortPublications() {
    try {
        const response = await fetch('/data/publications.json');
        const publications = await response.json();
        
        // Sort: first by order field, then by year (desc), then by title
        const sorted = sortByOrder(publications, (a, b) => {
            // Default: year descending, then title ascending
            if (a.year && b.year && a.year !== b.year) {
                return b.year - a.year; // Newer first
            }
            return (a.title || '').localeCompare(b.title || '');
        });
        
        return sorted;
    } catch (error) {
        console.error('Error loading publications:', error);
        return [];
    }
}

// Load and sort news
async function loadAndSortNews() {
    try {
        const response = await fetch('/data/news.json');
        const news = await response.json();
        
        // Sort: first by order field, then by date (desc), then by title
        const sorted = sortByOrder(news, (a, b) => {
            // Default: date descending, then title ascending
            if (a.date && b.date) {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA.getTime() !== dateB.getTime()) {
                    return dateB - dateA; // Newer first
                }
            }
            return (a.title || '').localeCompare(b.title || '');
        });
        
        return sorted;
    } catch (error) {
        console.error('Error loading news:', error);
        return [];
    }
}

// Load and sort people
async function loadAndSortPeople() {
    try {
        const response = await fetch('/data/people.json');
        const people = await response.json();
        
        // Sort: first by order field, then alphabetically by name
        const sorted = sortByOrder(people, (a, b) => {
            return (a.name || '').localeCompare(b.name || '');
        });
        
        return sorted;
    } catch (error) {
        console.error('Error loading people:', error);
        return [];
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.CMSSort = {
        loadAndSortPublications,
        loadAndSortNews,
        loadAndSortPeople,
        sortByOrder
    };
}
