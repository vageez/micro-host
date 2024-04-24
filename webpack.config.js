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
        : "https://micro-host-self.vercel.app/", // Production
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
        live: "live@https://micro-live.vercel.app/remoteEntry.js",
        search: "search@https://micro-search.vercel.app/remoteEntry.js",
        show: "show@https://micro-show.vercel.app/remoteEntry.js",
        video: "video@https://micro-video.vercel.app/remoteEntry.js",
        landing: "landing@https://micro-landing-one.vercel.app/remoteEntry.js",
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
        "@mui/material": {
          requiredVersion: deps["@mui/material"],
          singleton: true,
        },
        "@emotion/styled": {
          requiredVersion: deps["@emotion/styled"],
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

/**

HOST
https://micro-host-self.vercel.app/host/remoteEntry.js

ROTATOR
https://micro-rotator.vercel.app/rotator/remoteEntry.js

GRID
https://micro-grid.vercel.app/grid/remoteEntry.js

LANDING
https://micro-landing-one.vercel.app/landing/remoteEntry.js

LIVE
https://micro-live.vercel.app/live/remoteEntry.js

SHOW
https://micro-show.vercel.app/show/remoteEntry.js

SEARCH
https://micro-search.vercel.app/search/remoteEntry.js

VIDEO
https://micro-video.vercel.app/video/remoteEntry.js


remotes: {
   live: "live@http://localhost:8083/remoteEntry.js",
   search: "search@http://localhost:8085/remoteEntry.js",
   show: "show@http://localhost:8086/remoteEntry.js",
   video: "video@http://localhost:8087/remoteEntry.js",
   landing: "landing@http://localhost:8091/remoteEntry.js",
}

 */
