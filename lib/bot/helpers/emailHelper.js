'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var emailHelper = {
  validateEmail: function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@keenethics.com$/;
    return re.test(email);
  },
  validateName: function validateName(name) {
    if (name.length < 4 || name.length > 20) return false;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))$/;
    return re.test(name);
  },
  checkEmailOnTags: function checkEmailOnTags(email) {
    var re = /<a(.*?)a>/i;
    return re.test(email);
  },
  getEmailOutOfTag: function getEmailOutOfTag(emailWithTag) {
    var re = /<a(.*?)>/i;
    var email = emailWithTag.split(re)[2].split('</a>')[0];
    return email;
  }
};

exports.default = emailHelper;