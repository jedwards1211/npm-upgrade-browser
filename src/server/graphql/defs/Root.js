// @flow

import path from 'path'
import * as fs from 'fs-extra'
import JSONType from 'graphql-type-json'
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { whatBroke } from 'what-broke'
import { type GraphQLContext } from '../GraphQLContext'
import { spawn } from 'promisify-child-process'
import chalk from 'chalk'

export const typeDefs = `
  type Query {
    temp: Boolean
    packageJson: JSON!
    installedPackage(package: String!): InstalledPackage!
    installedPackages: [InstalledPackage!]!
    changelog(package: String!): [Release!]!
  }

  type Mutation {
    upgradePackages(packages: [PackageUpgrade!]!): [InstalledPackage!]!
  }

  scalar Date
  scalar Time
  scalar DateTime
  scalar JSON
  scalar SequelizeJSON

  type InstalledPackage {
    id: String!
    name: String!
    version: String!
    isDev: Boolean!
  }

  type Release {
    id: String!
    date: DateTime!
    version: String!
    header: String!
    body: String
    error: String
  }

  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: String
    endCursor: String
  }

  input PackageUpgrade {
    name: String!
    version: String!
  }
`

type InstalledPackage = {
  id: string,
  name: string,
  version: string,
  isDev: boolean,
}

type PackageUpgrade = {
  name: string,
  version: string,
}

type Release = {
  id: string,
  header: string,
  date: Date,
  version: string,
  body?: ?string,
  error?: ?string,
}

const getPackageJson = (src: any, args: any, { projectDir }: GraphQLContext) =>
  // $FlowFixMe
  require(path.resolve(projectDir, 'package.json'))

function installedPackage(
  src: any,
  args: { package: string },
  context: GraphQLContext
): InstalledPackage {
  const { dependencies, devDependencies } = getPackageJson(src, args, context)
  const { package: name } = args
  const { projectDir } = context
  let version
  try {
    // $FlowFixMe
    version = require(require.resolve(`${name}/package.json`, {
      paths: [projectDir],
    })).version
  } catch (error) {
    throw new Error(`package not found: ${name}`)
  }
  return {
    id: name,
    name,
    version,
    isDev: Boolean(!dependencies[name] && devDependencies[name]),
  }
}

export const resolvers = {
  JSON: JSONType,
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  SequelizeJSON: { ...JSONType, name: 'SequelizeJSON' },
  Query: {
    temp: () => true,
    packageJson: getPackageJson,
    installedPackage,
    async installedPackages(
      src: any,
      args: any,
      context: GraphQLContext
    ): Promise<Array<InstalledPackage>> {
      const { dependencies, devDependencies } = getPackageJson(
        src,
        args,
        context
      )
      return [
        ...Object.keys(dependencies).map((name: string) =>
          installedPackage(src, { package: name }, context)
        ),
        ...Object.keys(devDependencies).map((name: string) =>
          installedPackage(src, { package: name }, context)
        ),
      ]
    },
    async changelog(
      src: any,
      { package: pkg }: { package: string },
      { projectDir }: GraphQLContext
    ): Promise<Array<Release>> {
      const changelog = await whatBroke(pkg, {
        full: true,
        // $FlowFixMe
        fromVersion: require(require.resolve(`${pkg}/package.json`, {
          paths: [projectDir],
        })).version,
      })
      return changelog.map(({ version, header, date, body, error }) => ({
        id: `${pkg}/${version}`,
        version,
        header,
        date,
        body,
        error: error ? error.message || String(error) : null,
      }))
    },
  },
  Mutation: {
    async upgradePackages(
      src: any,
      { packages }: { packages: Array<PackageUpgrade> },
      context: GraphQLContext
    ): Promise<Array<InstalledPackage>> {
      const { projectDir } = context
      const upgrades = packages.map(
        ({ name, version }) => `${name}@^${version}`
      )
      if (await fs.exists(path.join(projectDir, 'yarn.lock'))) {
        console.log(chalk.gray(`yarn upgrade ${upgrades.join(' ')}`)) // eslint-disable-line no-console
        await spawn('yarn', ['upgrade', ...upgrades], {
          stdio: 'inherit',
          cwd: projectDir,
        })
      } else {
        console.log(chalk.gray(`npm update --save ${upgrades.join(' ')}`)) // eslint-disable-line no-console
        await spawn('npm', ['update', '--save', ...upgrades], {
          stdio: 'inherit',
          cwd: projectDir,
        })
      }
      return packages.map(({ name }) =>
        installedPackage(src, { package: name }, context)
      )
    },
  },
}
