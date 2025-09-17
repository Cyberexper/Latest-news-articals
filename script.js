// Global variables
let allArticles = [];
let filteredArticles = [];
let currentPage = 1;
const articlesPerPage = 12;
let isLoading = false;
let currentView = 'grid';
let lastRequestTime = 0;
let currentCategory = 'business'; // Track current category
const REQUEST_THROTTLE_MS = 2000; // 2 seconds between requests

// API configuration - Using NewsAPI.org (free tier)
const API_CONFIG = {
    url: 'https://newsapi.org/v2/top-headlines',
    headers: {
        'X-API-Key': '62b677664ead48a5ae1535bfbf6c245b' // Get free key from newsapi.org
    },
    params: {
        country: 'us',
        category: 'business',
        pageSize: 50
    }
};

// Alternative free APIs configuration
const ALTERNATIVE_APIS = {
    // Guardian API (free)
    guardian: {
        url: 'https://content.guardianapis.com/search',
        params: {
            'api-key': 'test', // Free test key
            section: 'business',
            'show-fields': 'thumbnail,headline,bodyText',
            'page-size': 50
        }
    },
    // New York Times API (free tier)
    nytimes: {
        url: 'https://api.nytimes.com/svc/topstories/v2/business.json',
        params: {
            'api-key': 'your_nyt_key_here' // Get free key from developer.nytimes.com
        }
    }
};

// Enhanced mock data with more realistic business news
const MOCK_NEWS_DATA = {
    articles: [
        {
            title: "Microsoft Reports Record Q4 Revenue Driven by Cloud Services Growth",
            description: "Microsoft Corporation announced record-breaking quarterly revenue of $62.9 billion, with Azure cloud services showing 29% year-over-year growth as enterprises continue digital transformation initiatives.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
            publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            source: { name: "Tech Business Weekly" },
            author: "Sarah Johnson"
        },
        {
            title: "Federal Reserve Announces 0.25% Interest Rate Increase Amid Inflation Concerns",
            description: "The Federal Reserve raised interest rates by a quarter percentage point, citing persistent inflation pressures and strong labor market conditions as key factors in the monetary policy decision.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400",
            publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            source: { name: "Financial Times" },
            author: "Robert Chen"
        },
        {
            title: "Tesla Expands Supercharger Network with 500 New Stations Across North America",
            description: "Tesla announced plans to install 500 new Supercharger stations across the United States and Canada, marking the largest single expansion of the company's charging infrastructure.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400",
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            source: { name: "Electric Vehicle News" },
            author: "Maria Rodriguez"
        },
        {
            title: "Amazon Web Services Launches New AI-Powered Analytics Platform",
            description: "AWS introduced a comprehensive analytics platform that leverages artificial intelligence to provide real-time insights for enterprise customers, targeting the growing business intelligence market.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
            publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
            source: { name: "Cloud Computing Today" },
            author: "David Kim"
        },
        {
            title: "Global Supply Chain Costs Drop 15% as Shipping Routes Normalize",
            description: "International shipping costs have decreased significantly as major trade routes return to pre-pandemic efficiency levels, providing relief for manufacturers and retailers worldwide.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400",
            publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
            source: { name: "Global Trade Journal" },
            author: "Emily Zhang"
        },
        {
            title: "Cryptocurrency Market Stabilizes as Bitcoin Holds Above $45,000 Mark",
            description: "Bitcoin and other major cryptocurrencies show signs of price stabilization, with institutional investors continuing to view digital assets as a hedge against traditional market volatility.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400",
            publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
            source: { name: "Crypto Business News" },
            author: "Alex Thompson"
        },
        {
            title: "Renewable Energy Investments Reach $1.1 Trillion Globally in 2024",
            description: "Global investment in renewable energy projects surpassed $1 trillion this year, driven by government incentives and corporate sustainability commitments across major economies.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
            publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
            source: { name: "Green Energy Report" },
            author: "Lisa Park"
        },
        {
            title: "Major Banks Report Strong Q4 Earnings Despite Economic Uncertainty",
            description: "Leading financial institutions posted better-than-expected quarterly results, with robust trading revenues and loan growth offsetting concerns about potential economic slowdown.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
            publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
            source: { name: "Banking Weekly" },
            author: "Michael Brown"
        },
        {
            title: "E-commerce Sales Surge 22% During Holiday Season, Breaking Records",
            description: "Online retail sales reached unprecedented levels during the holiday shopping period, with mobile commerce accounting for 65% of all digital transactions according to industry data.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
            publishedAt: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
            source: { name: "Retail Insights" },
            author: "Jennifer Lee"
        },
        {
            title: "Artificial Intelligence Startup Funding Hits $25 Billion in 2024",
            description: "Venture capital investment in AI startups reached a record $25 billion this year, with enterprise automation and healthcare applications receiving the largest funding rounds.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
            publishedAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
            source: { name: "Startup Tracker" },
            author: "Kevin Wu"
        },
        {
            title: "Oil Prices Stabilize at $78 Per Barrel Amid OPEC Production Agreements",
            description: "Crude oil futures showed stability around $78 per barrel as OPEC+ members agreed to maintain current production levels through the first quarter of next year.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400",
            publishedAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
            source: { name: "Energy Markets Daily" },
            author: "Amanda Davis"
        },
        {
            title: "Manufacturing Index Shows Strongest Growth in 18 Months",
            description: "The latest manufacturing PMI reached 58.7, indicating robust expansion in the sector driven by increased domestic demand and improved supply chain efficiency.",
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
            publishedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
            source: { name: "Industrial Report" },
            author: "Thomas Wilson"
        }
    ]
};

// DOM elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    clearBtn: document.getElementById('clearBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    retryBtn: document.getElementById('retryBtn'),
    viewToggle: document.getElementById('viewToggle'),
    subscribeBtn: document.getElementById('subscribeBtn'),
    exploreBtn: document.getElementById('exploreBtn'),
    newsletterBtn: document.getElementById('newsletterBtn'),
    newsContainer: document.getElementById('newsContainer'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    noResults: document.getElementById('noResults'),
    resultsCount: document.getElementById('resultsCount'),
    dataSource: document.getElementById('dataSource'),
    dataSourceText: document.getElementById('dataSourceText'),
    paginationContainer: document.getElementById('paginationContainer'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    pageInfo: document.getElementById('pageInfo'),
    backToTop: document.getElementById('backToTop'),
    lightboxModal: document.getElementById('lightboxModal'),
    lightboxImage: document.getElementById('lightboxImage'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxDescription: document.getElementById('lightboxDescription'),
    lightboxClose: document.querySelector('.lightbox-close'),
    header: document.querySelector('.header')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeAccessibility();
    initializeScrollBehavior();
    loadNews();
});

// Event listeners
function initializeEventListeners() {
    // Search functionality
    elements.searchInput.addEventListener('input', handleSearch);
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.clearBtn.addEventListener('click', clearSearch);
    
    // Enter key for search
    elements.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Control buttons
    elements.refreshBtn.addEventListener('click', loadNews);
    elements.retryBtn.addEventListener('click', loadNews);
    elements.viewToggle?.addEventListener('click', toggleView);
    
    // CTA buttons
    elements.subscribeBtn?.addEventListener('click', handleSubscribe);
    elements.exploreBtn?.addEventListener('click', handleExplore);
    elements.newsletterBtn?.addEventListener('click', handleNewsletter);
    
    // Pagination
    elements.prevBtn.addEventListener('click', () => changePage(currentPage - 1));
    elements.nextBtn.addEventListener('click', () => changePage(currentPage + 1));
    
    // Back to top
    elements.backToTop?.addEventListener('click', scrollToTop);
    
    // Lightbox
    elements.lightboxClose?.addEventListener('click', closeLightbox);
    elements.lightboxModal?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Dropdown functionality
    initializeDropdowns();
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Initialize accessibility features
function initializeAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main id
    elements.newsContainer.closest('.main').id = 'main';
    
    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'announcer';
    document.body.appendChild(announcer);
}

// Initialize scroll behavior
function initializeScrollBehavior() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header scroll effect
        if (scrollTop > 100) {
            elements.header.classList.add('scrolled');
        } else {
            elements.header.classList.remove('scrolled');
        }
        
        // Back to top button
        if (scrollTop > 500) {
            elements.backToTop.style.display = 'flex';
        } else {
            elements.backToTop.style.display = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Dropdown functionality
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.parentNode;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                    d.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
            this.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!toggle.parentNode.contains(e.target)) {
                toggle.parentNode.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Handle category clicks
    const categoryLinks = document.querySelectorAll('.dropdown-item');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.toLowerCase();
            handleCategoryChange(category);
            
            // Close dropdown
            const dropdown = this.closest('.dropdown');
            dropdown.classList.remove('active');
            dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
            
            // Update dropdown text
            const dropdownText = dropdown.querySelector('.dropdown-toggle');
            dropdownText.childNodes[0].textContent = this.textContent + ' ';
        });
    });
}

// Handle category changes
function handleCategoryChange(category) {
    currentCategory = category;
    
    // Update the API configuration for the new category
    if (category === 'technology') {
        API_CONFIG.params.category = 'technology';
    } else if (category === 'finance') {
        API_CONFIG.params.category = 'business';
    } else if (category === 'markets') {
        API_CONFIG.params.category = 'business';
    } else if (category === 'startups') {
        API_CONFIG.params.category = 'technology';
    } else {
        API_CONFIG.params.category = 'business';
    }
    
    // Show loading and fetch new articles
    showToast(`Loading ${category} news...`);
    announceToScreenReader(`Loading ${category} news articles`);
    
    // Clear current articles and load new ones
    allArticles = [];
    filteredArticles = [];
    currentPage = 1;
    
    // Load news for the selected category
    loadNews();
}

// Generate category-specific mock data
function generateCategoryNews(category) {
    const categoryData = {
        technology: {
            articles: [
                {
                    title: "Apple Unveils Revolutionary AI-Powered MacBook Pro with M4 Chip",
                    description: "Apple's latest MacBook Pro features the groundbreaking M4 chip with enhanced AI capabilities, delivering unprecedented performance for creative professionals.",
                    url: "#",
                    urlToImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
                    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Tech Insider" },
                    author: "Sarah Johnson"
                },
                {
                    title: "Google's Quantum Computer Achieves Breakthrough in Error Correction",
                    description: "Google's latest quantum computing advancement brings us closer to practical quantum applications with significantly improved error correction rates.",
                    url: "#",
                    urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
                    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Quantum Today" },
                    author: "Dr. Michael Chen"
                }
            ]
        },
        finance: [
            {
                title: "Federal Reserve Maintains Interest Rates Amid Economic Stability",
                description: "The Fed kept interest rates unchanged at 5.25-5.5% as inflation continues to moderate and employment remains strong across major sectors.",
                url: "#",
                urlToImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                source: { name: "Financial Review" },
                author: "Robert Martinez"
            }
        ],
        markets: [
            {
                title: "S&P 500 Reaches New All-Time High Driven by Tech Rally",
                description: "Major stock indices surged to record levels as technology stocks led a broad market rally, with AI companies showing particularly strong gains.",
                url: "#",
                urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
                publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                source: { name: "Market Watch" },
                author: "Jennifer Liu"
            }
        ],
        startups: [
            {
                title: "AI Startup SecureVault Raises $50M in Series B Funding",
                description: "The cybersecurity startup plans to use the funding to expand its AI-powered threat detection platform and enter international markets.",
                url: "#",
                urlToImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400",
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                source: { name: "Startup News" },
                author: "Alex Thompson"
            }
        ]
    };
    
    return categoryData[category] || MOCK_NEWS_DATA.articles;
}

// Load news from multiple API sources
async function loadNews() {
    if (isLoading) return;
    
    // Throttle requests to prevent rate limiting
    const now = Date.now();
    if (now - lastRequestTime < REQUEST_THROTTLE_MS) {
        showToast('Please wait before refreshing again');
        return;
    }
    
    showLoading();
    isLoading = true;
    lastRequestTime = now;
    
    try {
        // Try multiple API sources in sequence
        let data = await tryMultipleAPIs();
        
        if (data && data.articles && Array.isArray(data.articles)) {
            allArticles = data.articles.filter(article => 
                article.title && 
                article.title.trim() !== '' && 
                article.title !== '[Removed]'
            );
            
            if (allArticles.length === 0) {
                throw new Error('No valid articles received from any API');
            }
            
            // Show live data indicator
            showDataSourceIndicator('live');
        } else {
            throw new Error('Invalid API response format from all sources');
        }
        
    } catch (error) {
        console.warn('All APIs failed, using enhanced mock data:', error);
        
        // Use category-specific mock data or enhanced general content
        let enhancedData;
        if (currentCategory && currentCategory !== 'business') {
            const categoryArticles = generateCategoryNews(currentCategory);
            enhancedData = { articles: categoryArticles };
        } else {
            enhancedData = generateCustomNews();
        }
        
        allArticles = enhancedData.articles;
        
        // Show data source indicator
        showDataSourceIndicator('demo');
        
        // Show user-friendly message
        const categoryText = currentCategory ? ` for ${currentCategory}` : '';
        showToast(`Loading enhanced demo content${categoryText} - Full featured experience available!`);
        announceToScreenReader(`Loading comprehensive demo ${currentCategory || 'business'} news content with dynamic articles`);
    }
    
    if (allArticles.length === 0) {
        showNoResults();
    } else {
        // Reset to first page and apply current search
        currentPage = 1;
        applyCurrentSearch();
    }
    
    isLoading = false;
    hideLoading();
}

// Try multiple API sources
async function tryMultipleAPIs() {
    const apiSources = [
        { name: 'NewsAPI', fetch: fetchFromNewsAPI },
        { name: 'Guardian', fetch: fetchFromGuardian },
        { name: 'NYTimes', fetch: fetchFromNYTimes }
    ];
    
    for (const source of apiSources) {
        try {
            console.log(`Trying ${source.name} API...`);
            const data = await source.fetch();
            if (data && data.articles && data.articles.length > 0) {
                console.log(`Successfully loaded from ${source.name}`);
                return data;
            }
        } catch (error) {
            console.warn(`${source.name} API failed:`, error.message);
            continue;
        }
    }
    
    throw new Error('All API sources failed');
}

// NewsAPI.org implementation
async function fetchFromNewsAPI() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
        const url = new URL(API_CONFIG.url);
        Object.keys(API_CONFIG.params).forEach(key => {
            url.searchParams.append(key, API_CONFIG.params[key]);
        });
        
        const response = await fetch(url, {
            method: 'GET',
            headers: API_CONFIG.headers,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`NewsAPI HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform NewsAPI format to our standard format
        return {
            articles: data.articles.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                source: article.source,
                author: article.author
            }))
        };
        
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Guardian API implementation
async function fetchFromGuardian() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
        const url = new URL(ALTERNATIVE_APIS.guardian.url);
        Object.keys(ALTERNATIVE_APIS.guardian.params).forEach(key => {
            url.searchParams.append(key, ALTERNATIVE_APIS.guardian.params[key]);
        });
        
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Guardian API HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform Guardian format to our standard format
        return {
            articles: data.response.results.map(article => ({
                title: article.webTitle,
                description: article.fields?.bodyText?.substring(0, 200) + '...' || 'Read more at The Guardian',
                url: article.webUrl,
                urlToImage: article.fields?.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
                publishedAt: article.webPublicationDate,
                source: { name: 'The Guardian' },
                author: 'The Guardian'
            }))
        };
        
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// New York Times API implementation
async function fetchFromNYTimes() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
        const url = new URL(ALTERNATIVE_APIS.nytimes.url);
        Object.keys(ALTERNATIVE_APIS.nytimes.params).forEach(key => {
            url.searchParams.append(key, ALTERNATIVE_APIS.nytimes.params[key]);
        });
        
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`NYTimes API HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform NYTimes format to our standard format
        return {
            articles: data.results.map(article => ({
                title: article.title,
                description: article.abstract || 'Read more at The New York Times',
                url: article.url,
                urlToImage: article.multimedia?.[0]?.url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
                publishedAt: article.published_date,
                source: { name: 'The New York Times' },
                author: article.byline || 'The New York Times'
            }))
        };
        
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Handle search functionality
function handleSearch() {
    const searchTerm = elements.searchInput.value.trim();
    
    if (searchTerm) {
        elements.clearBtn.style.display = 'block';
        filterArticles(searchTerm);
    } else {
        clearSearch();
    }
}

// Clear search
function clearSearch() {
    elements.searchInput.value = '';
    elements.clearBtn.style.display = 'none';
    filteredArticles = [...allArticles];
    currentPage = 1;
    displayArticles();
    updatePagination();
}

// Filter articles based on search term
function filterArticles(searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    
    filteredArticles = allArticles.filter(article => {
        const titleMatch = article.title && article.title.toLowerCase().includes(searchTermLower);
        const descMatch = article.description && article.description.toLowerCase().includes(searchTermLower);
        return titleMatch || descMatch;
    });
    
    currentPage = 1;
    displayArticles();
    updatePagination();
}

// Apply current search (used after loading new data)
function applyCurrentSearch() {
    const searchTerm = elements.searchInput.value.trim();
    
    if (searchTerm) {
        filterArticles(searchTerm);
    } else {
        filteredArticles = [...allArticles];
        displayArticles();
        updatePagination();
    }
}

// Display articles for current page
function displayArticles() {
    const articlesToShow = filteredArticles;
    
    if (articlesToShow.length === 0) {
        showNoResults();
        return;
    }
    
    hideAllStates();
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const pageArticles = articlesToShow.slice(startIndex, endIndex);
    
    // Update results count
    updateResultsCount(articlesToShow.length);
    
    // Render articles
    renderArticles(pageArticles);
    
    // Show pagination if needed
    if (articlesToShow.length > articlesPerPage) {
        elements.paginationContainer.style.display = 'flex';
        updatePagination();
    } else {
        elements.paginationContainer.style.display = 'none';
    }
}

// Render articles to DOM
function renderArticles(articles) {
    const searchTerm = elements.searchInput.value.trim().toLowerCase();
    
    elements.newsContainer.innerHTML = articles.map((article, index) => {
        const title = highlightSearchTerm(article.title || 'No title available', searchTerm);
        const description = highlightSearchTerm(article.description || 'No description available', searchTerm);
        const publishedAt = formatDate(article.publishedAt);
        const source = article.source?.name || 'Unknown source';
        const imageUrl = article.urlToImage || article.image;
        const articleId = `article-${index}`;
        
        const imageElement = imageUrl ? 
            `<img src="${imageUrl}" alt="${article.title || 'News article'}" class="article-image" loading="lazy" onclick="openLightbox('${imageUrl}', '${escapeHtml(article.title)}', '${escapeHtml(article.description)}')" />` :
            `<div class="article-placeholder" aria-hidden="true">
                <i class="fas fa-newspaper"></i>
            </div>`;
        
        return `
            <article class="news-article" id="${articleId}" style="animation-delay: ${index * 0.1}s">
                ${imageElement}
                <div class="article-content">
                    <h3 class="article-title">
                        <a href="${article.url || '#'}" target="_blank" rel="noopener noreferrer" aria-describedby="${articleId}-meta">
                            ${title}
                        </a>
                    </h3>
                    <p class="article-description">${description}</p>
                    <div class="article-meta" id="${articleId}-meta">
                        <span class="article-source" aria-label="Source: ${source}">${source}</span>
                        <span class="article-time" aria-label="Published: ${publishedAt}">${publishedAt}</span>
                    </div>
                    <div class="article-actions">
                        <button class="article-action" onclick="shareArticle('${escapeHtml(article.title)}', '${article.url}')" aria-label="Share this article">
                            <i class="fas fa-share" aria-hidden="true"></i>
                            Share
                        </button>
                        <button class="article-action" onclick="bookmarkArticle('${articleId}')" aria-label="Bookmark this article">
                            <i class="fas fa-bookmark" aria-hidden="true"></i>
                            Save
                        </button>
                        <button class="article-action" onclick="readLater('${articleId}')" aria-label="Read this article later">
                            <i class="fas fa-clock" aria-hidden="true"></i>
                            Read Later
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
    
    // Announce content change to screen readers
    announceToScreenReader(`Loaded ${articles.length} articles`);
    
    // Add intersection observer for lazy loading animations
    observeArticles();
}

// Highlight search terms in text
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Escape special regex characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        
        if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    } catch (error) {
        return 'Unknown date';
    }
}

// Update results count display
function updateResultsCount(count) {
    const searchTerm = elements.searchInput.value.trim();
    const totalText = count === 1 ? 'article' : 'articles';
    
    if (searchTerm) {
        elements.resultsCount.textContent = `Found ${count} ${totalText} matching "${searchTerm}"`;
    } else {
        elements.resultsCount.textContent = `Showing ${count} ${totalText}`;
    }
}

// Pagination functions
function changePage(newPage) {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayArticles();
        scrollToTop();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    elements.prevBtn.disabled = currentPage <= 1;
    elements.nextBtn.disabled = currentPage >= totalPages;
    elements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Show data source indicator
function showDataSourceIndicator(type) {
    if (!elements.dataSource || !elements.dataSourceText) return;
    
    elements.dataSource.style.display = 'flex';
    elements.dataSource.className = `data-source-indicator ${type}`;
    
    if (type === 'demo') {
        elements.dataSourceText.textContent = 'Demo Content';
        elements.dataSource.title = 'Showing sample news articles due to API limitations';
    } else if (type === 'live') {
        elements.dataSourceText.textContent = 'Live Data';
        elements.dataSource.title = 'Showing real-time news from Google News API';
    }
}

// Hide data source indicator
function hideDataSourceIndicator() {
    if (elements.dataSource) {
        elements.dataSource.style.display = 'none';
    }
}

// Utility functions
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Announce to screen readers
    announceToScreenReader('Scrolled to top of page');
}

function showLoading() {
    hideAllStates();
    hideDataSourceIndicator();
    elements.loadingSpinner.style.display = 'block';
    elements.refreshBtn.disabled = true;
    // Update ARIA live region
    elements.resultsCount.textContent = 'Loading articles...';
}

function hideLoading() {
    elements.loadingSpinner.style.display = 'none';
    elements.refreshBtn.disabled = false;
}

function showError(message) {
    hideAllStates();
    hideDataSourceIndicator();
    elements.errorText.textContent = message;
    elements.errorMessage.style.display = 'block';
    // Focus management for accessibility
    elements.retryBtn.focus();
    announceToScreenReader(`Error: ${message}`);
}

function showNoResults() {
    hideAllStates();
    hideDataSourceIndicator();
    elements.noResults.style.display = 'block';
    elements.resultsCount.textContent = 'No articles found';
    announceToScreenReader('No articles found');
}

function hideAllStates() {
    elements.loadingSpinner.style.display = 'none';
    elements.errorMessage.style.display = 'none';
    elements.noResults.style.display = 'none';
    elements.paginationContainer.style.display = 'none';
    elements.newsContainer.innerHTML = '';
}

// New utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function announceToScreenReader(message) {
    const announcer = document.getElementById('announcer');
    if (announcer) {
        announcer.textContent = message;
        // Clear after announcement
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}

function observeArticles() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.news-article').forEach(article => {
        article.style.animationPlayState = 'paused';
        observer.observe(article);
    });
}

// Feature functions
function toggleView() {
    currentView = currentView === 'grid' ? 'list' : 'grid';
    const icon = elements.viewToggle.querySelector('i');
    const text = elements.viewToggle.querySelector(':not(i)');
    
    if (currentView === 'list') {
        elements.newsContainer.classList.add('list-view');
        icon.className = 'fas fa-th';
        elements.viewToggle.lastChild.textContent = ' List View';
        elements.viewToggle.setAttribute('aria-label', 'Switch to grid view');
    } else {
        elements.newsContainer.classList.remove('list-view');
        icon.className = 'fas fa-th-large';
        elements.viewToggle.lastChild.textContent = ' Grid View';
        elements.viewToggle.setAttribute('aria-label', 'Switch to list view');
    }
    
    announceToScreenReader(`Switched to ${currentView} view`);
}

function handleSubscribe() {
    // Simulate subscription process
    const originalText = elements.subscribeBtn.innerHTML;
    elements.subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Subscribing...';
    elements.subscribeBtn.disabled = true;
    
    setTimeout(() => {
        elements.subscribeBtn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Subscribed!';
        announceToScreenReader('Successfully subscribed to updates');
        
        setTimeout(() => {
            elements.subscribeBtn.innerHTML = originalText;
            elements.subscribeBtn.disabled = false;
        }, 2000);
    }, 1500);
}

function handleExplore() {
    // Simulate category exploration
    announceToScreenReader('Opening category explorer');
    // This could open a modal or navigate to categories
    alert('Category explorer feature coming soon!');
}

function handleNewsletter() {
    // Simulate newsletter subscription
    const email = prompt('Enter your email address to subscribe to our newsletter:');
    if (email && isValidEmail(email)) {
        announceToScreenReader('Newsletter subscription successful');
        alert('Thank you for subscribing to our newsletter!');
    } else if (email) {
        announceToScreenReader('Invalid email address');
        alert('Please enter a valid email address.');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Article interaction functions
function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).then(() => {
            announceToScreenReader('Article shared successfully');
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(title, url);
        });
    } else {
        fallbackShare(title, url);
    }
}

function fallbackShare(title, url) {
    // Copy to clipboard as fallback
    navigator.clipboard.writeText(`${title} - ${url}`).then(() => {
        announceToScreenReader('Article link copied to clipboard');
        showToast('Article link copied to clipboard!');
    }).catch(() => {
        announceToScreenReader('Unable to share article');
        showToast('Unable to share article');
    });
}

function bookmarkArticle(articleId) {
    const article = document.getElementById(articleId);
    const bookmarkBtn = article.querySelector('.article-action[onclick*="bookmark"]');
    const icon = bookmarkBtn.querySelector('i');
    
    // Toggle bookmark state
    if (icon.classList.contains('fas')) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        bookmarkBtn.lastChild.textContent = ' Saved';
        announceToScreenReader('Article bookmarked');
        showToast('Article saved to bookmarks');
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        bookmarkBtn.lastChild.textContent = ' Save';
        announceToScreenReader('Article removed from bookmarks');
        showToast('Article removed from bookmarks');
    }
}

function readLater(articleId) {
    announceToScreenReader('Article added to read later list');
    showToast('Article added to read later list');
    
    // Could integrate with reading list storage
    const readLaterList = JSON.parse(localStorage.getItem('readLater') || '[]');
    const article = document.getElementById(articleId);
    const title = article.querySelector('.article-title a').textContent;
    const url = article.querySelector('.article-title a').href;
    
    readLaterList.push({ title, url, addedAt: new Date().toISOString() });
    localStorage.setItem('readLater', JSON.stringify(readLaterList));
}

function showToast(message) {
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: var(--primary-navy);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        opacity: 0;
        transform: translateY(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Lightbox functions
function openLightbox(imageUrl, title, description) {
    elements.lightboxImage.src = imageUrl;
    elements.lightboxImage.alt = title;
    elements.lightboxTitle.textContent = title;
    elements.lightboxDescription.textContent = description;
    elements.lightboxModal.style.display = 'flex';
    
    // Focus management
    elements.lightboxClose.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    announceToScreenReader('Image lightbox opened');
}

function closeLightbox() {
    elements.lightboxModal.style.display = 'none';
    document.body.style.overflow = '';
    announceToScreenReader('Image lightbox closed');
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    // ESC key - close lightbox
    if (e.key === 'Escape') {
        if (elements.lightboxModal.style.display !== 'none') {
            closeLightbox();
        }
        // Close dropdowns
        document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Arrow keys for pagination
    if (e.key === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    }
    
    if (e.key === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    }
    
    // Ctrl+R for refresh
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        loadNews();
    }
    
    // Focus search with Ctrl+F
    if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        elements.searchInput.focus();
    }
}

// Error message generation
function getErrorMessage(error) {
    if (error.message.includes('Rate limit exceeded') || error.message.includes('Too many requests')) {
        return 'API rate limit reached. Using comprehensive demo content with full functionality.';
    } else if (error.message.includes('timeout') || error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'Unable to connect to news services. Showing demo content with all features available.';
    } else if (error.message.includes('401') || error.message.includes('Invalid API key')) {
        return 'API key configuration needed. Demo mode provides full website functionality.';
    } else if (error.message.includes('403') || error.message.includes('Access denied')) {
        return 'API access limited. Enhanced demo content available with complete features.';
    } else if (error.message.includes('500')) {
        return 'News services temporarily unavailable. Full-featured demo mode active.';
    } else {
        return 'Loading enhanced demo content - All website features fully functional!';
    }
}

// Custom news generator for dynamic content
function generateCustomNews() {
    const businessTopics = [
        'Technology', 'Finance', 'Manufacturing', 'Retail', 'Energy', 
        'Healthcare', 'Real Estate', 'Transportation', 'Agriculture', 'Tourism'
    ];
    
    const newsTemplates = [
        {
            template: "{company} Reports {metric} Growth in {sector} Division",
            description: "The company's {sector} segment showed strong performance with {detail} contributing to overall growth trajectory."
        },
        {
            template: "{sector} Industry Sees {trend} in {timeframe}",
            description: "Industry analysts report {detail} across major {sector} companies, indicating {trend_detail}."
        },
        {
            template: "New {technology} Implementation Boosts {sector} Efficiency",
            description: "Recent adoption of {technology} solutions has resulted in {detail} for companies in the {sector} sector."
        }
    ];
    
    const companies = ['Microsoft', 'Apple', 'Google', 'Amazon', 'Tesla', 'Meta', 'Netflix', 'Adobe'];
    const metrics = ['25% Revenue', '30% Profit', '40% Market Share', '20% User', '35% Sales'];
    const trends = ['Significant Innovation', 'Market Expansion', 'Digital Transformation', 'Sustainability Initiatives'];
    const technologies = ['AI', 'Cloud Computing', 'Blockchain', 'IoT', 'Machine Learning', '5G'];
    
    // Generate dynamic news articles
    const generatedArticles = [];
    
    for (let i = 0; i < 6; i++) {
        const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
        const topic = businessTopics[Math.floor(Math.random() * businessTopics.length)];
        const company = companies[Math.floor(Math.random() * companies.length)];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const trend = trends[Math.floor(Math.random() * trends.length)];
        const tech = technologies[Math.floor(Math.random() * technologies.length)];
        
        const title = template.template
            .replace('{company}', company)
            .replace('{metric}', metric)
            .replace('{sector}', topic)
            .replace('{trend}', trend)
            .replace('{timeframe}', 'Q4 2024')
            .replace('{technology}', tech);
            
        const description = template.description
            .replace('{sector}', topic.toLowerCase())
            .replace('{detail}', 'improved operational efficiency and market positioning')
            .replace('{technology}', tech.toLowerCase())
            .replace('{trend_detail}', 'positive market sentiment and investor confidence');
        
        generatedArticles.push({
            title: title,
            description: description,
            url: "#",
            urlToImage: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400`,
            publishedAt: new Date(Date.now() - (i + 1) * 2 * 60 * 60 * 1000).toISOString(),
            source: { name: `${topic} Business Daily` },
            author: "Business News Team"
        });
    }
    
    return {
        articles: [...MOCK_NEWS_DATA.articles, ...generatedArticles]
    };
}

// Auto-refresh functionality (optional)
function startAutoRefresh(intervalMinutes = 30) {
    setInterval(() => {
        if (!isLoading && document.visibilityState === 'visible') {
            loadNews();
        }
    }, intervalMinutes * 60 * 1000);
}

// Start auto-refresh when page becomes visible
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && allArticles.length === 0) {
        loadNews();
    }
});

// Handle offline/online events
window.addEventListener('online', function() {
    if (allArticles.length === 0) {
        loadNews();
    }
});

window.addEventListener('offline', function() {
    showError('You are currently offline. Please check your internet connection.');
});

// Initialize auto-refresh (uncomment to enable)
// startAutoRefresh(30); // Refresh every 30 minutes