const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ScriptExtHTMLWebpackPlugin = require('script-ext-html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // mode: 'production',
  // devtool: 'source-map',
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    demo1: './src/js/index.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'docs'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/js'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-syntax-dynamic-import'],
            presets: [
              [
                '@babel/preset-env',
                {
                  'useBuiltIns': 'usage',
                  'corejs': '3.1.3',
                },
              ],
            ],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        loaders: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        demo1_css: {
          test: m => m.identifier().includes('demo1.scss'),
          name: 'demo1_css',
          chunks: 'all',
          enforce: true,
        },
        demo2_css: {
          test: m => m.identifier().includes('demo2.scss'),
          name: 'demo2_css',
          chunks: 'all',
          enforce: true,
        },
        demo3_css: {
          test: m => m.identifier().includes('demo3.scss'),
          name: 'demo3_css',
          chunks: 'all',
          enforce: true,
        },
      },
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [
      '**/*',
      '!demo1.min.js',
      '!demo2.min.js',
      '!demo3a.min.js',
      '!demo3b.min.js',
    ] }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
    new HTMLWebpackPlugin({
      template: './src/html/index1.html',
      title: 'CSS Paint Demo 1',
      filename: 'demo1.html',
    }),
    new HTMLWebpackPlugin({
      template: './src/html/index2.html',
      title: 'CSS Paint Demo 2',
      filename: 'demo2.html',
    }),
    new HTMLWebpackPlugin({
      template: './src/html/index3.html',
      title: 'CSS Paint Demo 3',
      filename: 'demo3.html',
    }),
    new ScriptExtHTMLWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  devServer: {
    port: 3001,
    contentBase: path.join(__dirname, 'docs'),
    index: 'index.html',
  },
};
