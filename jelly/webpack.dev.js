const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

// config for watching
module.exports = merge(common, {
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "build"),
    port: 3000, //default
    inline: true
  }
});
