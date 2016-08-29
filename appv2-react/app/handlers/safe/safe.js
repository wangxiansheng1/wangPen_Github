var React = require('react');

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
                    console.log("safe");
                    return func.apply(this, args);
                } catch (e) {
                    // 这里捕捉到React渲染报错，你可以啥都不做
                    // 也可以将错误信息直接渲染在页面 
                    // ErrorResult是你自定义的错误展示组件 msg是你自定义的错误信息
                    // const error = {
                    //     msg
                    // };
                    // return (
                    //     <ErrorResult {error} {...this.props} />
                    // )
                }
            }
        }
    });
    target._isSafe = true;
}