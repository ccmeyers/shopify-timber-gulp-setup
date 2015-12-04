var $ = require('jquery');

var home = {

  init: function() {
    this.yourFunction();
  },

  yourFunction: function() {
    console.log('inside home.js');
  }
}

module.exports = home;