const path = require('path')

module.exports = {
  lintOnSave: true,
  filenameHashing: false,

  configureWebpack: {
    optimization: {
      // 在這裡使用 SplitChunksPlugin
      splitChunks: {
        minSize: 0,
        cacheGroups: {
          // 把所有 node_modules 內的程式碼打包成一支 vendors.bundle.js
          vendors: {
            test: /[\\/]node_modules[\\/]/i,
            name: 'vendors',
            chunks: 'all'
          },
          common: {
            test: /[\\/]src[\\/]/i,
            name: `common`,
            chunks: 'all'
          }
        }
      },
      // 把 webpack runtime 也打包成一支 runtime.bundle.js
      runtimeChunk: {
        name: 'runtime'
      }
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  },
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.txt$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  },
  css: {
    extract: false
  },
  productionSourceMap: false
}
