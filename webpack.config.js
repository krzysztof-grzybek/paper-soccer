const fs = require('fs');
const path = require('path');
const open = require('open');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = require('./config.json');
const secret = require('./secret.json');

const ENV = process.env.NODE_ENV;
const isDev = ENV === 'test-player' || ENV === 'local';
const webpackEnv = isDev ? 'development' : 'production';
const sdkPath = ENV === 'local' ? config.mockSdkPath : config.sdkPath;

const devServerPort = 3000;
const devServerUrl = ENV === 'test-player'
  ? `https://www.facebook.com/embed/instantgames/${secret.FB_appId}/player?game_url=https://localhost:${devServerPort}`
  : `https://localhost:${devServerPort}`;

module.exports = {
  mode: webpackEnv,
  entry: {
    bundle: './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              formatter: 'stylish',
            }
          }
        ]
      },
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
    new CleanWebpackPlugin([config.buildDirectory]),
    new HtmlWebpackPlugin({
      title: 'Paper soccer',
      template: 'index.html',
      sdkPath: sdkPath,
    }),
    new CopyPlugin([
      { from: './common', to: 'common' },
      { from: './assets', to: 'assets' },
      {
        from: 'fbapp-config.json', to: 'fbapp-config.json'
      }
    ]),
  ],
  output: {
    path: path.resolve(__dirname, config.buildDirectory),
    filename: '[name].js'
  },
  devServer: {
    contentBase: `${__dirname}/${config.buildDirectory}`,
    port: devServerPort,
    https: {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
    },
    after: () => {
      open(devServerUrl);
    },
  },
  devtool: isDev ? 'inline-source-map' : false,
};
