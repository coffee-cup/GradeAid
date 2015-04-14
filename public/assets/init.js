(function($) {
  $(function() {

    // plugin init
    $('.button-collapse').sideNav({
      menuWidth: 240,
      activationWidth: 70
    });
  });

  $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

})(jQuery); // end of jQuery name space

