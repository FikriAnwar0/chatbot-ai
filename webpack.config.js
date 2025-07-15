const path = require('path');

module.exports = {
  entry: './main.js', // entry point kamu tetap
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true // hapus file lama di dist
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'] // dukung import css
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'] // dukung ES6+
          }
        }
      }
    ]
  }
};
