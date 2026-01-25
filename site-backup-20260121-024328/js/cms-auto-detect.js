/**
 * Auto-detect containers for CMS content
 * This script helps identify where items are displayed
 */

document.addEventListener('DOMContentLoaded', function() {
    // Try to find containers automatically
    const publicationsPage = window.location.pathname.includes('publications');
    const peoplePage = window.location.pathname.includes('people');
    const newsPage = window.location.pathname.includes('news');
    
    if (publicationsPage) {
        autoDetectPublications();
    } else if (peoplePage) {
        autoDetectPeople();
    } else if (newsPage) {
        autoDetectNews();
    }
});

function autoDetectPublications() {
    // Look for common patterns
    const selectors = [
        'main',
        '#main',
        '[data-framer-name*="publication"]',
        '[class*="publication"]',
        'article',
        '.framer-rt8ch2-container' // Common Framer container
    ];
    
    for (const selector of selectors) {
        const container = document.querySelector(selector);
        if (container && container.children.length > 0) {
            console.log('Found potential publications container:', selector, container);
            container.setAttribute('data-cms-publications', '');
            // Try rendering
            if (window.CMSSort) {
                setTimeout(() => renderPublications(), 500);
            }
            break;
        }
    }
}

function autoDetectPeople() {
    const selectors = [
        'main',
        '#main',
        '[data-framer-name*="people"]',
        '[class*="people"]',
        '.framer-rt8ch2-container'
    ];
    
    for (const selector of selectors) {
        const container = document.querySelector(selector);
        if (container && container.children.length > 0) {
            console.log('Found potential people container:', selector, container);
            container.setAttribute('data-cms-people', '');
            if (window.CMSSort) {
                setTimeout(() => renderPeople(), 500);
            }
            break;
        }
    }
}

function autoDetectNews() {
    const selectors = [
        'main',
        '#main',
        '[data-framer-name*="news"]',
        '[class*="news"]',
        '.framer-rt8ch2-container'
    ];
    
    for (const selector of selectors) {
        const container = document.querySelector(selector);
        if (container && container.children.length > 0) {
            console.log('Found potential news container:', selector, container);
            container.setAttribute('data-cms-news', '');
            if (window.CMSSort) {
                setTimeout(() => renderNews(), 500);
            }
            break;
        }
    }
}

// Import render functions (they're in cms-render.js)
async function renderPublications() {
    if (!window.CMSSort) return;
    try {
        const publications = await window.CMSSort.loadAndSortPublications();
        const container = document.querySelector('[data-cms-publications]');
        if (!container) return;
        
        const html = publications.map(pub => `
            <article class="publication-item" data-order="${pub.order || ''}">
                <h3><a href="${pub.url || `/pubs-news-ppl/${pub.slug}.html`}">${pub.title}</a></h3>
                ${pub.year ? `<span class="year">${pub.year}</span>` : ''}
                ${pub.authors && pub.authors.length > 0 ? `<p class="authors">${pub.authors.join(', ')}</p>` : ''}
                ${pub.description ? `<p class="description">${pub.description}</p>` : ''}
            </article>
        `).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error rendering publications:', error);
    }
}

async function renderPeople() {
    if (!window.CMSSort) return;
    try {
        const people = await window.CMSSort.loadAndSortPeople();
        const container = document.querySelector('[data-cms-people]');
        if (!container) return;
        
        const html = people.map(person => `
            <div class="person-item" data-order="${person.order || ''}">
                <h3>${person.name}</h3>
                ${person.title ? `<p class="role">${person.title}</p>` : ''}
                ${person.description ? `<p class="description">${person.description}</p>` : ''}
            </div>
        `).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error rendering people:', error);
    }
}

async function renderNews() {
    if (!window.CMSSort) return;
    try {
        const news = await window.CMSSort.loadAndSortNews();
        const container = document.querySelector('[data-cms-news]');
        if (!container) return;
        
        const html = news.map(item => `
            <article class="news-item" data-order="${item.order || ''}">
                <h3><a href="${item.url || `/pubs-news-ppl/${item.slug}.html`}">${item.title}</a></h3>
                ${item.date ? `<time datetime="${item.date}">${formatDate(item.date)}</time>` : ''}
                ${item.description ? `<p class="description">${item.description}</p>` : ''}
            </article>
        `).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error rendering news:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}
