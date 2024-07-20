'use strict';

const path = require('pathe');
const postcss = require('postcss');
const isUrl = require('is-url-superb');
const defu = require('defu');
const safe = require('postcss-safe-parser');
const api_js = require('posthtml/lib/api.js');
const srcset = require('srcset');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const path__default = /*#__PURE__*/_interopDefaultCompat(path);
const postcss__default = /*#__PURE__*/_interopDefaultCompat(postcss);
const isUrl__default = /*#__PURE__*/_interopDefaultCompat(isUrl);
const safe__default = /*#__PURE__*/_interopDefaultCompat(safe);

const urlPattern = /(url\(["']?)(.*?)(["']?\))/g;
function postcssBaseurl(options = {}) {
  const { base } = options;
  return {
    postcssPlugin: "postcss-baseurl",
    Once(root) {
      root.walkAtRules((rule) => {
        if (rule.name === "font-face") {
          rule.walkDecls((decl) => {
            const { value } = decl;
            decl.value = value.replace(urlPattern, ($0, $1, $2, $3) => {
              return isUrl__default($2) ? $1 + $2 + $3 : $1 + base + $2 + $3;
            });
          });
        }
      });
      root.walkRules((rule) => {
        rule.walkDecls((decl) => {
          const { value } = decl;
          decl.value = value.replace(urlPattern, ($0, $1, $2, $3) => {
            return isUrl__default($2) ? $1 + $2 + $3 : $1 + base + $2 + $3;
          });
        });
      });
    }
  };
}
postcssBaseurl.postcss = true;

const defaultTags = {
  a: {
    href: true
  },
  area: {
    href: true
  },
  audio: {
    src: true
  },
  base: {
    href: true
  },
  body: {
    background: true
  },
  embed: {
    src: true
  },
  iframe: {
    src: true
  },
  img: {
    src: true,
    srcset: true
  },
  input: {
    src: true
  },
  link: {
    href: true
  },
  script: {
    src: true
  },
  source: {
    src: true,
    srcset: true
  },
  table: {
    background: true
  },
  td: {
    background: true
  },
  th: {
    background: true
  },
  track: {
    src: true
  },
  video: {
    poster: true
  }
};
const plugin = (options = {}) => (tree) => {
  options.url = options.url || "";
  options.attributes = options.attributes || {};
  options.allTags = options.allTags || false;
  options.styleTag = options.styleTag || false;
  options.inlineCss = options.inlineCss || false;
  options.tags = options.allTags ? defu.defu(options.tags, defaultTags) : options.tags || {};
  tree.walk = tree.walk || api_js.walk;
  const process = (node) => {
    if (options.url && (typeof options.url !== "string" || options.url === "")) {
      return node;
    }
    if (!["array", "object"].includes(typeof options.tags)) {
      return node;
    }
    if (node.tag === "style" && node.content && options.styleTag) {
      node.content = postcss__default([
        postcssBaseurl({
          base: options.url
        })
      ]).process(node.content.join("").trim()).css;
    }
    if (node.attrs?.style && options.inlineCss) {
      node.attrs.style = prependUrl(node.attrs.style, options.url);
    }
    for (const [attribute, value] of Object.entries(options.attributes)) {
      if (node.attrs?.[attribute]) {
        handleSingleValueAttributes(node, attribute, value);
      }
    }
    const tags = Array.isArray(options.tags) ? Object.entries(defaultTags).filter(([tag]) => options.tags.includes(tag)) : Object.entries(options.tags);
    tags.forEach(([tag, attributes]) => {
      if (node.tag !== tag) {
        return node;
      }
      for (const [attribute, value] of Object.entries(attributes)) {
        if (node.attrs?.[attribute]) {
          if (["href", "src", "poster", "background"].includes(attribute)) {
            handleSingleValueAttributes(node, attribute, value);
          }
          if (attribute === "srcset") {
            const parsed = srcset.parseSrcset(node.attrs[attribute]);
            parsed.map((p) => {
              if (!isUrl__default(p.url)) {
                p.url = typeof value === "boolean" ? isUrl__default(options.url) ? options.url + p.url : path__default.join(options.url, p.url) : isUrl__default(value) ? value + p.url : path__default.join(value, p.url);
              }
              return p;
            });
            node.attrs[attribute] = srcset.stringifySrcset(parsed);
          }
        }
      }
    });
    return node;
  };
  const handleSingleValueAttributes = (node, attribute, value) => {
    if (isUrl__default(node.attrs[attribute])) {
      return node;
    }
    node.attrs[attribute] = typeof value === "boolean" ? isUrl__default(options.url) ? options.url + node.attrs[attribute] : path__default.join(options.url, node.attrs[attribute]) : isUrl__default(value) ? value + node.attrs[attribute] : path__default.join(value, node.attrs[attribute]);
  };
  const prependUrl = (value, url) => {
    const { css } = postcss__default([postcssBaseurl({ base: url })]).process(`div { ${value} }`, { parser: safe__default });
    return css.replace(/div {\s|\s}$/gm, "");
  };
  return tree.walk(process);
};

module.exports = plugin;
