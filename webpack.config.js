require('dotenv').config()

const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'none',
  entry: {
    options: './options.js',
    background: './background.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new webpack.DefinePlugin({
      CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
      CLIENT_SECRET: JSON.stringify(process.env.CLIENT_SECRET)
    })
  ]
}
