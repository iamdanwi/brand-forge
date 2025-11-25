const cheerio = require('cheerio');
const axios = require('axios');

const scrapeWebsite = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const textContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000); // Limit text length
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const title = $('title').text();

        // Extract image URLs for color analysis
        const images = [];
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            if (src && (src.startsWith('http') || src.startsWith('//'))) {
                images.push(src.startsWith('//') ? `https:${src}` : src);
            }
        });

        return {
            title,
            metaDescription,
            textContent,
            images: images.slice(0, 5), // Limit to 5 images for analysis
        };
    } catch (error) {
        console.error('Error scraping website:', error.message);
        throw new Error('Failed to scrape website');
    }
};

module.exports = { scrapeWebsite };
