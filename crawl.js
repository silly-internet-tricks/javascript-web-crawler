const { JSDOM } = require("jsdom");

const fetchHtml = function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(`got error code: ${response.status}`);
        }

        if (
          !response.headers
            .get("content-type")
            .toLocaleLowerCase()
            .startsWith("text/html")
        ) {
          throw new Error(
            `got unsupported content type: ${response.headers.get("content-type")}`,
          );
        }

        return response.text();
      })
      .then((pageText) => {
        resolve(pageText);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const pages = {};

const crawlPage = function crawlPage(baseUrl, currentUrl = baseUrl) {
  return new Promise((resolve, reject) => {
    if (getDomainPartFromUrl(baseUrl) !== getDomainPartFromUrl(currentUrl)) {
      resolve();
    } else {
      const normalizedCurrentUrl = normalizeUrl(currentUrl);
      if (normalizedCurrentUrl in pages) {
        pages[normalizedCurrentUrl]++;
        resolve();
      } else {
        pages[normalizedCurrentUrl] = 1;
        console.log(JSON.stringify(pages));
        fetchHtml('https://' + normalizedCurrentUrl)
          .then((pageText) => {
            const urls = getUrlsFromHtml(pageText, baseUrl);
            Promise.all(
              urls.map((url) => {
                return crawlPage(baseUrl, url);
              }),
            ).then(() => {
              resolve();
            });
          })
          .catch((error) => {
            console.log(error.message);
            reject(error);
          });
      }
    }
  });
};

const getDomainPartFromUrl = function getDomainPartFromUrl(url) {
  const domainMatch = url.match(/^(.*?[^\/])\/[^\/]/);
  const domainPart = domainMatch ? domainMatch[1] : url;
  return domainPart;
};

const getUrlsFromHtml = function getUrlsFromHtml(htmlBody, baseUrl) {
  if (!baseUrl) throw 'base url is required!';
  const dom = new JSDOM(htmlBody);
  const nodes = dom.window.document.querySelectorAll("a");
  const hrefs = [...nodes].map((node) => node.href);
  const absoluteUrls = hrefs.map((href) => {
    if (!href.match(/^(https?:)?\/\//i)) {
      if (href.match(/^about:blank#/i)) return baseUrl;
      if (href.match(/^\/[^\/]/)) {
        const domainPart = getDomainPartFromUrl(baseUrl);
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

module.exports = { normalizeUrl, getUrlsFromHtml, crawlPage, pages, getDomainPartFromUrl };
