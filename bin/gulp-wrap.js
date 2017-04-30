const through = require('through2');
const pkg = require('../package.json');
const VERSION = pkg.version;

const UMDHeader = `+function() {`;
const UMDFooter = `
    // AMD 加载方式放在头部，factory 函数会比后面的插件延迟执行
    // 导致后面的插件找不到 JParticles 对象而报错
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return JParticles;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = JParticles;
    }
}();
`;

module.exports = () => {
    return through.obj((file, encoding, callback) => {
        let content = file.contents.toString();
        // const filename = file.path.replace(/.+[\\|/](\w+)\.js$/,'$1');

        if (file.path.indexOf('jparticles.js') !== -1) {
            content = content.replace(/(version\s?=\s?)null/, `$1'${VERSION}'`);
            content = UMDHeader + content + UMDFooter;
        } else {
            content = `+function () { ${content} }();`;
        }

        file.contents = new Buffer(content);

        callback(null, file);
    });
};