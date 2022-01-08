const isUrl = require('is-url-superb')
const merge = require('lodash.merge')
const srcset = require('srcset')

module.exports = (options = {}) => tree => {
  options.url = options.url || ''
  options.tags = merge({
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
      src: true, // `false` will skip the attribute
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
  }, options.tags)

  const process = node => {
    if (options.url && (typeof options.url !== 'string' || options.url === '')) {
      return node
    }

    // Handle HTML tags
    Object.entries(options.tags).forEach(([tag, attributes]) => {
      if (node.tag !== tag) {
        return node
      }

      // Handle tag attributes
      Object.entries(attributes).forEach(([attribute, value]) => {
        if (node.attrs[attribute]) {
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

  return tree.walk(process)
}
