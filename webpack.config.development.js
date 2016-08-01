/* eslint max-len: 0 */
import webpack from 'webpack'
import path from 'path'
import baseConfig from './webpack.config.base'

export default {
  ...baseConfig,
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    './app/index'
  ],
  output: {
    ...baseConfig.output,
    publicPath: 'http://localhost:3000/dist/'
  },
  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: path.resolve('app/styles')
      },
      {
        test: /\.scss/,
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
        include: path.resolve('app/styles')
      }
    ]
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') })
  ],
  externals: [
    'electron', 'fs', 'tls', 'net', 'os', 'process', 'url',
    'request', 'ws'
  ]
}
