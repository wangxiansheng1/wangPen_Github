var React = require('react');

var ErrorResult = require("ErrorResult");

module.exports = function(target) {
    var p = target.prototype;
    var list = [
        'render',
        'componentWillMount'
    ];
    list.forEach(name => {
        if (name in p && typeof p[name] === 'function') {
            var func = p[name];
            p[name] = function(...args) {
                try {
                    return func.apply(this, args);
                } catch (e) {
                    const error = {
                        msg
                    };
                    return (
                        <ErrorResult {error} {...this.props} />
                    )
                }
            }
        }
    });
    target._isSafe = true;
}