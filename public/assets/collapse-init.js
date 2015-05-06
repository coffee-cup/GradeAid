(function($) {
  $(function() {

    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });


    var editPanel = $('.scotch-panel').scotchPanel({
      containerSelector: '.mark-edit-panel', /* Finds the closes parent matching this */
      direction: 'left',
      duration: 200,
      distanceX: '100%',
      enableEscapeKey: true
    });

    $('#mark-title').dblclick(function(event) {
      /* Act on the event */
      console.log('yoyooy');
      return false;
    });

    $('.collapsible-header').dblclick(function(event) {
      /* Act on the event */
      return false;
    });

  });

})(jQuery); // end of jQuery name space

