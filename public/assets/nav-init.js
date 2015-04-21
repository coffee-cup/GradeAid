(function($) {
  $(function() {

    // plugin init
    $('.button-collapse').sideNav({
      menuWidth: 240,
      activationWidth: 70
    });

    FastClick.attach(document.body);
  });

})(jQuery); // end of jQuery name space

