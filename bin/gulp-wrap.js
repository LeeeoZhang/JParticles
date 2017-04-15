const through = require('through2');

const methods = require('./methods');
const pkg = require('../package.json');
const VERSION = pkg.version;

const UMDHeader = `
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        factory();
    }
}(function () {
    // Compatible with old browsers, such as IE8.
    // Prevent them from throwing an error.
    // This is not a good way, will be removed in the future.
    if (!document.createElement('canvas').getContext) {
        window.JParticles = {};
        if (typeof define === 'function' && define.amd) {
            define(function () {
                return window.JParticles;
            });
        }
        return;
    }
`;

const UMDFooter = `
    // AMD 加载方式放在头部，factory 函数会比后面的插件延迟执行
    // 导致后面的插件找不到 JParticles 对象而报错
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return JParticles;
        });
    } else {
        return JParticles;
    }
}));
`;

module.exports = () => {
    return through.obj((file, encoding, callback) => {
        let content = file.contents.toString();
        const filename = file.path.replace(/.+[\\|/](\w+)\.js$/,'$1');

        const prototypes = [];
        methods.forEach(item => {
            prototypes.push(
                `window.JParticles.${filename}.prototype.${item} = function(){};`
            );
        });

        if (file.path.indexOf('jparticles.js') !== -1) {
            content = content.replace(/(version\s?=\s?)null/, `$1'${VERSION}'`);
            content = UMDHeader + content + UMDFooter;
        } else {
            content = `
                +function () {
                    // Compatible with old browsers, such as IE8.
                    // Prevent them from throwing an error.
                    if (!document.createElement('canvas').getContext) {
                        window.JParticles.${filename} = function(){};
                        ${prototypes.join('\n')}
                        return;
                    }
                    ${content}
                }();
            `;
        }

        file.contents = new Buffer(content);

        callback(null, file);
    });
};