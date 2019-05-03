/* @flow */
import warning from 'warning'
import type { StyleSheet, Rule, generateClassName } from 'jss'

const maxRules = 1e10

const env = process.env.NODE_ENV

/**
 * Fork of jss/src/utils/createGenerateClassName that excludes the moduleId
 * and jss id from the generated class names because:
 * - we only use one instance of jss
 * - server-side hot reloading requires forcing the moduleId and jss id to work,
 *   which is kind of a hack
 */
export default (): generateClassName => {
  let ruleCounter = 0
  const defaultPrefix = env === 'production' ? 'c' : ''

  return (rule: Rule, sheet?: StyleSheet): string => {
    ruleCounter += 1

    if (ruleCounter > maxRules) {
      warning(
        false,
        '[JSS] You might have a memory leak. Rule counter is at %s.',
        ruleCounter
      )
    }

    let prefix = defaultPrefix

    if (sheet) {
      prefix = sheet.options.classNamePrefix || defaultPrefix
    }

    if (env === 'production') {
      return `${prefix}${ruleCounter}`
    }

    return `${prefix + rule.key}-${ruleCounter}`
  }
}
