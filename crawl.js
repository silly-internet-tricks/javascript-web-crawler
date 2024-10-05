const { JSDOM } = require("jsdom");

const getUrlsFromHtml = function getUrlsFromHtml(htmlBody, baseUrl) {
  const dom = new JSDOM(htmlBody);
  const nodes = dom.window.document.querySelectorAll("a");
  const hrefs = [...nodes].map((node) => node.href);
  const absoluteUrls = hrefs.map((href) => {
    if (!href.match(/^(https?:)?\/\//i)) {
      if (href.match(/^about:blank#/i)) return baseUrl;
      if (href.match(/^\/[^\/]/)) {
        const domainMatch = baseUrl.match(/^(.*?)\/[^\/]/);
        const domainPart = domainMatch ? domainMatch[1] : baseUrl;
        return `${domainPart}${href}`;
      }

      if (href.match(/^\.\.\//)) {
        let baseUrlPartial = baseUrl;
        // for now I am only considering the case where .. is followed directly by slash
        // I am not sure yet what to do if .. is followed by anything else
        while (href.match(/^\.\.\//)) {
          href = href.replace(/^\.\.\//, "");
          baseUrlPartial = baseUrlPartial.replace(/\/[^\/]*$/, "");
        }

        return `${baseUrlPartial}/${href}`;
      }

      return `${baseUrl}/${href}`;
    }
    return href;
  });
  return absoluteUrls;
};

const normalizeUrl = function normalizeUrl(inputUrl) {
  if (!(typeof inputUrl === "string")) return "";
  return decodeURIComponent(inputUrl)
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/#.*/, "")
    .replace(/\?.*/, "")
    .replace(/\/+$/, "")
    .toLocaleLowerCase();
};

module.exports = { normalizeUrl, getUrlsFromHtml };
