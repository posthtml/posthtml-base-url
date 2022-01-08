const isUrl = require('is-url-superb')
const merge = require('lodash.merge')
const srcset = require('srcset')

module.exports = (options = {}) => tree => {
  options.url = options.url || ''
  options.tags = merge({
    img: {
      src: true, // `false` will skip the attribute
      srcset: true,
    },
    source: {
      src: true,
      srcset: true,
    },
    video: {
      poster: true,
    },
    body: {
      background: true,
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
          if (['src', 'poster', 'background'].includes(attribute)) {
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
