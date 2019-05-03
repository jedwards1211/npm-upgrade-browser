module.exports = function(env) {
  env.setDefault('PORT', '4385')
  env.setDefault('WEBPACK_PORT', String(parseInt(env.get('PORT')) + 1))
}
