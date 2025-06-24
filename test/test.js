import path from 'node:path'
import posthtml from 'posthtml'
import plugin from '../lib/index.js'
import { test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fixture = file => readFileSync(path.join(__dirname, 'fixtures', `${file}.html`), 'utf8').trim()
const expected = file => readFileSync(path.join(__dirname, 'expected', `${file}.html`), 'utf8').trim()

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (_t, name, options = {}, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => expect(html).toEqual(expected(name)))
}

test('skip if `url` was not provided', t => {
  return process(t, 'no-url', {})
})

test('skip if `url` is not a string', t => {
  return process(t, 'no-url', {url: true})
})

test('skip if `options.tags` is invalid', t => {
  return process(t, 'no-url', {
    url: 'https://example.com',
    tags: true,
  })
})

test('skips absolute urls', t => {
  return process(t, 'absolute-urls')
})

test('src attribute', t => {
  return process(t, 'src', {
    url: 'https://example.com/',
    allTags: true,
  })
})

test('srcset attribute', t => {
  return process(t, 'srcset', {
    url: 'images',
    allTags: true,
  })
})

test('poster attribute', t => {
  return process(t, 'poster', {
    url: 'https://example.com/',
    allTags: true,
  })
})

test('background attribute', t => {
  return process(t, 'background', {
    url: 'https://example.com/',
    allTags: true,
  })
})

test('href attribute', t => {
  return process(t, 'href', {
    url: 'https://example.com/',
    allTags: true,
  })
})

test('custom attribute', t => {
  return process(t, 'custom-attribute', {
    attributes: {
      'data-url': 'https://example.com/',
    },
  })
})

test('css urls', t => {
  return process(t, 'css-url', {
    url: 'https://example.com/',
    styleTag: true,
    inlineCss: true,
  })
})

test('user-defined tags (object)', t => {
  return process(t, 'user-tags', {
    url: 'https://example.com/',
    tags: {
      img: {
        src: true,
        srcset: 'https://example.com/',
      },
      script: {
        src: 'https://example.com/',
      },
    },
  })
})

test('user-defined tags (array)', t => {
  return process(t, 'user-tags', {
    url: 'https://example.com/',
    tags: ['img', 'script'],
  })
})

test('joins relative paths', t => {
  return process(t, 'joins', {
    url: 'images',
    tags: {
      img: {
        src: true,
      },
      script: {
        src: 'assets',
      },
    },
  })
})

test('joins bg url paths', t => {
  return process(t, 'bg-paths', {
    url: 'relative',
    styleTag: true,
    inlineCss: true,
  })
})
