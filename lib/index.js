module.exports = (options = {}) => tree => {
  options.url = options.url || ''

  const process = node => {
    if (!options.url) {
      return node
    }

    // Return the node
    return node
  }

  return tree.walk(process)
}
