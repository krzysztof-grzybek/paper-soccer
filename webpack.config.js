const path = require('path');
const open = require('open');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const secret = require('./secret.json');

function getConfig(env) {
  if (!env) {
    throw new Error('Environment is not specified');
  }

  const config = {
    development: {
      sdkPath: './common/js/mock/fbinstant.6.2.mock.js',
    },
    production: {
      sdkPath: 'https://connect.facebook.net/en_US/fbinstant.6.2.js'
    },
    ['test-player']: {
      sdkPath: 'https://connect.facebook.net/en_US/fbinstant.6.2.js'
    }
  };

  return config[env];
}

const config = getConfig(process.env.NODE_ENV);
const port = 3000;
const env = process.env.NODE_ENV === 'test-player' ? 'development' : process.env.NODE_ENV;
module.exports = {
  mode: env,
  devServer: {
    contentBase: __dirname + '/dist',
    port: port,
    open: process.env.NODE_ENV === 'development',
    https: {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
    },
    after: () => {
      if (process.env.NODE_ENV === 'test-player') {
        open(`https://www.facebook.com/embed/instantgames/${secret.FB_appId}/player?game_url=https://localhost:${port}`);
      }
    },
  },
  entry: {
    bundle: './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Paper soccer',
      template: 'index.html',
      sdkPath: config.sdkPath,
    }),
    new CopyPlugin([
      { from: './common', to: 'common' },
      {
        from: 'fbapp-config.json', to: 'fbapp-config.json'
      }
    ]),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
};
