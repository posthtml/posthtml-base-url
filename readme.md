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

Works on the following:

- `href=""`
- `poster=""`
- `<img src="">`
- `background=""`
- `<img srcset="">`
- `background: url()`
- `<source srcset="">`
- `background-image: url()`

For CSS styles, it works in both the `<style>` tag and with inline CSS found in `style=""` attributes.

## Install

```
$ npm i posthtml posthtml-base-url
```

## Usage

Provide clear code samples showing how to use the plugin: 

```js
const posthtml = require('posthtml')
const baseUrl = require('posthtml-base-url')

posthtml([
  baseUrl()
])
  .process('<img src="test.jpg">', {url: 'https://example.com'})
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

### `tags`

Type: `object`\
Default: `{/*object with select tags to handle*/}`

An object that defines tags and their attributes to handle.

Covers all of the tags in the HTML specification that could reference a path/URL, so you shouldn't need to change it unless new tags are added.

For example:

```js
posthtml([
  baseUrl()
])
  .process(
    '<a href="foo/bar.html"></a>', 
    {
      url: 'https://example.com',
      tags: {
        a: {
          href: true,
        },
      }
    }
  )
  .then(result => console.log(result.html))
```

Result:

```html
<a href="https://example.com/foo/bar.html"></a>
```

### `forceTags`

Type: `boolean`\
Default: `false`

Set to `true` to force the plugin to handle _only_ the tags that you've specified.

For example, maybe you need to prepend a base URL to `<img>` tags, but not `<a>` tags:

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
      forceTags: true,
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

If you set it to `true` and didn't specify any tags, it won't do anything.

[npm]: https://www.npmjs.com/package/posthtml-base-url
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-base-url.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-base-url
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-base-url.svg
[github-ci]: https://github.com/posthtml/posthtml-base-url/actions/workflows/nodejs.yml
[github-ci-shield]: https://github.com/posthtml/posthtml-base-url/actions/workflows/nodejs.yml/badge.svg
[license]: ./license
[license-shield]: https://img.shields.io/npm/l/posthtml-base-url.svg
