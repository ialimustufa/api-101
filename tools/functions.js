function authenticate(passPhrase, fn) {
    if (!module.parent) console.log('authenticating %s', passPhrase);
    // query the db for the given username
    // if (!user) return fn(new Error('cannot find user'));
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    // hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
    //   if (err) return fn(err);
    //   if (hash === user.hash) return fn(null, user)
    //   fn(new Error('invalid password'));
    // });

    if (passPhrase === process.env.passPhrase) return fn(null, process.env.passPhrase);
    else return fn(new Error('invalid pass phrase'));
}

function restrict(req, res, next) {
    console.log('Restrict: ', req.session.user);
    // if (req.session.user) {

    //     next();
    // } else {
    //     req.session.error = 'Access denied!';
    //     res.redirect('/login');
    // }
    req.toLoad = (req.session.user) ? 'admin' : 'login';
    next();
};
function errorHandlingMiddleware(req, res, next) {
    var err = req.session?.error || '';
    var msg = req.session?.success || '';
    (err) ? delete req.session.error: '';
    (msg) ? delete req.session.success: '';
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
}

module.exports = {
    authenticate,
    restrict,
    errorHandlingMiddleware
};