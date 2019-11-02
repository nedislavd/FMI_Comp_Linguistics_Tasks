const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/scripts/index.js')
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  },
  plugins: [
    new CleanWebpackPlugin(['build'], { root: Path.resolve(__dirname, '..') }),
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../public'), to: 'public' }
    ]),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
      filename: './index.html'
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/views/task1.html'),
      filename: './views/task1.html'
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/views/task2.html'),
      filename: './views/task2.html'
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/views/task3.html'),
      filename: './views/task3.html'
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/views/task4.html'),
      filename: './views/task4.html'
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/views/task5.html'),
      filename: './views/task5.html'
    }),
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      },
    ]
  }
};
