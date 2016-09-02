$(function(){
    // common function
    function loadjs( url, callback ){
        var script = document.createElement('script');
        script.onload = callback;
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild( script );
    }
    function loadcss( url, callback ){
        var link = document.createElement('link');
        link.onload = callback;
        link.href = url;
        link.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild( link );
    }
    function setActive( $parent, $this ){
        $parent.find('.active').removeClass('active');
        $this.addClass('active');
    }

    window.isMobile = $('.mobile-menu').css('display') === 'block';
    $(window).resize(function(){
        window.isMobile = $('.mobile-menu').css('display') === 'block';
        setFooter();
    });

    // nav 导航栏滑动效果
    function nav(){
        var $nav = $('.com-header .nav');
        var $active = $nav.find('.active');
        var $slideblock = $nav.find('.slideblock');

        function changeActive( $el ){
            setActive( $nav, $el );
            setSlideblock( $el );
        }

        function setSlideblock( $el ){
            var l = $el.position().left + parseInt($el.css('paddingLeft')) + .5;
            $slideblock.css({
                width: $el.width(),
                transform: 'translate('+ l +'px,0)'
            });
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

        $(window).resize(function(){
            clearTimeout( this.timer );
            this.timer = setTimeout(function(){
                setSlideblock( $nav.find('.active') );
            }, 400 );
        });
    }
    nav();

    // footer 当页面不够高时，设置页脚为相对定位到底部
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

        // load & prettify code templates
        loadcss( '//cdn.bootcss.com/prettify/r298/prettify.min.css' );
        loadjs( '//cdn.bootcss.com/prettify/r298/prettify.min.js', function(){
            if( $('.prettyprint').length ){
                prettyPrint();
            }else if( $('.quick-getting').length ){
                'import use use-method config-default'.split(' ').forEach(function( v ){
                    $.get('/code-tpl/'+ v +'.html', function( msg ){
                        $( '.' + v ).text( msg ).addClass( 'prettyprint' );
                        prettyPrint();
                        if( v === 'use' ){
                            window.d = new Particleground.particle( '#demo', {
                                dis: 80,
                                range: 60
                            });
                        }
                    });
                });
            }
        });

    }

    // flag 必读图标的状态
    if( !/\/examples\/quick-getting/i.test( location.href ) ){
        if( !window.localStorage.getItem( 'read' ) ){
            $('.com-body >.menu >h5:eq(1)').append('<i class="essential pa">必读</i>');
        }
    }else{
        window.localStorage.setItem( 'read', true );
    }

    // mobile 移动端页面处理器
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