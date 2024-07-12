import postcss from 'postcss'
import isUrl from 'is-url-superb'
import { defu as merge } from 'defu'
import { walk } from 'posthtml/lib/api.js'
import { parseSrcset, stringifySrcset } from 'srcset'
import postcssBaseUrl from './plugins/postcss-baseurl.js'

const defaultTags = {
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
}

const plugin = (options = {}) => tree => {
  options.url = options.url || ''
  options.attributes = options.attributes || {}
  options.allTags = options.allTags || false
  options.styleTag = options.styleTag || false
  options.inlineCss = options.inlineCss || false
  options.tags = options.allTags ? merge(options.tags, defaultTags) : options.tags || {}

  tree.walk = tree.walk || walk

  const process = node => {
    // Skip if `url` was not provided
    if (options.url && (typeof options.url !== 'string' || options.url === '')) {
      return node
    }

    // Skip if `options.tags` is not an array or object
    if (!['array', 'object'].includes(typeof options.tags)) {
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
    if (node.attrs?.style && options.inlineCss) {
      node.attrs.style = prependUrl(node.attrs.style, options.url)
    }

    // Handle defined HTML attributes
    for (const [attribute, value] of Object.entries(options.attributes)) {
      if (node.attrs?.[attribute]) {
        handleSingleValueAttributes(node, attribute, value)
      }
    }

    // Handle defined HTML tags
    const tags = Array.isArray(options.tags) ?
      Object.entries(defaultTags).filter(([tag]) => options.tags.includes(tag)) :
      Object.entries(options.tags)

    // biome-ignore lint: fails with for...of
    tags.forEach(([tag, attributes]) => {
      if (node.tag !== tag) {
        return node
      }

      // Handle tag attributes
      for (const [attribute, value] of Object.entries(attributes)) {
        if (node.attrs?.[attribute]) {
          // Handle "single-value" attributes
          if (['href', 'src', 'poster', 'background'].includes(attribute)) {
            handleSingleValueAttributes(node, attribute, value)
          }

          // Handle `srcset` attribute
          if (attribute === 'srcset') {
            const parsed = parseSrcset(node.attrs[attribute])

            parsed.map(p => {
              if (!isUrl(p.url)) {
                p.url = typeof value === 'boolean' ? options.url + p.url : value + p.url
              }

              return p
            })

            node.attrs[attribute] = stringifySrcset(parsed)
          }
        }
      }
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

export default plugin
