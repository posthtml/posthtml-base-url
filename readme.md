<div align="center">
  <img width="150" height="150" alt="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>Base URL</h1>
  <p>Prepend a base string to HTML attribute values</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## Introduction

This PostHTML plugin can prepend a string to various attribute values and CSS styles.

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

For CSS, it works both inside `<style>` tags and with inline CSS found in `style=""` attributes.

## Install

```
$ npm i posthtml posthtml-base-url
```

## Usage

```js
const posthtml = require('posthtml')
const baseUrl = require('posthtml-base-url')

posthtml([
  baseUrl()
])
  .process('<img src="test.jpg">', {url: 'https://example.com', allTags: true})
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

When set to `true`, the plugin will prepend your `url` to `background: url(...)` and `background-image: url(...)` CSS properties in all `<style>` tags.

### `inlineCss`

Type: `boolean`\
Default: `false`

When set to `true`, the plugin will prepend your `url` to `background: url(...)` and `background-image: url(...)` CSS properties in all `style=""` attributes.

### `tags`

Type: `object`\
Default: `{/*object with select tags to handle*/}`

An object that defines tags and their attributes to handle.

When you define tags to handle with the `tags` option, the plugin will _only handle those tags_.

For example, the `<a>` tag here is not prepended to:

```js
posthtml([
  baseUrl()
])
  .process(
    `<a href="foo/bar.html">
      <img src="img.jpg" srcset="img-HD.jpg 2x,img-xs.jpg 100w">
    </a>`, 
    {
      tags: {
        img: {
          src: 'https://foo.com/',
          srcset: 'https://bar.com/',
        },
      },
    }
  )
  .then(result => console.log(result.html))
```

Result:

```html
<a href="foo/bar.html">
  <img src="https://foo.com/image1.jpg" srcset="https://bar.com/img-HD.jpg 2x, https://bar.com/img-xs.jpg 100w">
</a>
```

### `attributes`

Type: `object`\
Default: `{}`

Key-value pairs of attributes and what to prepend to them.

Example:

```js
posthtml([
  baseUrl()
])
  .process(
    '<div data-url="foo/bar.html"></div>', 
    {
      attributes: {
        'data-url': 'https://example.com/',
      }
    }
  )
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
