const path = require("path")

module.exports = {
  entry: {
    options: "./options.js",
    background: "./background.js"
  },

  output: {
    path: path.resolve(__dirname, "dist")
  },

  plugins: []
}