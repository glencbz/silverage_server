var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var nodeRoot = path.join( __dirname, 'node_modules');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: [
    // "font-awesome-webpack!./node_modules/font-awesome-webpack/font-awesome.config.js",
    "./src/js/app.js",
    // 'webpack-dev-server/client?http://localhost:8080',
    // 'webpack/hot/only-dev-server',
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      {
        test: /\.(scss|sass)$/,
        exclude: /(node_modules|globals)/,
        loaders: [
          'style',
          'css?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]',
          'postcss',
          'sass',
        ],
      },
      {
        test: /\.(scss|sass)$/,
        include: /(node_modules|globals)/,
        loaders: [
          'style',
          'css',
          'postcss',
          'sass',
        ],
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /bootstrap([\\\/].+)+.js/, loader: "imports?jQuery=jquery" }
    ],
    noParse: [ /socket.io-client/ ]
  },
  output: {
    path: __dirname + "/dist",
    filename: "app.min.js"
  },
  plugins: (debug ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ]).concat([
      new webpack.ProvidePlugin({
             $: "jquery",
             jQuery: "jquery"
      }),
      new webpack.ProvidePlugin({
        "window.Tether": "tether"
      })]),
    resolve: {
        alias: {
            'socket.io-client': path.join(nodeRoot, 'socket.io/node_modules' , 'socket.io-client', 'socket.io.js' )
        }
    },
};
