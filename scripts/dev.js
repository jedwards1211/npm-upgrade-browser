/* eslint-disable no-console */

const path = require('path')
const express = require('express')
const requireEnv = require('@jcoreio/require-env')
const webpackConfig = require('../webpack.config')
const PORT = requireEnv('PORT')

require('smart-restart')({
  main: path.resolve(__dirname, '..', 'src/server/index.babel.js'),
  commandOptions: process.argv.slice(2),
  deleteRequireCache: [
    require.resolve('../src/server/ssr/serverSideRender.js'),
  ],
})

const app = express()

const compiler = require('webpack')(webpackConfig)
app.use(
  require('webpack-dev-middleware')(compiler, webpackConfig.devServer || {})
)
app.use(require('webpack-hot-middleware')(compiler))

const proxy = require('http-proxy').createProxyServer()
// istanbul ignore next
proxy.on('error', err => console.error(err.stack))

const target = `http://localhost:${PORT}`

app.all('*', (req, res) => proxy.web(req, res, { target }))

const server = app.listen(webpackConfig.devServer.port)
if (!server) throw new Error('expected server to be defined')

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, { target })
})

console.log(
  `Dev server is listening on http://0.0.0.0:${webpackConfig.devServer.port}`
)
