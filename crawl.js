const normalizeUrl = function normalizeUrl(inputUrl) {
    if (!(typeof inputUrl === 'string')) return '';
    return decodeURIComponent(inputUrl)
        .trim()
        .replace(/^https?:\/\//i, '')
        .replace(/#.*/, '')
        .replace(/\?.*/, '')
        .replace(/\/+$/, '')
        .toLocaleLowerCase();
};

module.exports = { normalizeUrl };

