const Vibrant = require('node-vibrant/node');

const extractColors = async (imageUrls) => {
    const palette = new Set();

    for (const url of imageUrls) {
        try {
            const v = new Vibrant(url);
            const p = await v.getPalette();

            if (p.Vibrant) palette.add(p.Vibrant.getHex());
            if (p.Muted) palette.add(p.Muted.getHex());
            if (p.DarkVibrant) palette.add(p.DarkVibrant.getHex());

            if (palette.size >= 5) break;
        } catch (error) {
            console.error(`Error extracting colors from ${url}:`, error.message);
        }
    }

    return Array.from(palette);
};

module.exports = { extractColors };
