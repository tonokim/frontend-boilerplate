var rucksack = require('rucksack-css')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path')

var config = {
  context: path.join(__dirname, './client'),
  entry: {
    jsx: './index.js',
    html: './index.html',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux'
    ]
  },
  output: {
    path: path.join(__dirname, './static'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        include: /client/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'postcss-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: /client/,
        loader: 'style!css'
      },
      {
        test: /\.scss$/,
        include: /client/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot',
          'babel-loader'
        ]
      },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url?limit=10000&name=./images/[name].[ext]' },
      { test: /\.(ttf|eot|woff|woff2|otf|svg)/, loader: 'file?name=./font/[name].[ext]' }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
    })
  ],
  devServer: {
    contentBase: './client',
    hot: true
  }
}

if(process.env.NODE_ENV == 'production'){
  config.output.filename = '[chunkhash:8].bundle.js';
  config.plugins = [
    new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
    new webpack.optimize.OccurenceOrderPlugin(),//按引用频度来排序 ID，以便达到减少文件大小的效果
    new webpack.optimize.DedupePlugin(),  //查找相等或近似的模块，避免在最终生成的文件中出现重复的模块。
		new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false,
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', '[chunkhash:8].vendor.js'),
    new ExtractTextPlugin('[chunkhash:8].bundle.css'),
    new HtmlWebpackPlugin({
      title: 'react-starter',
      template: 'index.ejs',
      inject: 'body'
    })
  ];
  config.module.loaders[1] = {
    test: /\.css$/,
    include: /client/,
    loader: ExtractTextPlugin.extract('style','css?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]!postcss')
  }
  config.module.loaders[2] = {
    test: /\.css$/,
    exclude: /client/,
    loader: ExtractTextPlugin.extract('style','css')
  }
  config.module.loaders[3] = {
    test: /\.scss$/,
    include: /client/,
    loader: ExtractTextPlugin.extract('style','css?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]!postcss!sass')
  }
}


module.exports = config;
