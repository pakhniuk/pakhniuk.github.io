"use strict";

const NODE_ENV = process.env.NODE_ENV || "development";
const webpack = require("webpack");
const path = require("path");

// all style inlude in one file
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// include index.html
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "src"), // main enrtypoints
    // home: path.join(__dirname, 'src/entryPoints/home'),    // second entrypoints
    vendor: ["react", "react-dom"], // here we put all libraries
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "js/[name].bundle.js", // get main.bundle.js, home.bundle.js, vendor.bundle.js
  },

  optimization: {
    runtimeChunk: {
      name: "vendor",
    },
  },
  plugins: [
    new ExtractTextPlugin("css/main.css"),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      chunks: ["vendor", "main"],
      // filename: 'home.html'
    }),
  ],
  resolve: {
    extensions: ["*", ".js", "jsx", ".css", ".scss", ".json"],
    alias: {
      // alias needs for quick export file from name
      App: path.join(__dirname, "src/js/App.js"),
      Styles: path.join(__dirname, "src/styles/main.scss"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["react", ["es2015", { modules: false }]],
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
            },
          ],
          // use style-loader in development
          fallback: "style-loader",
        }),
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
            },
            {
              loader: "sass-loader",
            },
          ],
          // use style-loader in development
          fallback: "style-loader",
        }),
      },
      {
        // img loader
        test: /\.(jpg|jpeg|gif|png|ico)$/,
        loader: "url-loader?limit=100000&name=img/[name].[ext]",
      },
      {
        // audio loader
        test: /\.mp3$/,
        loader: "url-loader?limit=100000&name=audio/[name].[ext]",
      },
      {
        // svg react loader
        test: /\.svg$/,
        use: [
          {
            loader: "svg-react-loader",
            options: {
              jsx: true,
            },
          },
        ],
      },
      {
        // font load css module react
        test: /\.(eot|ttf|woff|woff2)(\?.*$|$)/,
        loader: "url-loader?limit=100000&name=fonts/[name].[ext]",
      },
    ],
  },
};
