const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = ({ mode } = { mode: "development" }) => {
 console.log(`mode is: ${mode}`);

 return {
  mode,
  entry: "./src/index.js",
  module: {
   rules: [
    {
     test: /\.(jpe?g|gif|png|svg)$/i,
     use: [
      {
       loader: 'url-loader',
       options: {
        limit: 10000
       }
      }
     ]
    }
   ],
  },
  output: {
   publicPath: "/",
   path: path.resolve(__dirname, "build"),
   filename: "bundled.js"
  },
  plugins: [
   new HtmlWebpackPlugin({
    template: "./public/index.html"
   }),
  ]
 }
};