    $(document).ready(function() {

        //Preloader
        $(window).load(function() {
            $("#loader").fadeOut();
            $("#mask").delay(1000).fadeOut("slow");
        });

        //first letter to profile image
        $(document).ready(function() {
            let intials = $('.name').text().charAt(0);
            let profileImage = $('.profile').text(intials);
        });

        //Adding fixed position to header
        $(document).scroll(function() {
            if ($(document).scrollTop() >= 500) {
                $('.navbar').addClass('navbar-fixed-top');
                $('html').addClass('has-fixed-nav');
            } else {
                $('.navbar').removeClass('navbar-fixed-top');
                $('html').removeClass('has-fixed-nav');
            }
        });

        //Home Text Slider
        $('.home-slider').flexslider({
            animation: "slide",
            directionNav: false,
            controlNav: false,
            direction: "vertical",
            slideshowSpeed: 5000,
            animationSpeed: 1000,
            smoothHeight: true,
            useCSS: false
        });

        //Elements animation
        $('.animated').appear(function() {
            var element = $(this);
            var animation = element.data('animation');
            var animationDelay = element.data('delay');
            if (animationDelay) {
                setTimeout(function() {
                    element.addClass(animation + " visible");
                    element.removeClass('hiding');
                    if (element.hasClass('counter')) {
                        element.children('.value').countTo();
                    }
                }, animationDelay);
            } else {
                element.addClass(animation + " visible");
                element.removeClass('hiding');
                if (element.hasClass('counter')) {
                    element.children('.value').countTo();
                }
            }
        }, { accY: -150 });

        //Portfolio filters
        $('#portfolio-grid').mixitup({
            effects: ['fade', 'scale'],
            easing: 'snap'
        });

        //Portfolio project slider
        function initProjectSlider() {
            $('.project-slider').flexslider({
                prevText: "",
                nextText: "",
                useCSS: false,
                animation: "slide"
            });
        }
    });
