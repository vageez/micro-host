const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

// Dynamic Containers for lazy loading
// https://webpack.js.org/concepts/module-federation/#dynamic-remote-containers
const path = require("path");
const deps = require("./package.json").dependencies;
module.exports = (_, argv) => ({
  entry: "./src/index",
  mode: "development",
  output: {
    publicPath:
      argv.mode === "development"
        ? "http://localhost:8080/"
        : "https://awehost.bellmedia.ca/", // Production
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 8080,
    historyApiFallback: true,
    hot: "only",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  output: {
    publicPath: "auto",
    chunkFilename: "[id].[contenthash].js",
  },
  resolve: {
    extensions: [".js", ".mjs", ".jsx", ".css"],
    alias: {
      events: "events",
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        grid: "rotator@http://localhost:8092/remoteEntry.js",
        live: "live@http://localhost:8083/remoteEntry.js",
        search: "search@http://localhost:8085/remoteEntry.js",
        show: "show@http://localhost:8086/remoteEntry.js",
        video: "video@http://localhost:8087/remoteEntry.js",
        landing: "landing@http://localhost:8091/remoteEntry.js",
      },
      exposes: {
        "./Shell": "./src/Shell",
        "./StateService": "./src/StateService",
      },
      shared: {
        ...deps,
        react: {
          requiredVersion: deps.react,
          singleton: true,
        },
        "react-dom": {
          requiredVersion: deps["react-dom"],
          singleton: true,
        },
        "react-router-dom": {
          requiredVersion: deps["react-router-dom"],
          singleton: true,
        },
        "./src/StateService": {
          singleton: true,
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
});
