const shortUrl = require('node-url-shortener');

// Long URL to be shortened
const longUrl = 'https://surveyheart.com/form/65c4b563a7b8b4495f54c658';

// Shorten the URL
shortUrl.short(longUrl, function (err, url) {
    if (err) {
        console.error('Error shortening URL:', err);
        return;
    }

    console.log('Shortened URL:', url);
});
