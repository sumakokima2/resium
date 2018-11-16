"use strict";

const path = require("path");
const os = require("os");

const webpack = require("webpack");
const CleanPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ForkTsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const HardSourcePlugin = require("hard-source-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");

const devServerPort = 3000;

module.exports = (env, args) => {
  const prod = args.mode === "production";
  const extractCSS = new ExtractTextPlugin(`style${prod ? ".[chunkhash]" : ""}.css`);
  const cssLoaders = [
    {
      loader: "css-loader",
      options: {
        camelCase: true,
        importLoaders: 1,
        localIdentName: "[local]_[hash:base64:5]",
        minimize: false, // minimized by OptimizeCssAssetsPlugin
        modules: true,
        sourceMap: !prod,
      },
    },
    "postcss-loader",
  ];

  return {
    devServer: {
      clientLogLevel: "warning",
      contentBase: path.join(__dirname, "build"),
      // disableHostCheck: true,
      historyApiFallback: true,
      hot: true,
      port: devServerPort,
      stats: "minimal",
    },
    devtool: prod ? void 0 : "inline-source-map",
    entry: [
      ...(prod
        ? []
        : [
            "react-hot-loader/patch",
            `webpack-dev-server/client?http://0.0.0.0:${devServerPort}`,
            "webpack/hot/only-dev-server",
          ]),
      "./src/index.tsx",
    ],
    externals: {
      cesium: "Cesium",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "thread-loader",
              options: {
                workers: Math.max(os.cpus().length - 1),
              },
            },
            ...(prod
              ? []
              : [
                  {
                    loader: "babel-loader",
                    options: {
                      babelrc: false,
                      cacheDirectory: true,
                      plugins: ["react-hot-loader/babel"],
                    },
                  },
                ]),
            {
              loader: "ts-loader",
              options: {
                happyPackMode: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: prod
            ? extractCSS.extract({
                fallback: "style-loader",
                use: cssLoaders,
              })
            : ["style-loader", ...cssLoaders],
        },
      ],
    },
    optimization: {},
    output: {
      filename: prod ? "[name].[chunkhash].js" : "[name].js",
      path: path.join(__dirname, "build"),
      publicPath: "/",
    },
    performance: {
      hints: prod ? "warning" : false,
    },
    plugins: [
      ...(prod
        ? [
            new CleanPlugin("build"),
            new OptimizeCssAssetsPlugin({
              cssProcessorOptions: {
                autoprefixer: false,
              },
            }),
            extractCSS,
          ]
        : [
            new webpack.HotModuleReplacementPlugin(),
            new HardSourcePlugin({
              environmentHash: {
                root: process.cwd(),
                directories: [],
                files: ["package-lock.json", "yarn.lock"],
              },
            }),
          ]),
      new HtmlWebpackPlugin({
        template: "src/index.html",
      }),
      new HtmlWebpackIncludeAssetsPlugin({
        append: false,
        assets: ["cesium/Widgets/widgets.css", "cesium/Cesium.js"],
      }),
      new CopyWebpackPlugin([
        { from: "src/public", ignore: [".gitkeep"] },
        { from: `node_modules/cesium/Build/Cesium${prod ? "" : "Unminified"}`, to: "cesium" },
      ]),
      new ForkTsCheckerPlugin({
        checkSyntacticErrors: true,
      }),
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  };
};
