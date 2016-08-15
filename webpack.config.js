
let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

const VERSION = '1.0.0';
const COPYRIGHT = `
    Particleground.js v${ VERSION } (https://github.com/Barrior/Particleground.js)
    Copyright 2016 Barrior <Barrior@qq.com>
    Licensed under the MIT (https://opensource.org/licenses/mit-license.php)
`;

module.exports = {
    entry: {
        main: ''
    },
    output: {
        path: '',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                //排除node.js模块的js文件
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        //加版权信息
        new webpack.BannerPlugin( COPYRIGHT )
    ],
    resolve: {
        root: __dirname,
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            jq : 'src/js/jquery.js'
        }
    },
    devServer: {
        //本地服务器所加载的页面所在的目录
        contentBase: "./assets",
        //终端中输出结果为彩色
        colors: true,
        //不跳转
        historyApiFallback: true,
        //实时刷新
        inline: true
    }
};
/*
 Loaders需要单独安装并且需要在webpack.config.js下的 module->loaders 关键字下进行配置
 Loaders的配置选项包括以下几方面：
     test：一个匹配loaders所处理的文件的拓展名的正则表达式，必须
     loader：loader的名称，必须
     include/exclude: 手动添加必须处理的文件/文件夹，或屏蔽不需要处理的文件/文件夹，可选
     query：为loaders提供额外的设置选项，可选

 Loaders:
    css:
        webpack提供两个工具处理样式表，css-loader 和 style-loader，二者处理的任务不同，css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能,style-loader将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。

 Plugins:
        要使用某个插件，我们需要通过npm安装它，然后要做的就是在webpack配置中的plugins关键字部分添加该插件的一个实例（plugins是一个数组）继续看例子，我们添加了一个实现版权声明的插件。
    HtmlWebpackPlugin:
        这个插件的作用是依据一个简单的模板，帮你生成最终的Html5文件，这个文件中自动引用了你打包后的JS文件。每次编译都在文件名中插入一个不同的哈希值。
        npm install --save-dev html-webpack-plugin

 resolve:
    root: 查找module的话从这里开始查找，绝对路径
    extensions: 自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    alias: 模块别名定义，方便后续直接引用别名，无须多写长长的地址

 devserver配置选项:
     port: 设置默认监听端口，如果省略，默认为'8080'
     inline: 设置为true，当源文件改变时会自动刷新页面
     colors: 设置为true，使终端输出的文件为彩色的
     contentBase:
        默认webpack-dev-server会为根文件夹提供本地服务器，
        如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录(本例设置到'assets'目录)
     historyApiFallback:
        在开发单页应用时非常有用，它依赖于HTML5 history API，
        如果设置为true，所有的跳转将指向index.html
 */
/*
 npm一次性安装多个依赖模块,安装Babel
 npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
 */