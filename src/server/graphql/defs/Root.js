// @flow

import path from 'path'
import * as fs from 'fs-extra'
import JSONType from 'graphql-type-json'
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { whatBroke } from 'what-broke'

import { type GraphQLContext } from '../GraphQLContext'

export const typeDefs = `
  type Query {
    temp: Boolean
    packageJson: JSON!
    installedPackages: [InstalledPackage!]!
    changelog(package: String!): [Release!]!
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
`

type InstalledPackage = {
  id: string,
  name: string,
  version: string,
  isDev: boolean,
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
  fs.readJson(path.resolve(projectDir, 'package.json'))

export const resolvers = {
  JSON: JSONType,
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  SequelizeJSON: { ...JSONType, name: 'SequelizeJSON' },
  Query: {
    temp: () => true,
    packageJson: getPackageJson,
    async installedPackages(
      src: any,
      args: any,
      context: GraphQLContext
    ): Promise<Array<InstalledPackage>> {
      const { dependencies, devDependencies } = await getPackageJson(
        src,
        args,
        context
      )
      const { projectDir } = context
      return [
        ...Object.keys(dependencies).map((name: string) => ({
          id: name,
          name,
          // $FlowFixMe
          version: require(require.resolve(`${name}/package.json`, {
            paths: [projectDir],
          })).version,
          isDev: false,
        })),
        ...Object.keys(devDependencies).map((name: string) => ({
          id: name,
          name,
          // $FlowFixMe
          version: require(require.resolve(`${name}/package.json`, {
            paths: [projectDir],
          })).version,
          isDev: true,
        })),
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
}
