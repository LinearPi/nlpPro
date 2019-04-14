var gsdata = (function($) {
    var core = {};
    /**
     * [_getClassName 私有方法，获取className]
     * @param  {[string]} type [提示类型]
     * @return {[string]}      [className]
     */
    core._getClassName = function(type) {
        var className = '';
        
        switch(type) {
            case 'success':
                className = 'gs-alerts-success';
                break;
            case 'warn':
                className = 'gs-alerts-warning';
                break;
            case 'error':
                className = 'gs-alerts-error';
                break;
            default :
                className = 'gs-alerts-error';
                break;
        };

        return className;
    };
    /**
     * [alerts 信息提示框]
     * @param  {[string]} msg  [提示内容]
     * @param  {[string]} type [提示类型]
     * @param  {[number]} mesc [关闭时间]
     * @return {[type]}      [description]
     */
    core.alerts = function(msg, type, mesc) {
        var mesc = mesc;
        var html = '<div class="gs-alerts ' + this._getClassName(type) + ' js_gs_alerts">' +
                '<i></i>' + msg + 
                '<button type="botton" class="gs-alerts-close js_alerts_close"><span>×</span></button>' +
            '</div>';

        // 模板插入
        $('.js_gs_alerts').remove();
        $('body').append(html);

        // 关闭时间，默认2000ms
        if (!mesc) mesc = 10000;
        setTimeout(function() {
            $('.js_gs_alerts').remove();
        }, mesc);

        // 手动关闭
        $('.js_alerts_close').click(function() {
            $(this).parent().remove();
        });
    };

    return core;
})(jQuery);