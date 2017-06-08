# 开发文档

### 目录说明

    bin:         构建任务
    docs:        开发文档需知
    samples:     样本开发/测试目录
    test:        自动化测试目录
    dev:         开发目录
    production:  产品目录

### 分支说明

    docs-1.x:    1.x API 存档
    master:      开发分支
	release:     发布代码到 GitHub Releases 的分支
    npm-publish: 发布代码到 NPM 的分支

### 流程

##### 1、运行命令： `npm run dev`
监听 `dev` 文件夹下 `js` 文件的改变，生成编译好的文件放进 `production` 目录。

##### 2、命令会自动打开默认页面，对应 `samples` 文件夹下的 `html` 页面。

- 当监听到文件改变，浏览器自动刷新。
- 修改浏览器 `URL`，对应文件开发。

##### 3、修改 `package.json` 里的版本号，运行命令：`npm run build`
将完成好的作品，压缩到 `production` 目录，并进行自动化测试。



