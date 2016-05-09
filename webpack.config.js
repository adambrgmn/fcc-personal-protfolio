const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist'),
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    bundle: PATHS.app,
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app,
      },
      {
        test: /\.json?$/,
        loader: 'json',
      },
      {
        test: /\.jade$/,
        loader: 'jade',
      },
    ],
  },
  postcss: () => [autoprefixer],
  sassLoader: {
    data: `$env: '${TARGET}';`,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'templates/index.jade',
      inject: false,
      title: 'React Boilerplate',
      subtitle: 'With Webpack and ES6',
      description: 'A ReactJS boilerplate',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT,
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loaders: ['style', 'css?sourceMap', 'postcss?sourceMap', 'sass?sourceMap'],
          include: PATHS.app,
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies),
    },
    output: {
      filename: '[name].js',
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin('style.css'),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.BROWSER': true,
        __DEV__: false,
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new CleanPlugin([PATHS.build]),
    ],
  });
}
