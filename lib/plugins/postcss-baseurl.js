const isUrl = require('is-url-superb')

const regex = /url\(['"]?(.*?)['"]?\)/

module.exports = (options = {}) => {
  const {base} = options

  return {
    postcssPlugin: 'postcss-baseurl',
    Once(root, {result}) { // eslint-disable-line
      root.walkRules(rule => {
        rule.walkDecls((decl, i) => { // eslint-disable-line
          const {value} = decl
          if (value.includes('url(')) {
            const ms = value.match(regex)

            if (ms === null || isUrl(ms[1])) {
              return
            }

            decl.value = value.replace(ms[1], base + ms[1])
          }
        })
      })
    }
  }
}

module.exports.postcss = true
