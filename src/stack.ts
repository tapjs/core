import StackUtils from 'stack-utils'

export default new StackUtils({
  // Support `settings.stackUtils.internals.push()`
  internals: StackUtils.nodeInternals(),
  ignoredPackages: []
})
