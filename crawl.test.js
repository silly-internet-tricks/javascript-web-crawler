const { test, expect } = require('@jest/globals');

const { normalizeUrl, getUrlsFromHtml } = require('./crawl.js');

const sum = (a,b) => a + b;

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('normalizes urls', () => {
    const urls = [
        'https://blog.boot.dev/path/',
        'https://blog.boot.dev/path',
        'http://blog.boot.dev/path/',
        'http://blog.boot.dev/path',
    ];

    urls.forEach((url) => {
        expect(normalizeUrl(url)).toBe('blog.boot.dev/path');
    });
});

test('normalizes urls with uppercase', () => {
    const urls = [
        'BLOG.BOOT.DEV',
        'Blog.Boot.Dev/',
        'bLoG.bOoT.dev',
    ];

    urls.forEach((url) => {
        expect(normalizeUrl(url)).toBe('blog.boot.dev');
    });
});

test('normalizes urls with fragments and query strings', () => {
    const urls = [
        'boot.dev/path/to/resource#heading',
        'boot.dev/path/to/resource#heading-with-dashes',
        'boot.dev/path/to/resource#heading?query=hello',
        'boot.dev/path/to/resource?query=before-fragment#heading',
        'boot.dev/path/to/resource?heading=idk',
        'boot.dev/path/to/reSource?heading=first,footer=second,body=third',
        'boot.dev/path/to/reSource?heading=first&footer=second&body=third',
        'boot.dev/path/to/resource?heading=first,footer=second,body=third#hash-fragment',
        'boot.dev/path/to/resource?heading=first&footer=second&body=third#hash-fragment',
    ];

    urls.forEach((url) => {
        expect(normalizeUrl(url)).toBe('boot.dev/path/to/resource');
    });
});

test('normalizes urls with space padding', () => {
    const urls = [
        'boot.dev        ',
        '  boot.dev/',
        '     https://boot.dev    ',
    ];

    urls.forEach((url) => {
        expect(normalizeUrl(url)).toBe('boot.dev');
    });
});

test('normalizes urls which have uriencoded chars', () => {
    const urls = [
        'https://blog.boo%20oot.dev',
        // for now I am going to say that this url should be decoded first, and then the https:// should be discarded
        'https%3A%2F%2Fblog.boo%20oot.dev',
    ];

    urls.forEach((url) => {
        expect(normalizeUrl(url)).toBe('blog.boo oot.dev');
    });
});

test('normalize url does not choke on obvious bad inputs', () => {
    const urls = [
        {},
        [],
        '',
        undefined,
        null,
        true,
        false,
        0,
        1,
    ];

    urls.forEach((url) => {
        expect(normalizeUrl(url)).toBe('');
    });
});

const htmlTestBody = `
  <html>
    <body>
        <p id="anchor-only">top of body</p>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        <a href="/relative/url">hi</a>
        <a href="//google.com">scheme relative url</a>
        <a href="some/other/resource">sub resource</a>
        <a href="../sibling/resource">back up the directory tree</a>
        <a href="#anchor-only">anchor only</a>
        <a href="../../cousin/resource">further back up the directory tree</a>
    </body>
</html>
`;

test('relative URLs are converted to absolute URLs', () => {
    const results = getUrlsFromHtml(htmlTestBody, 'blog.boot.dev/path/to/current-page')
    // NOTE: I did not include the protocol on the front of the base url.
    // I don't think it's necessary but I'm not positive

    const expected = [
        // JSDOM put a trailing slash at the end of the domain. Not sure why, but I am putting it here as well for now.
        'https://blog.boot.dev/',
        'blog.boot.dev/relative/url',
        '//google.com',
        'blog.boot.dev/path/to/current-page/some/other/resource',
        'blog.boot.dev/path/to/sibling/resource',
        'blog.boot.dev/path/to/current-page',
        'blog.boot.dev/path/cousin/resource',
    ];

    expect(results.length).toBe(expected.length);
    expect(results).toEqual(expected);
});

