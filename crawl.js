const normalizeUrl = function normalizeUrl(inputUrl) {
    return inputUrl.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
};

module.exports = { normalizeUrl };

