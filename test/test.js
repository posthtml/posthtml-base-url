const test = require('ava')
const posthtml = require('posthtml')
const plugin = require('../lib/index.js')

const path = require('path')
const {readFileSync} = require('fs')

// eslint-disable-next-line
const error = (name, options, cb) => posthtml([plugin(options)]).process(fixture(name)).catch(cb)
const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const fixture = file => readFileSync(path.join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(path.join(__dirname, 'expected', `${file}.html`), 'utf8')

const process = (t, name, options, log = false) => {
  options = options || {url: 'https://example.com/'}

  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => t.is(html, expected(name).trim()))
}

test('does nothing if `url` was not provided', t => {
  return process(t, 'no-url', {})
})

test('does nothing if `url` is not a string', t => {
  return process(t, 'no-url', {url: true})
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
    url: 'https://example.com/',
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

test('background css url', t => {
  return process(t, 'background-css', {
    url: 'https://example.com/',
    styleTag: true,
    inlineCss: true,
  })
})

test('applies only to user-defined tags', t => {
  return process(t, 'user-tags', {
    tags: {
      img: {
        src: 'https://example.com/',
        srcset: 'https://example2.com/',
      },
    },
  })
})
