
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Medex' });
};

/*
 * GET login page.
 */

exports.login = function(req, res){
  res.render('login', { title: 'Login' });
};