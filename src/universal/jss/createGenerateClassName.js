import warning from 'warning'

const maxRules = 1e10

const env = process.env.NODE_ENV
const isProd = env !== 'development'

/**
 * Fork of jss/src/utils/createGenerateClassName that excludes the moduleId
 * and jss id from the generated class names because:
 * - we only use one instance of jss
 * - server-side hot reloading requires forcing the moduleId and jss id to work,
 *   which is kind of a hack
 */
export default () => {
  let ruleCounter = 0
  const defaultPrefix = isProd ? 'c' : ''

  return (rule, sheet): string => {
    ruleCounter += 1

    if (ruleCounter > maxRules) {
      warning(
        false,
        '[JSS] You might have a memory leak. Rule counter is at %s.',
        ruleCounter
      )
    }

    let prefix = defaultPrefix
    if (sheet) prefix = sheet.options.classNamePrefix || defaultPrefix
    if (isProd) return `${prefix}${ruleCounter}`
    return `${prefix + rule.key}-${ruleCounter}`
  }
}
