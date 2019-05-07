/* eslint-disable no-console */
const open = require('open')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const requireEnv = require('@jcoreio/require-env')
const webpackConfig = require('../webpack.config')
const PORT = requireEnv('PORT')

let readyPromise = Promise.reject(new Error('server not started yet'))
readyPromise.catch(() => {})

require('smart-restart')({
  main: path.resolve(__dirname, '..', 'src/server/index.babel.js'),
  args: process.argv.slice(2),
  deleteRequireCache: [
    require.resolve('../src/server/ssr/serverSideRender.js'),
  ],
  onChildSpawned: child => {
    readyPromise = new Promise(resolve => {
      child.on('message', msg => {
        if (msg && msg.listening) resolve()
      })
    })
  },
})

const app = express()

app.use(morgan('tiny'))

const compiler = require('webpack')(webpackConfig)
app.use(
  require('webpack-dev-middleware')(compiler, webpackConfig.devServer || {})
)
app.use(require('webpack-hot-middleware')(compiler))

const proxy = require('http-proxy').createProxyServer()
// istanbul ignore next
proxy.on('error', err => console.error(err.stack))

const target = `http://localhost:${PORT}`

app.all('*', async (req, res) => {
  await readyPromise
  proxy.web(req, res, { target })
})

const server = app.listen(webpackConfig.devServer.port)
if (!server) throw new Error('expected server to be defined')

server.on('upgrade', async (req, socket, head) => {
  await readyPromise
  proxy.ws(req, socket, head, { target })
})

console.log(
  `Dev server is listening on http://0.0.0.0:${webpackConfig.devServer.port}`
)
open(`http://0.0.0.0:${webpackConfig.devServer.port}`)
