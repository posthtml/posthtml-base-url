import isUrl from 'is-url-superb'

const urlPattern = /(url\(["']?)(.*?)(["']?\))/g

export default function postcssBaseurl(options = {}) {
  const { base } = options

  return {
    postcssPlugin: 'postcss-baseurl',
    Once(root) {
      root.walkAtRules(rule => {
        if (rule.name === 'font-face') {
          rule.walkDecls(decl => {
            const { value } = decl
            decl.value = value.replace(urlPattern, ($0, $1, $2, $3) => {
              return isUrl($2) ? $1 + $2 + $3 : $1 + base + $2 + $3
            })
          })
        }
      })

      root.walkRules(rule => {
        rule.walkDecls(decl => {
          const { value } = decl
          decl.value = value.replace(urlPattern, ($0, $1, $2, $3) => {
            return isUrl($2) ? $1 + $2 + $3 : $1 + base + $2 + $3
          })
        })
      })
    }
  }
}

postcssBaseurl.postcss = true
