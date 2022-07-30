module.exports = {
  upgrade: true,
  deep: true,
  target: (_name, [info]) => {
    if (!info) {
      return 'patch'
    } else if (info.operator === '^') {
      return 'minor'
    } else if (info.operator === undefined) {
      return 'patch'
    }
    return 'minor'
  },
}
