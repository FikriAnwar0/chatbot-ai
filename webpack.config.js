const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // <== TAMBAH INI

module.exports = {
  entry: './main.js', // Entry point JS utama
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html', // Ambil dari file index.html asli
      inject: 'body' // Sisipkan script di akhir body
    })
  ]
};
