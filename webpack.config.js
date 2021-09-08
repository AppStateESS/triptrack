const webpack = require('webpack')
const setup = require('./exports.js')
const TerserPlugin = require('terser-webpack-plugin')
/* global module */
module.exports = (env, argv) => {
  const inProduction = argv.mode === 'production'
  const inDevelopment = argv.mode === 'development'

  const settings = {
    entry: setup.entry,
    output: {
      path: setup.path.join(setup.APP_DIR, 'dev'),
    },
    watchOptions: {ignored: /node_modules/},
    optimization: {
      splitChunks: {
        minChunks: 2,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            minChunks: 2,
            name: 'vendor',
            enforce: true,
            chunks: 'all',
          },
        },
      },
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.jsx?/,
          include: setup.APP_DIR,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
      ],
    },
  }

  if (inDevelopment) {
    const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
    settings.plugins.push(
      new BrowserSyncPlugin({
        host: 'localhost',
        notify: false,
        port: 3000,
        files: ['./javascript/dev/*.js'],
        proxy: 'localhost/canopy',
      })
    )

    settings.devtool = 'inline-source-map'
    settings.output = {
      path: setup.path.join(setup.APP_DIR, 'dev'),
      filename: '[name].js',
    }
  }

  if (inProduction) {
    settings.optimization.minimize = true
    settings.optimization.minimizer = [new TerserPlugin()]

    const AssetsPlugin = require('assets-webpack-plugin')
    settings.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      })
    )
    settings.plugins.push(
      new AssetsPlugin({
        filename: 'assets.json',
        prettyPrint: true,
        removeFullPathAutoPrefix: true,
      })
    )
    settings.output = {
      path: setup.path.join(setup.APP_DIR, 'build'),
      filename: '[name].[chunkhash:8].min.js',
      chunkFilename: '[name].[chunkhash:8].chunk.js',
    }
  }
  return settings
}
