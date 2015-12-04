var home = require('./includes/home');

var app = {

  init: function() {
    home.init();
  }

}

$(document).ready( app.init );