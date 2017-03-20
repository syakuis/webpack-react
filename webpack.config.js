const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const glob = require('glob')
let entries = {}
let dirnames = {}
const entryTarget = glob.sync('./src/*/index.js')

for (var i in entryTarget) {
  const entry = entryTarget[i]
  const dirname = path.dirname(entry)

  const name = dirname.replace(/\.\/src\/(.*)/, '$1')
  console.log(`entry -> ${name}`)
  entries[name] = entry
  dirnames[name] = dirname.replace(/\.\/src\/(.*)/, '$1')
}

console.log('entries ==> ', entries)
console.log('dirnames ==> ', dirnames)

let htmlWebpackPlugins = []

for (let key in entries) {
  htmlWebpackPlugins.push(htmlWebpackPlugins,
    new HtmlWebpackPlugin({
      chunks: [ key ],
      filename: './' + key + '.html',
      // template: './src/' + dirnames[key] + '/index.html'
      template: './src/index.html'
    })
  )
}

console.log('HtmlWebpackPlugin ==> ', htmlWebpackPlugins)

module.exports = {
  entry: './src/index.js',
  output: {
    path: 'dist',
    publicPath: '',
    filename: '[name].js'
  },

  plugins: [
    new ExtractTextPlugin({
      filename: './[name].css'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './src/index.html'
    })

  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        include: path.join(__dirname, 'src'),
        use: 'file-loader?name=[hash].[ext]&publicPath=/images/&outputPath=images/'
      },
      {
        test: [/\.js$/],
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: [ 'react', 'es2015', 'stage-3' ]
        }
      }
    ]
  },
  devServer: {
    inline: true,
    hot: true,
    port: 8008,
    host: '0.0.0.0',
    contentBase: './dist'
  }
}
