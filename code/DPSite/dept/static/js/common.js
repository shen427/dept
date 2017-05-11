$(function() {
    $.dept = {
        BASE: '/dept',
        MSG_TEMPLATE:
            '<div class="modal small fade" id="msgModal" tabindex="-1" role="dialog" aria-labelledby="msgModalLabel" aria-hidden="true">' +
            '    <div class="modal-dialog">'+
            '        <div class="modal-content">' +
            '            <div class="modal-header">' +
            '                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '                <h3 id="msgModalLabel">{title}</h3>' +
            '            </div>' +
            '            <div class="modal-body">' +
            '                <p class="error-text">' +
            '                    <i class="fa {icon} modal-icon"></i>{msg}' +
            '                </p>' +
            '            </div>' +
            '            <div class="modal-footer">' +
            '            {btnsHtml}' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>'
    };

    $.dept.initHeight = function() {
        var wHeight = document.documentElement.clientHeight;
        $(".main-content").height(wHeight - 100);
        $(window).resize(function() {
            var wHeight = document.documentElement.clientHeight;
            $(".main-content").height(wHeight - 100);
        });
    };

    $.dept.message = {
        _message: function(type, title, messages, callbacks) {
            // icon
            var icon,
                i,
                btnHtml = "",
                msg = "",
                html,
                modal = $("#msgModal");
            if (modal.length > 0) {
                modal.empty().remove();
            }
            switch (type) {
                case "info":
                    icon = "fa-info";
                    btnHtml += '<button class="btn btn-primary" aria-hidden="true">确定</button>';
                    break;
                case "warn":
                    icon = "fa-warning";
                    btnHtml += '<button class="btn btn-primary" aria-hidden="true">确定</button>';
                    break;
                case "confirm":
                    icon = "fa-warning";
                    btnHtml += '<button class="btn btn-default" aria-hidden="true">取消</button>';
                    btnHtml += '<button class="btn btn-primary" aria-hidden="true">确定</button>';
                    break;
                case "error":
                    icon = "fa-window-close";
                    btnHtml += '<button class="btn btn-primary" aria-hidden="true">确定</button>';
                    break;
                default:
                    icon = "fa-info";
                    btnHtml += '<button class="btn btn-primary" aria-hidden="true">确定</button>';
                    break;
            }
            // messages
            if (messages) {
                if ($.isArray(messages)) {
                    for (i = 0; i < messages.length; i++) {
                        if (i > 0) {
                            msg += "<br/>";
                        }
                        msg += messages[i];
                    }
                } else {
                    msg += messages;
                }
            }

            // message html
            html = $.dept.MSG_TEMPLATE
                .replace("{icon}", icon)
                .replace("{title}", title)
                .replace("{msg}", msg)
                .replace("{btnsHtml}", btnHtml);
            modal = $(html);
            $("body").append(modal);

            // callbacks
            if (callbacks && !$.isArray(callbacks)) {
                callbacks = [callbacks];
            }
            $(".modal-footer > button").each(function(index, item) {
                $(item).click(function() {
                    var callback = callbacks[index];
                    if (callback) {
                        callback.apply(null);
                    }
                    modal.modal('hide');
                    //modal.empty().remove();
                });
            });
            modal.on("hidden.bs.modal", function() {
                this.remove();
            });

            // open modal message
            modal.modal({
                backdrop: "static"
            }).modal('show');
        },
        info: function(title, messages, callback) {
            title = title || "信息";
            $.dept.message._message("info", title, messages, callback);
        },
        warn: function(title, messages, callback) {
            title = title || "警告";
            $.dept.message._message("warn", title, messages, callback);
        },
        confirm: function(title, messages, callbacks) {
            title = title || "确认";
            $.dept.message._message("confirm", title, messages, callbacks);
        },
        error: function(title, messages, callback) {
            title = title || "错误";
            $.dept.message._message("error", title, messages, callback);
        }
    };

    $.dept.ajax = function(option) {
        var type = option.type || "post";
        if (option.type === "post") {
            ajaxPost(option.url, option.data, option.success);
        } else {
            ajaxGet(option.url, option.data, option.success);
        }
    };
});