const emailHelper = {
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@keenethics.com$/;
    return re.test(email);
  },


  validateName(name) {
    if (name.length < 4 || name.length > 20) return false;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))$/;
    return re.test(name);
  },


  checkEmailOnTags(email) {
    let re = /<a(.*?)a>/i;
    return re.test(email);
  },


  getEmailOutOfTag(emailWithTag) {
    let re = /<a(.*?)>/i;
    let email = emailWithTag.split(re)[2].split('</a>')[0];
    return email;
  }
};

export default emailHelper;