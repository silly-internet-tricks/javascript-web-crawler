const normalizeUrl = function normalizeUrl(inputUrl) {
    return inputUrl.trim()
        .replace(/^https?:\/\//i, '')
        .replace(/#.*/, '')
        .replace(/\?.*/, '')
        .replace(/\/+$/, '')
        .toLocaleLowerCase();
};

module.exports = { normalizeUrl };

