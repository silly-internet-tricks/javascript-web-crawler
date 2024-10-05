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

