// @flow

import path from 'path'
import fs from 'fs-extra'
import JSONType from 'graphql-type-json'
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { whatBroke } from 'what-broke'

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
    version: String!
    body: String!
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
  version: string,
  body: string,
}

const getPackageJson = () =>
  fs.readJson(path.resolve(process.cwd(), 'package.json'))

export const resolvers = {
  JSON: JSONType,
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  SequelizeJSON: { ...JSONType, name: 'SequelizeJSON' },
  Query: {
    temp: () => true,
    packageJson: getPackageJson,
    async installedPackages(): Promise<Array<InstalledPackage>> {
      const { dependencies, devDependencies } = await getPackageJson()
      return [
        ...Object.keys(dependencies).map((name: string) => ({
          id: name,
          name,
          // $FlowFixMe
          version: require(`${name}/package.json`).version,
          isDev: false,
        })),
        ...Object.keys(devDependencies).map((name: string) => ({
          id: name,
          name,
          // $FlowFixMe
          version: require(`${name}/package.json`).version,
          isDev: true,
        })),
      ]
    },
    async changelog(
      src: any,
      { package: pkg }: { package: string }
    ): Promise<Array<Release>> {
      const changelog = await whatBroke(pkg, {
        // $FlowFixMe
        fromVersion: require(`${pkg}/package.json`).version,
      })
      return changelog.map(({ version, body }) => ({
        id: `${pkg}/${version}`,
        version,
        body,
      }))
    },
  },
}
