
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let debug

module.exports = (env, agrv) => {
    const debug = (agrv.mode || 'development') === 'development';
    var plugins = [new webpack.HashedModuleIdsPlugin()];

    if (debug) {
        // tạo file cache cho các file js bundle => lần sau build sẽ nhanh hơn.
        plugins.push(new HardSourceWebpackPlugin({
            cacheDirectory: './.cache/hard-source/[confighash]',
            cachePrune: {
                maxAge: 60 * 60 * 1000,
                sizeThreshold: 20 * 1024 * 1024
            },
        }));
    }

    plugins.push(new MiniCssExtractPlugin({
        filename: debug ? 'dev/[name].css' : 'dist/[contenthash:8].css',
        chunkFilename: debug ? 'dev/[id].css' : 'dist/[contenthash:8].css'
    }));


    plugins.push(new HtmlWebpackPlugin({
        hash: true,
        title: 'Home',
        chunks: ['home'],
        template: './App/views/home/index.html',
        filename: './views/index.hbs'
    }));
    //
    var config = {
        mode: agrv.mode,

        watch: debug,

        devtool: debug ? 'source-map' : false,

        // ưu tiên các thư mục được bundle
        resolve: {
            modules: [process.cwd(), './App', 'node_modules'],
        },

        //chỉ định các file đầu vào js.
        entry: {
            home: [
                "babel-polyfill",
                './App/src/home/home.js'
            ]
        },

        output: {
            //file mới được tạo ra bởi html template thì publicPath sẽ có <script src='/publicPath/filename' ></script
            publicPath: '/',
            //thư mục lưu trữ các file js được bundle
            path: path.resolve(process.cwd(), './public'),
            // tên file js được bundle tạo ra
            filename: debug ? 'dev/[name].js' : 'dist/[contenthash:8].js',
        },

        plugins: plugins,

        //Mặc định webpack chỉ xác định xử lí bundle file js nếu muốn các loại file khác cũng có thể bundle và import hay require thì 
        //sử dụng module.
        module: {
            rules: [{
                //một string hoặc biểu thức chính quy cho kiểu file muốn chỉ định
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                "targets": {
                                    "browsers": ["last 2 versions", "IE >= 11"],
                                    "node": "current"
                                },
                                "modules": "commonjs",
                                "loose": false
                            }]
                        ],
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|ico)$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: debug ? './dev/css/[name].[hash].[ext]' : './dist/css/[name].[hash].[ext]',
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: process.env.NODE_ENV === 'development',
                    },
                }, {
                    loader: 'css-loader',
                    options: {
                        //sourceMap: debug
                    }
                },
                //   'postcss-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        //sourceMap: debug
                    }
                }],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: debug ? './dev/image/[name].[hash].[ext]' : './dist/image/[name].[hash].[ext]',
                        }
                    },
                ],
            },
            {
                test: /\.(less)$/,
                use: [{
                    loader: "style-loader",
                    options: {
                        //sourceMap: debug
                    }
                }, {
                    loader: "css-loader",
                    options: {
                        //sourceMap: debug,
                    },
                }, {
                    loader: "less-loader",
                    options: {
                        //sourceMap: debug
                    }
                }]
            }]
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
            }
        },
    }
    return config;
}