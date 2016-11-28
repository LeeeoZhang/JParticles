# 开发文档


## 目录说明

    dev: 开发目录
    production: 输入的产品目录


## 流程

##### 1、运行命令： `npm run dev` 或 `gulp pack-pjs`
监听`dev`文件夹下js文件的改变，打包出`particleground.all.js`文件。

##### 2、在`samples`文件夹下找到相应的html页面，预览开发。
还没用到单元测试，惭愧啊。

*3、修改`package.json`的版本号，运行命令：`npm run prod` 或 `gulp build-prod`
将完成好的作品，压缩到production目录。*

