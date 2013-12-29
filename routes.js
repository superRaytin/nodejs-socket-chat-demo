/**
 * routes.js.
 * User: raytin
 * Date: 13-12-28
 */


module.exports = function(app){
    app.get('/', function(req, res){
        res.render('index', {
            title: 'socket chat'
        })
    });
}