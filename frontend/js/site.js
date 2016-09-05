var localConfig = {
    plugin: {
        prettify: {
            css: '/plugin/prettify/prettify.min.css',
            js: '/plugin/prettify/prettify.min.js'
        }
    }
};
var prodConfig = {
    plugin: {
        prettify: {
            css: '//cdn.bootcss.com/prettify/r298/prettify.min.css',
            js: '//cdn.bootcss.com/prettify/r298/prettify.min.js'
        }
    }
};
var siteConfig = $.extend( true, {}, localConfig );
var isProdEnv = location.hostname !== 'localhost' &&
    location.hostname !== '127.0.0.1';
if( isProdEnv ){
    $.extend( true, siteConfig, prodConfig );
}

$(function(){
    // common function
    function loadjs( url, callback, error ){
        var script = document.createElement('script');
        script.onload = callback;
        script.onerror = error;
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild( script );
    }
    function loadcss( url, callback, error ){
        var link = document.createElement('link');
        link.onload = callback;
        link.onerror = error;
        link.href = url;
        link.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild( link );
    }
    function setActive( $parent, $this ){
        $parent.find('.active').removeClass('active');
        $this.addClass('active');
    }
    function throttle( fn, delay, must ){
        if( !delay && !must ){
            return fn;
        }
        var startTime = new Date(),
            timer;
        return function( e ){
            var context = this;
            if( delay ){
                clearTimeout( timer );
                timer = setTimeout(function(){
                    fn.call( context, e );
                }, delay );
            }else if( new Date() - startTime > must ){
                startTime = new Date();
                fn.call( context, e );
            }
        }
    }

    window.isMobile = $('.mobile-menu').css('display') === 'block';
    $(window).resize(function(){
        window.isMobile = $('.mobile-menu').css('display') === 'block';
        setFooter();
    });

    // nav PC端导航栏滑动效果
    function nav(){
        var $nav = $('.com-header .nav');
        var $active = $nav.find('.active');
        var $slideblock = $nav.find('.slideblock');

        function changeActive( $el ){
            setActive( $nav, $el );
            setSlideblock( $el );
        }

        function setSlideblock( $el ){
            if( !isMobile ){
                var l = $el.position().left + parseInt($el.css('paddingLeft')) + .5;
                $slideblock.css({
                    width: $el.width(),
                    transform: 'translate('+ l +'px,0)'
                });
            }
        }

        setSlideblock( $active );
        setTimeout(function(){
            $slideblock.addClass('animation').removeClass('hidden');
        }, 0 );

        $nav.find('a').hover(function(){
            changeActive( $(this) );
        }, function(){
            changeActive( $active );
        });

        $(window).resize(throttle( function(){
            setSlideblock( $nav.find('.active') );
        }, 400 ));
    }
    nav();

    // footer 当页面不够高时，设置页脚为绝对定位到底部
    function setFooter(){
        if( $('body').height() > $('.com-header').outerHeight() +
            $('.com-body').outerHeight() +
            $('.com-footer').outerHeight() ){
            $('.com-footer').css({
                width: '100%',
                position: 'absolute',
                zIndex: 8,
                bottom: 0
            });
        }
        $('.com-footer').show();
    }
    setFooter();

    if( $('#page-example').length ){

        // load and prettify code templates
        var loadedPrettifyHandler = function(){
            if( $('.prettyprint').length ){
                prettyPrint();
            }else if( $('.quick-getting').length ){
                'import use use-method config-default'.split(' ').forEach(function( v ){
                    $.get('/code-tpl/'+ v +'.html', function( msg ){
                        $( '.' + v ).text( msg ).addClass( 'prettyprint' );
                        prettyPrint();
                    });
                });
            }
        };
        loadcss( siteConfig.plugin.prettify.css, function () {}, function(){
            loadcss( localConfig.plugin.prettify.css );
        });
        loadjs( siteConfig.plugin.prettify.js, loadedPrettifyHandler, function(){
            loadjs( localConfig.plugin.prettify.js, loadedPrettifyHandler );
        });

        // 菜单栏固定
        (function(){
            var $win = $(window);
            var $doc = $(document);
            var $footer = $('.com-footer');
            var $menu = $('#page-example > .com-body > .menu');
            var $main = $('#page-example > .com-body > .main');
            var handler = function(){
                if( !isMobile ){
                    console.log('in');
                    var scrollTop = $win.scrollTop();
                    var clientHeight = $win.height();
                    var pageHeight = $doc.outerHeight();
                    var footerHeight = $footer.outerHeight();
                    var touchFooter = scrollTop + clientHeight > pageHeight - footerHeight;
                    $menu[ scrollTop > $main.offset().top ? 'addClass' : 'removeClass' ]('fixed');
                    $menu.css('bottom', touchFooter ? footerHeight : 0);
                }
            };
            handler();
            $win.on('resize, scroll', handler);
        })();
    }

    // flag 必读图标的状态
    if( !/\/examples\/quick-getting/i.test( location.href ) ){
        if( !window.localStorage.getItem( 'read' ) ){
            $('.com-body >.menu >h5:eq(1), .example-menu a:eq(1)').append(
                '<i class="essential">必读</i>'
            );
        }
    }else{
        window.localStorage.setItem( 'read', true );
    }

    // Demo实例的优化，控制
    (function(){
        var ctrlTpl =
            '<div class="ctrl">' +
                '<div class="btn btn-default open">开启·OPEN</div>' +
                '<div class="btn btn-default pause">暂停·PAUSE</div>' +
            '</div>';

        var handler = function( instance ){
            var $this = $(this);
            var eventType = $this.hasClass('open') ? 'open' : 'pause';
            // 如果有clientX，表示是事件处理函数，反之则是函数调用
            var instance = instance.clientX ?
                $this.parents('.instance')[0] : instance;

            if( instance.effect ){
                instance.effect[ eventType ]();
                instance.userClickPaused = eventType === 'pause';
            }
        };

        $('.instance').each(function(){
            if( $(this).attr('data-ctrl') !== 'none' ){
                $(this).append( ctrlTpl )
                    .on('click.ctrl', '.ctrl .btn', handler );
            }
        });

        $('#first-instance-ctrl').on('click', '.btn', function(){
            handler.call( this, $('.instance:first')[0] );
        });

        // 创建公共的方式用于创建并关联Demo实例
        window.bind = function( index, createInstance ){
            var $instance = $('.instance').eq( index );
            $instance[0].effect = createInstance( $instance.find('.demo')[0] );
        };

        // 检查动画元素是否在可视区内，不在则暂停运动，在则打开运动
        function checkInViewBox(){
            var scrollTop = $(window).scrollTop();
            var clientHeight= $(window).height();
            $('.instance').each(function(){
                if( this.effect && !this.userClickPaused ){
                    var $this = $(this);
                    var top = $this.offset().top;
                    var outerHeight = $this.outerHeight();

                    if( scrollTop > top + outerHeight ||
                        scrollTop + clientHeight < top ){

                        // 不在可视区范围内
                        this.effect.pause();
                    }else{
                        this.effect.open();
                    }

                }
            });
        }

        // 让所有的实例都创建完毕再执行 演示Demo的性能优化
        setTimeout(function(){
            checkInViewBox();
            var timer = null;
            function throttle(){
                clearTimeout( timer );
                timer = setTimeout(function(){
                    checkInViewBox();
                }, 200 );
            }
            $(window).resize( throttle )
                .scroll( throttle );
        }, 0 );
    })();

    // mobile 移动端页面UI、事件等处理
    function mobileHandler(){
        $('.mobile-menu').click(function(){
            $('.com-header .nav').toggleClass('menu-show');
        });

        $(document).on('click.hideMenu', function( event ){
            var $target = $(event.target);
            if( !$target.parents('.nav').length &&
                !$target.parents('.mobile-menu').length &&
                !$target.hasClass('mobile-menu') &&
                !$target.hasClass('menu-show') ){
                $('.com-header .nav').removeClass('menu-show');
            }
        });
    }
    mobileHandler();
});