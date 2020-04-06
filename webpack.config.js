const fs = require('fs');
const webpack = require('webpack');

const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const root = ((path, root) => (...args) => path.join(...[root].concat(args)))(path, path.resolve(__dirname, ''));
const packageJSON = require('./package.json');
const presetEnv = require('babel-preset-env');

const PROD = process.env.NODE_ENV === 'production';
let Config;

if (PROD) {
  Config = require('./config/prod.json');
} else {
  Config = require('./config/dev.json');
}

module.exports = function () {
  return {
    entry: {
      app: [ 'babel-polyfill', root('src/app/bootstrap.jsx') ],
      vendors: root('src/vendors.js'),
    },
    output: {
      path: root('dist'),
      filename: '[name].bundle.[hash:8].js',
      sourceMapFilename: '[name].map',
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json', '.css', '.scss', '.html'],
      modules: [root('node_modules'), root('src')],
    },
    devtool: PROD ? false : 'eval',
    module: {
      exprContextCritical: false,
      rules: rules(),
    },
    plugins: plugins(),
    devServer: {
      contentBase: root('dist'),
      historyApiFallback: true,
    },
    node: {
      global: true,
      crypto: 'empty',
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false,
    },
  };
};

function rules() {
  return [
    {
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      exclude: root('node_modules'),
      loader: 'eslint-loader',
    },
    {
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      include: [fs.realpathSync(root('node_modules/fe-shared')), root('src')],
      query: {
        presets: ['es2015', presetEnv, 'react'],
        plugins: ['transform-class-properties', 'transform-object-rest-spread'],
      },
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!sass-loader',
      }),
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
      }),
    },
    {
      test: /\.(png|jpg|jpeg)(\?.*)?$/,
      loader: 'url-loader?limit=10000',
    },
    {
      test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader?name=assets/fonts/[name].[ext]',
    },
  ];
}

function plugins() {
  let _plugins = [
    new LoaderOptionsPlugin({
      eslint: {
        emitError: true,
      },
    }),
    new DefinePlugin({
      APP_CONFIG: JSON.stringify(Config),
      APP_VERSION: JSON.stringify(packageJSON.version),
    }),
    new CommonChunkPlugin({
      names: ['app', 'vendors'],
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['vendors', 'app'],
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash:8].css',
      allChunks: true,
    }),
  ];
  if (PROD) {
    _plugins = _plugins.concat([
      new DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
      new webpack.optimize.UglifyJsPlugin({
        mangle: {
          except: ['$super', '$', 'exports', 'require', 'angular'],
        },
        beautify: false,
        sourceMap: false,
        compress: {
          drop_console: false,
          warnings: false,
          pure_getters: true,
          unsafe: false,
          unsafe_comps: false,
          screw_ie8: true,
        },
        comments: false,
        exclude: [/\.min\.js$/gi],
      }),
    ]);
  }
  return _plugins;
}
