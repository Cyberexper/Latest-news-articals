# Business News Hub

A modern, responsive news website that displays the latest business news headlines using the Google News API.

## Features

- **Latest Business News**: Fetches and displays current business headlines from Google News
- **Demo Content Fallback**: Automatically switches to sample news when API limits are reached
- **Smart Rate Limiting**: Prevents excessive API calls to avoid rate limiting
- **Search Functionality**: Filter articles by keywords in real-time
- **Pagination**: Navigate through articles with smooth pagination
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Error Handling**: Graceful handling of API failures and network issues
- **Modern UI**: Clean, professional interface with smooth animations
- **Accessibility**: Full WCAG compliance with keyboard navigation
- **Image Lightbox**: View article images in an elegant lightbox
- **Social Features**: Share, bookmark, and save articles for later

## Technologies Used

- HTML5
- CSS3 (with modern features like Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Google News API via RapidAPI
- Font Awesome icons
- Google Fonts (Inter)

## Setup Instructions

1. **Choose Your News API** (Optional - works without any API):
   
   **Option A: NewsAPI.org (Recommended)**
   - Visit [newsapi.org](https://newsapi.org) and create free account
   - Copy your API key
   - Open `script.js` and replace `'your_newsapi_key_here'` with your key
   
   **Option B: The Guardian (Free)**
   - Visit [open-platform.theguardian.com](https://open-platform.theguardian.com)
   - Register for free API key
   - Replace the test key in `ALTERNATIVE_APIS.guardian.params['api-key']`
   
   **Option C: New York Times (Free Tier)**
   - Visit [developer.nytimes.com](https://developer.nytimes.com)
   - Get free API key
   - Replace `'your_nyt_key_here'` in the NYTimes configuration

2. **Run the Website**:
   - Open `index.html` in a modern web browser
   - Or serve using a local web server for better CORS handling
   - **No API required**: Full demo mode with 18+ articles and dynamic content

3. **Features Available Without API**:
   - ✅ 18+ realistic business news articles
   - ✅ Dynamic news generation system
   - ✅ Full search and filtering
   - ✅ Complete pagination
   - ✅ All interactive features
   - ✅ Image lightbox and social features

## File Structure

```
hchc/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## API Configuration

The application supports multiple news API sources for better reliability:

### Primary API Sources:

1. **NewsAPI.org (Recommended)**
   - **Endpoint**: `https://newsapi.org/v2/top-headlines`
   - **Setup**: Get free API key from [newsapi.org](https://newsapi.org)
   - **Parameters**: `country=us`, `category=business`, `pageSize=50`

2. **The Guardian API**
   - **Endpoint**: `https://content.guardianapis.com/search`
   - **Setup**: Free test key available, or get key from [open-platform.theguardian.com](https://open-platform.theguardian.com)
   - **Parameters**: `section=business`, `show-fields=thumbnail,headline,bodyText`

3. **New York Times API**
   - **Endpoint**: `https://api.nytimes.com/svc/topstories/v2/business.json`
   - **Setup**: Get free API key from [developer.nytimes.com](https://developer.nytimes.com)

### Fallback System:
- **Enhanced Demo Content**: 18+ realistic business news articles
- **Dynamic News Generator**: Creates additional contextual business news
- **Full Functionality**: All website features work with demo content

## Features in Detail

### Search Functionality
- Real-time search as you type
- Searches both article titles and descriptions
- Highlights matching terms in results
- Clear search button for easy reset

### Pagination
- Shows 12 articles per page
- Previous/Next navigation
- Page counter display
- Smooth scrolling to top when changing pages

### Error Handling
- Network connectivity issues
- API rate limiting
- Invalid API responses
- Offline detection
- User-friendly error messages with retry options

### Responsive Design
- Mobile-first approach
- Flexible grid layout
- Optimized for screens from 320px to 1200px+
- Touch-friendly navigation

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Features

- Efficient article filtering
- Lazy loading animations
- Optimized API calls
- Minimal DOM manipulation

## Future Enhancements

- Category selection (Technology, Sports, etc.)
- Date range filtering
- Article bookmarking
- Social media sharing
- Dark mode toggle
- Auto-refresh functionality

## Troubleshooting

### Common Issues

1. **No API key needed**:
   - The website works perfectly without any API configuration
   - Enhanced demo content provides full functionality
   - 18+ realistic articles with dynamic content generation

2. **API key errors (if using live APIs)**:
   - NewsAPI: Verify key from newsapi.org
   - Guardian: Check key from open-platform.theguardian.com
   - NYTimes: Ensure key from developer.nytimes.com is correct

3. **CORS errors**:
   - Serve files through a local web server
   - Use Live Server extension in VS Code
   - Demo content works without any server setup

4. **No articles loading**:
   - Website automatically falls back to enhanced demo content
   - Check data source indicator (green=live, yellow=demo)
   - All features work identically in both modes

5. **Search and features not working**:
   - Ensure JavaScript is enabled
   - Check browser console for errors
   - Try refreshing the page

## License

This project is created for educational purposes. Please respect the Google News API terms of service.

## Author

Built by SUMAN SHARMA