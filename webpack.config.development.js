/* eslint max-len: 0 */
import webpack from 'webpack'
import path from 'path'
import baseConfig from './webpack.config.base'

export default {
  ...baseConfig,
  debug: true,
    devtool: 'cheap-module-eval-source-map',
    entry: [
      'babel-polyfill',
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
          loaders: ['style-loader', 'css-loader'],
          include: path.resolve('app/styles/vender')
        },
        {
          test: /\.global\.css$/,
          loaders: [
            'style-loader',
            'css-loader?sourceMap'
          ]
        },
        {
          test: /^((?!\.global).)*\.css$/,
          loaders: [
            'style-loader',
            'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
          ],
          exclude: path.resolve('app/styles/vender')
        }
      ],
    },
    plugins: [
      ...baseConfig.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') })
    ],
    externals: [
      'electron', 'fs', 'tls', 'net', 'os', 'process',
      'url', 'request', 'ws'
    ]
}
