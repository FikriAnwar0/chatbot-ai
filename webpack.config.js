const path = require('path');

module.exports = {
  entry: './main.js', // Tetap pakai main.js karena kamu pakai itu di root
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // hapus otomatis file lama di dist saat build baru
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // kalau pakai CSS import
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // opsional, kalau pakai ES6
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  }
};
