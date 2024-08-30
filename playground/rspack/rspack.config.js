const path = require('node:path')
const rspack = require('@rspack/core')
const UnpluginInjectPreload = require('unplugin-inject-preload/rspack')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

/** @type {import('@rspack/cli').Configuration} */
const config = {
  context: __dirname,
  entry: './../src/main.ts',
  output: {
    publicPath: path.join(__dirname, 'dist'),
    filename: 'main.js',
    path: path.join(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: '[name].[hash][ext][query]',
  },
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        type: 'css',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.ts$/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
        },
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
    },
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      minify: false,
      templateContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <!--__unplugin-inject-preload__-->
        </head>
        <body>
          <h1>Hello World</h1>
        </body>
      </html>`,
    }),
    // new HtmlWebpackPlugin({
    //   inject: false,
    //   minify: false,
    //   templateContent: ({ htmlWebpackPlugin }) => `
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <!--__unplugin-inject-preload__-->
    //       ${htmlWebpackPlugin.tags.headTags}
    //     </head>
    //     <body>
    //       <h1>Hello World</h1>
    //       ${htmlWebpackPlugin.tags.bodyTags}
    //     </body>
    //   </html>
    // `,
    // }),
    UnpluginInjectPreload({
      injectTo: 'custom',
      files: [
        {
          outputMatch: /Roboto-(?:[^\n\rA-Za-z\u2028\u2029][-\da-z]*|[A-Za-z]+(?:[^\n\rA-Za-z\u2028\u2029][-\da-z]*)?)\.woff2$/,
        },
        {
          outputMatch: /^(?!main).*\.(css|js)$/,
        },
      ],
    }),
  ],
}
module.exports = config
