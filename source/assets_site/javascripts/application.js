// Do not write any JS here!

//= require 'frameworks/jquery-1.11.2'
//= require 'custom/underscore'
//= require 'custom/jquery.stellar'

//= require 'custom/jquery.cookie'
//= require 'custom/mixpanel-tracking'

$.cookie.json = true;

$(document).ready(function ($) {
  $(window).stellar({
    responsive: true,
    horizontalScrolling: false
  });
});

$(document).ready(function() {
  var menu = $('.nav-menu');
  var menuToggle = $('.mobile-nav-menu');

  $(menuToggle).on('click', function(e) {
    menu.slideToggle();
  });
});