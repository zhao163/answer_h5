'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const vuxLoader = require('vux-loader')
const CompressionPlugin = require("compression-webpack-plugin");



var webpack = require("webpack")
//var SpritesmithPlugin = require('webpack-spritesmith');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}



const webpackConfig = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: require.resolve('zepto'),
        loader: 'exports-loader?window.Zepto!script-loader'
      }
    ],
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new CompressionPlugin({
      asset: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
      algorithm: 'gzip', //算法
      test: new RegExp(
        '\\.(js|css)$' //压缩 js 与 css
      ),
      threshold: 10240, //只处理比这个值大的资源。按字节计算
      minRatio: 0.8 //只有压缩率比这个值小的资源才会被处理
    })
    /*new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      jquery: "jquery",
      "window.jQuery": "jquery"
    })*/
    /*new webpack.ProvidePlugin({
      $: 'zepto',
      Zepto: 'zepto',
      'window.Zepto': 'zepto',
    }),*/
    /*new SpritesmithPlugin({
      // 目标小图标
      src: {
        cwd: path.resolve(__dirname, '../src/assets/imgs/icons'),
        glob: '*.png'
      },
      // 输出雪碧图文件及样式文件
      target: {
        image: path.resolve(__dirname, '../src/assets/imgs/sprites/sprite.png'),
        css: path.resolve(__dirname, '../src/assets/imgs/sprites/sprite.css')
      },
      // 样式文件中调用雪碧图地址写法
      apiOptions: {
        cssImageRef: '../sprites/sprite.png'
      },
      spritesmithOptions: {
        algorithm: 'top-down'
      }
    }),*/
  ],
  externals: {
    "BMap": "BMap",
  },
}

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [
    {
      name: 'vux-ui'
    },
    {
      name: 'duplicate-style'
    },
    {
      name: 'less-theme',
      path: 'src/style/base/theme.less'
    }
  ]
})
