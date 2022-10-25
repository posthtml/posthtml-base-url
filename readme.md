<div align="center">
  <img width="150" height="150" alt="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>Base URL</h1>
  <p>Prepend a string to source paths in your HTML</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## Introduction

This PostHTML plugin can prepend a string to various HTML attribute values and CSS property values.

Input:

```html
<img src="test.jpg">
```

Output:

```html
<img src="https://example.com/test.jpg">
```

Works on the following attributes:

- `src=""`
- `href=""`
- `srcset=""`
- `poster=""`
- `background=""`

... and the following CSS properties:

- `background: url()`
- `background-image: url()`
- `@font-face { src: url() }`

Both `<style>` tags and `style=""` attributes are supported.

CSS property values with multiple `url()` sources are supported as well.

## Install

```
$ npm i posthtml posthtml-base-url
```

## Usage

```js
const posthtml = require('posthtml')
const baseUrl = require('posthtml-base-url')

posthtml([
  baseUrl({
    url: 'https://example.com', 
    tags: ['img']
  })
])
  .process('<img src="test.jpg">')
  .then(result => console.log(result.html))
```

Result:

```html
<img src="https://example.com/test.jpg">
```

## Absolute URLs

If the value to be replaced is an URL, the plugin will not modify it.

## Options

You can configure what to prepend to which attribute values.

### `url`

Type: `string`\
Default: `''`

The string to prepend to the attribute value.

### `allTags`

Type: `boolean`\
Default: `false`

The plugin is opt-in, meaning that by default it doesn't affect any tag.

When you set `allTags` to `true`, the plugin will prepend your `url` to all attribute values in all the tags that it supports.

### `styleTag`

Type: `boolean`\
Default: `false`

When set to `true`, the plugin will prepend your `url` to all `url()` sources in `<style>` tags.

### `inlineCss`

Type: `boolean`\
Default: `false`

When set to `true`, the plugin will prepend your `url` to all `url()` sources in `style=""` attributes.

### `tags`

Type: `array|object`\
Default: [defaultTags](./lib/index.js) (object)

Define a list of tags and their attributes to handle.

When using the `tags` option, the plugin will _only handle those tags_.

#### Array `tags`

To replace all known attributes for a list of tags, use the array format:

```js
posthtml([
  baseUrl({
    tags: ['img', 'script'],
  })
])
  .process(
    `<a href="foo/bar.html">
      <img src="img.jpg" srcset="img-HD.jpg 2x,img-xs.jpg 100w">
    </a>
    
    <script src="javascript.js"></script>`
  )
  .then(result => console.log(result.html))
```

Result:

```html
<a href="foo/bar.html">
  <img src="https://example.com/image1.jpg" srcset="https://example.com/image1-HD.jpg 2x, https://example.com/image1-phone.jpg 100w">
</a>

<script src="https://example.com/javascript.js"></script>
```

#### Object `tags`

You may use an object for granular control over how specific attributes should be handled:

```js
posthtml([
  baseUrl({
    url: 'https://foo.com/',
    tags: {
      img: {
        src: true,
        srcset: 'https://bar.com/',
      },
    },
  })
])
  .process(
    `<a href="foo/bar.html">
      <img src="img.jpg" srcset="img-HD.jpg 2x, img-xs.jpg 100w">
    </a>`
  )
  .then(result => console.log(result.html))
```

Result:

```html
<a href="foo/bar.html">
  <img src="https://foo.com/image1.jpg" srcset="https://bar.com/img-HD.jpg 2x, https://bar.com/img-xs.jpg 100w">
</a>
```

You may set the value of an attribute to `true` and the plugin will use the `url` option value - we did that above for the `src` attribute.

### `attributes`

Type: `object`\
Default: `{}`

Key-value pairs of attributes and what to prepend to them.

Example:

```js
posthtml([
  baseUrl({
    attributes: {
      'data-url': 'https://example.com/',
    }
  })
])
  .process('<div data-url="foo/bar.html"></div>')
  .then(result => console.log(result.html))
```

Result:

```html
<div data-url="https://example.com/foo/bar.html"></div>
```

[npm]: https://www.npmjs.com/package/posthtml-base-url
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-base-url.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-base-url
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-base-url.svg
[github-ci]: https://github.com/posthtml/posthtml-base-url/actions/workflows/nodejs.yml
[github-ci-shield]: https://github.com/posthtml/posthtml-base-url/actions/workflows/nodejs.yml/badge.svg
[license]: ./license
[license-shield]: https://img.shields.io/npm/l/posthtml-base-url.svg
