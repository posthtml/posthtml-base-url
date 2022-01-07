module.exports = (options = {}) => tree => {
  options.url = options.url || ''
  options.tags = options.tags || {
    img: {
      src: true, // `false` will skip the attribute
    },
  }

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
        if (node.attrs[attribute] && value) {
          node.attrs[attribute] = typeof value === 'boolean' ? options.url + node.attrs[attribute] : value + node.attrs[attribute]
        }
      })
    })

    // Return the node
    return node
  }

  return tree.walk(process)
}
