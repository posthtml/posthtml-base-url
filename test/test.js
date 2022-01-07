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

test('does nothing if url is not provided', t => {
  return process(t, 'no-url', {})
})

test('does nothing if url is not a string', t => {
  return process(t, 'no-url', {url: true})
})

