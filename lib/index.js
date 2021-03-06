const srcset = require('srcset')
const postcss = require('postcss')
const merge = require('lodash.merge')
const isUrl = require('is-url-superb')
const postcssBaseUrl = require('./plugins/postcss-baseurl.js')

module.exports = (options = {}) => tree => {
  options.url = options.url || ''
  options.attributes = options.attributes || {}
  options.allTags = options.allTags || false
  options.styleTag = options.styleTag || false
  options.inlineCss = options.inlineCss || false
  options.tags = options.allTags ? merge({
    a: {
      href: true,
    },
    area: {
      href: true,
    },
    audio: {
      src: true,
    },
    base: {
      href: true,
    },
    body: {
      background: true,
    },
    embed: {
      src: true,
    },
    iframe: {
      src: true,
    },
    img: {
      src: true,
      srcset: true,
    },
    input: {
      src: true,
    },
    link: {
      href: true,
    },
    script: {
      src: true,
    },
    source: {
      src: true,
      srcset: true,
    },
    table: {
      background: true,
    },
    td: {
      background: true,
    },
    th: {
      background: true,
    },
    track: {
      src: true,
    },
    video: {
      poster: true,
    },
  }, options.tags) : options.tags || {}

  const process = node => {
    // Skip if `url` was not provided
    if (options.url && (typeof options.url !== 'string' || options.url === '')) {
      return node
    }

    // Handle embedded stylesheets
    if (node.tag === 'style' && node.content && options.styleTag) {
      node.content = postcss([
        postcssBaseUrl({
          base: options.url,
        })
      ])
        .process(node.content.join('').trim())
        .css
    }

    // Handle style attribute
    if (node.attrs && node.attrs.style && options.inlineCss) {
      node.attrs.style = prependUrl(node.attrs.style, options.url)
    }

    // Handle defined HTML attributes
    Object.entries(options.attributes).forEach(([attribute, value]) => {
      if (node.attrs && node.attrs[attribute]) {
        handleSingleValueAttributes(node, attribute, value)
      }
    })

    // Handle defined HTML tags
    Object.entries(options.tags).forEach(([tag, attributes]) => {
      if (node.tag !== tag) {
        return node
      }

      // Handle tag attributes
      Object.entries(attributes).forEach(([attribute, value]) => {
        if (node.attrs && node.attrs[attribute]) {
          // Handle "single-value" attributes
          if (['href', 'src', 'poster', 'background'].includes(attribute)) {
            handleSingleValueAttributes(node, attribute, value)
          }

          // Handle `srcset` attribute
          if (attribute === 'srcset') {
            const parsed = srcset.parse(node.attrs[attribute])

            parsed.map(p => {
              if (!isUrl(p.url)) {
                p.url = typeof value === 'boolean' ? options.url + p.url : value + p.url
              }

              return p
            })

            node.attrs[attribute] = srcset.stringify(parsed)
          }
        }
      })
    })

    // Return the node
    return node
  }

  const handleSingleValueAttributes = (node, attribute, value) => {
    if (isUrl(node.attrs[attribute])) {
      return node
    }

    node.attrs[attribute] = typeof value === 'boolean' ? options.url + node.attrs[attribute] : value + node.attrs[attribute]
  }

  const prependUrl = (value, url) => {
    const {css} = postcss([postcssBaseUrl({base: url})]).process(`div { ${value} }`)
    return css.replace(/div {\s|\s}$/gm, '')
  }

  return tree.walk(process)
}
