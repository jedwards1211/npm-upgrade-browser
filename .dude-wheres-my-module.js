/**
 * @prettier
 */

module.exports = async function configure() {
  const path = require('path')
  const promisify = require('es6-promisify')
  const glob = promisify(require('glob'))

  const nodeModulesDir = path.join(__dirname, 'node_modules')

  function assumeDefaultImports(files, options = {}) {
    const transformIdentifier = options.transformIdentifier || (id => id)
    const result = []
    files.forEach(file => {
      if (/index\.js$/.test(file)) file = path.dirname(file)
      file = file.replace(/\.js$/, '')
      const identifier = path.basename(file)
      if (identifier[0] === '_' || /[^a-zA-Z0-9_]/.test(identifier)) return
      result.push(
        `import ${transformIdentifier(identifier, {
          file,
        })} from '${path.relative(nodeModulesDir, file)}'`
      )
    })
    return result
  }

  function assumeNamedImports(files) {
    const result = []
    files.forEach(file => {
      if (/index\.js$/.test(file)) file = path.dirname(file)
      file = file.replace(/\.js$/, '')
      const identifier = path.basename(file)
      if (identifier[0] === '_' || /[^a-zA-Z0-9_]/.test(identifier)) return
      const moduleMatch = /node_modules\/((@[^/]+\/)?[^/]+)/.exec(file)
      if (moduleMatch) {
        result.push(`import { ${identifier} } from '${moduleMatch[1]}'`)
      }
    })
    return result
  }

  async function globNodeModules(pattern) {
    const files = await glob(path.join(nodeModulesDir, pattern))
    return assumeDefaultImports(files)
  }

  const preferredImports = [
    `
import _ from 'lodash'
import gql from 'graphql-tag'
import {Query, Mutation, type QueryRenderProps, type MutationFunction} from 'react-apollo'
import {Link, NavLink, type Match, type RouterHistory, type Location} from 'react-router-dom'
import * as graphql from 'graphql'
import * as React from 'react'
import classNames from 'classnames'
import requireEnv from '@jcoreio/require-env'
import path from 'path'
import fs from 'fs-extra'
import {describe, it, before, after, beforeEach, afterEach} from 'mocha'
import {expect} from 'chai'
    `,
  ]

  preferredImports.push(...assumeNamedImports(await glob('lodash/*.js')))

  preferredImports.push(
    ...assumeDefaultImports(
      await glob(path.join(nodeModulesDir, '@material-ui/core/**/index.js'), {
        ignore: [path.join(nodeModulesDir, '@material-ui/core/es/**')],
      })
    )
  )
  preferredImports.push(
    ...assumeDefaultImports(
      await glob(path.join(nodeModulesDir, '@material-ui/icons/*.js')),
      { transformIdentifier: identifier => `${identifier}Icon` }
    )
  )
  preferredImports.push(
    ...assumeDefaultImports(
      await glob(path.join(nodeModulesDir, '@material-ui/icons/*.js'))
    )
  )

  return {
    preferredImports,
  }
}
