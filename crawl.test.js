const { test, expect } = require('@jest/globals');

const { normalizeUrl } = require('./crawl.js');

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

