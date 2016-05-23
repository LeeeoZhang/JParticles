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
        color: [util.randomColor(), util.randomColor(), util.randomColor()],
        //线条个数
        num: 3,
        //线条宽度
        lineWidth: 1,
        //波峰数值,容器一半高*此数值
        crest: 1,
        //运动速度
        speed: 6,
        //自适应窗口尺寸变化
        resize: true
    };


    Wave.prototype = {
        version: '1.0.0',
        createDot: function(){
            var set = this.set,
                ch = this.ch,
                crest = this.ch / 2 * set.crest,
                num = set.num,
                dotsNum = this.cw / 2,
                dots = [],

                calc = ( set.max - set.min ) / dotsNum;

            for( var i = 0; i < num; i++ ){

                var scale = 1 - i / set.num;
                var	arr = [];

                for( var j = 0; j < dotsNum; j++ ){
                    arr.push({
                        x: j * 2,
                        y: j / dotsNum * crest * scale,
                        //y: ch / ( 30 - 27.6 * j / dotNum ),
                        angle: j,
                        //r: j * calc  + set.min
                        r: 1
                    });
                }

                dots.push( arr );

            }

            this.dots = dots;
        },
        draw: function(){
            var set = this.set,
                cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                halfCH = ch / 2,
                speed = set.speed;

            cxt.clearRect( 0, 0, cw, ch );
            cxt.globalAlpha = set.opacity;

            /*cxt.save();
            cxt.beginPath();
            cxt.moveTo(20, 200);
            cxt.stroke();
            cxt.restore();
            cxt.save();
            cxt.beginPath();
            cxt.lineTo(200, 200);
            cxt.stroke();
            cxt.restore();*/

            this.dots.forEach(function( lineDots, i ){
                var color = set.color[i];
                cxt.save();
                cxt.beginPath();
                lineDots.forEach(function( v, j ){
                    if( j ){
                        //cxt.lineTo(200, 200)
                        cxt.lineTo( v.x, v.y * sin( v.angle * radian ) + halfCH );
                    }else{
                        //cxt.moveTo(20, 200)
                        cxt.moveTo( v.x, v.y * sin( v.angle * radian ) + halfCH );
                    }
                    v.angle -= speed;
                });
                cxt.strokeStyle = color;
                cxt.stroke();
                cxt.restore();
            });
            /*this.dots.forEach(function( lineDots, i ){
                var color = set.color[i];
                lineDots.forEach(function( v, j ){
                    cxt.save();
                    cxt.beginPath();
                    cxt.arc(
                        v.x,
                        //y = A sin（ ωx + φ ）+ h
                        v.y * sin( v.angle * radian ) + halfCH,
                        v.r, 0, pi2
                    );
                    cxt.fillStyle = color;
                    cxt.fill();
                    cxt.restore();
                    v.angle -= speed;
                });
            });*/

            //this.requestAnimationFrame();
        }
    };

    //继承公共方法，如pause，open
    Particleground.extend( Wave.prototype );
    //添加实例
    Particleground.wave = Wave.prototype.constructor = Wave;
}( window, Particleground );