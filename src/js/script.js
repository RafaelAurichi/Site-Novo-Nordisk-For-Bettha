/* global $ */
import $ from 'jquery';
import Tab from 'bootstrap';
import LazyLoad from 'vanilla-lazyload';
import { slick } from 'slick-carousel';

var lazyLoadInstance = new LazyLoad({
    elements_selector: '.lazy'
});

$(function() {
    function support_format_webp() {
      var elem = document.createElement('canvas');
      if (!!(elem.getContext && elem.getContext('2d'))) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
      } else {
        return false;
      }
    }

    if (!support_format_webp()) {
      $('body').addClass('webp-not-supported');
    }

    $('.scrollme').on('click', function (event) {
        event.preventDefault();
        var $hash = $(this.hash);
        $('html, body').animate({
            scrollTop: $hash.offset().top,
        }, 300);
    });

    $(window).on('scroll', function(e) {
        var scroll = $(window).scrollTop();
        if ( scroll > $('#ouzzi').offset().top - window.innerHeight ) {
            $('.inscricao-mobile-fixed').css('bottom', scroll - $('#ouzzi').offset().top + window.innerHeight);
        } else {
            $('.inscricao-mobile-fixed').css('bottom', '0px' );
        }
    }).trigger('scroll');

    $('.slider-beneficios').slick({
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        adaptiveHeight: true,
        dots: false,
        arrows: true,
        prevArrow: '<div class="slick-prev"><img src="img/beneficios-arrow.svg" /></div>',
        nextArrow: '<div class="slick-next"><img src="img/beneficios-arrow.svg" /></div>',
    });
});