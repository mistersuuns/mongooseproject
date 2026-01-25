/**
 * CMS Render Script
 * Dynamically loads and renders CMS content with proper sorting
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Auto-detect which page we're on and load appropriate content
    const path = window.location.pathname;
    
    if (path.includes('publications') || path.endsWith('publications.html')) {
        renderPublications();
    } else if (path.includes('people') || path.endsWith('people.html')) {
        renderPeople();
    } else if (path.includes('news') || path.endsWith('news.html')) {
        renderNews();
    }
});

// Render publications
async function renderPublications() {
    try {
        const publications = await window.CMSSort.loadAndSortPublications();
        
        // Find container - adjust selector based on your HTML structure
        const container = document.querySelector('[data-cms-publications]') || 
                         document.querySelector('.publications-list') ||
                         document.getElementById('publications-container') ||
                         document.querySelector('main');
        
        if (!container) {
            console.warn('Publications container not found. Add data-cms-publications attribute to your container.');
            return;
        }
        
        // Create HTML for publications
        const html = publications.map(pub => `
            <article class="publication-item" data-order="${pub.order || ''}">
                <h3><a href="${pub.url || `/pubs-news-ppl/${pub.slug}.html`}">${pub.title}</a></h3>
                ${pub.year ? `<span class="year">${pub.year}</span>` : ''}
                ${pub.authors && pub.authors.length > 0 ? `<p class="authors">${pub.authors.join(', ')}</p>` : ''}
                ${pub.description ? `<p class="description">${pub.description}</p>` : ''}
            </article>
        `).join('');
        
        // Insert into container
        // Option 1: Replace existing content
        container.innerHTML = html;
        
        // Option 2: Append to existing content (uncomment if preferred)
        // container.insertAdjacentHTML('beforeend', html);
        
    } catch (error) {
        console.error('Error rendering publications:', error);
    }
}

// Render people
async function renderPeople() {
    try {
        const people = await window.CMSSort.loadAndSortPeople();
        
        const container = document.querySelector('[data-cms-people]') || 
                         document.querySelector('.people-list') ||
                         document.getElementById('people-container') ||
                         document.querySelector('main');
        
        if (!container) {
            console.warn('People container not found. Add data-cms-people attribute to your container.');
            return;
        }
        
        const html = people.map(person => `
            <div class="person-item" data-order="${person.order || ''}">
                <h3>${person.name}</h3>
                ${person.title ? `<p class="role">${person.title}</p>` : ''}
                ${person.description ? `<p class="description">${person.description}</p>` : ''}
                ${person.email ? `<p class="email"><a href="mailto:${person.email}">${person.email}</a></p>` : ''}
                ${person.url ? `<a href="${person.url}">View profile</a>` : ''}
            </div>
        `).join('');
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error rendering people:', error);
    }
}

// Render news
async function renderNews() {
    try {
        const news = await window.CMSSort.loadAndSortNews();
        
        const container = document.querySelector('[data-cms-news]') || 
                         document.querySelector('.news-list') ||
                         document.getElementById('news-container') ||
                         document.querySelector('main');
        
        if (!container) {
            console.warn('News container not found. Add data-cms-news attribute to your container.');
            return;
        }
        
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

// Helper: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}
