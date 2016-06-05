//snow.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        sin = Math.sin,
        radian = Math.PI / 180,
        pi2 = Math.PI * 2;

    function Wave( selector, options ){
        if( !util.createCanvas( selector, this ) ){
            return;
        }
        this.set = util.extend( {}, Wave.configDefault, options );

        this.dots = [];
        this.createDot();
        this.draw();
        this.resize();
    }

    Wave.configDefault = {
        //全局透明度
        opacity: 1,
        //线条颜色
        //color: [],
        color: ['rgba(0, 190, 112, .9)', 'rgba(0, 190, 112, .6)', 'rgba(0, 190, 112, .3)'],
        //线条个数
        num: 3,
        //线条宽度
        lineWidth: [],
        //波峰数值,容器一半高*此数值
        crest: 1,
        //波纹个数
        rippleNum: 3,
        //运动速度
        speed: 2,
        //线条中点到元素顶部的距离，(0, 1)表示容器的倍数，[1, +∞)表示具体数值
        offsetTop: .7,
        //自适应窗口尺寸变化
        resize: true
    };


    Wave.prototype = {
        version: '1.0.0',
        createDot: function(){
            var set = this.set,
                ch = this.ch,
                crest = this.ch / 2 * set.crest,
                lineNum = set.num,
                dotsNum = this.cw,
                dots = [],

                calc = ( set.max - set.min ) / dotsNum;

            for( var i = 0; i < lineNum; i++ ){

                //var scale = 1 - i / set.num;
                var	line = [];
                var y = set.offsetTop;
                if( y > 0 && y < 1 ){
                    y = y * ch + 10 * i;
                }

                for( var j = 0; j < dotsNum; j++ ){
                    line.push({
                        x: j,
                        y: y,
                        //y: j / dotsNum * crest * scale,
                        //y: ch / ( 30 - 27.6 * j / dotNum ),
                        angle: j,
                    });
                }

                dots.push( line );

            }

            this.dots = dots;
        },
        getAttr: function( attr, i ){
            var set = this.set;
            var val = set[attr][i];
            if( !val ){
                switch ( attr ){
                    case 'color':
                        val = util.randomColor();
                        break;
                    case 'lineWidth':
                        val = 1;
                        break;
                }
                set[attr].push( val );
            }
            return val;
        },
        draw: function(){
            var self = this,
                set = this.set,
                cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                a = ch / 6,
                speed = set.speed;

            cxt.clearRect( 0, 0, cw, ch );
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function( lineDots, i ){
                cxt.save();
                cxt.beginPath();
                lineDots.forEach(function( v, j ){
                    if( j ){
                        //y = A sin（ ωx + φ ）+ h
                        //cxt.lineTo(200, 200)
                        cxt.lineTo( v.x, 100 * sin( v.angle * radian ) + v.y );
                    }else{
                        //cxt.moveTo(20, 200)
                        cxt.moveTo( v.x, 100 * sin( v.angle * radian ) + v.y );
                    }
                    v.angle -= speed;
                });
                cxt.strokeStyle = self.getAttr( 'color', i );
                cxt.lineWidth = self.getAttr( 'lineWidth', i );
                cxt.stroke();
                cxt.restore();
            });

            this.requestAnimationFrame();
        }
    };

    //继承公共方法，如pause，open
    Particleground.extend( Wave.prototype );
    //添加实例
    Particleground.wave = Wave.prototype.constructor = Wave;
}( window, Particleground );