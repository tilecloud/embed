const path = require('path')

module.exports = {
  entry: './src/embed.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'embed.js',
  },

  module: {
    loaders: [
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ],
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
