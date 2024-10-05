const normalizeUrl = function normalizeUrl(inputUrl) {
    return inputUrl.replace(/^https?:\/\//i, '').replace(/\/+$/, '').toLocaleLowerCase();
};

module.exports = { normalizeUrl };

