$(function() {
    $.dept.depts = {
        init: function() {
            $("#createDept").click($.dept.depts._createEditInit);
            $(".editDept").click($.dept.depts._createEditInit);
            $(".deleteDept").click($.dept.depts._deleteInit);
        },
        _refreshDeptsTable: function() {
            $.dept.ajax({
                url: $.dept.BASE + "/depts/deptsData",
                type: "post",
                success: function(data) {
                    var depts = data.depts;
                    var table = $("#depts > tbody"),
                        html;
                    table.empty();
                    if (depts && depts.length > 0) {
                        $.each(depts, function (index, dept) {
                            html = "<tr>"
                            // index
                            html = html + "<td>" + dept.indx + "</td>";
                            // code
                            html = html + "<td>" + dept.code + "</td>";
                            // name
                            html = html + "<td>" + dept.name + "</td>";
                            // parentName
                            html = html + "<td>" + dept.parent.name + "</td>";
                            // count
                            html = html + "<td>" + dept.cont + "</td>";
                            // op
                            html += "<td>";
                            html = html + '<a href="#" deptId="' + dept.id + '" class="editDept"><i class="fa fa-pencil"></i></a>&nbsp;';
                            html = html + '<a href="#" deptId="' + dept.id + '" class="deleteDept"><i class="fa fa-trash-o"></i></a>';
                            html += "</td>";
                            html += "</tr>"
                            table.append($(html));
                        });
                    } else {
                        table.append($("<tr><td colspan='6'>系统中没有部门。请点击<b>创建</b>按钮添加部门。</td></tr>"))
                    }
                    $(".editDept").click($.dept.depts._createEditInit);
                    $(".deleteDept").click($.dept.depts._deleteInit);
                }
            });
        },
        _createEditInit: function(e) {
            var deptId = $(this).attr("deptId");
            var data;
            e.preventDefault();
            if (deptId) {
                data = { deptId: deptId };
            }
            $.dept.ajax({
                url: $.dept.BASE + "/depts/deptInit",
                type: "post",
                data: data,
                success: function(data) {
                    $("body").append(data);
                    $("#createDeptModal").modal({
                        backdrop: "static"
                    }).modal("show");
                }
            });
        },
        _deleteInit: function(e) {
            var deptId = $(this).attr("deptId");
            e.preventDefault();
            $.dept.message.confirm(undefined, ['是否确认删除该部门', '删除后无法恢复。'], [
                $.noop, function() {
                    $.dept.depts._deleteDept(deptId);
                }
            ]);
        },
        _deleteDept: function(deptId) {
            var data = { deptId: deptId };
            $.dept.ajax({
                url: $.dept.BASE + "/depts/deptDelete",
                type: "post",
                data: data,
                success: function() {
                    $.dept.depts._refreshDeptsTable();
                }
            });
        },
        deptInit: function() {
            var self = $("#createDeptModal");
            // load deptList
            $.dept.ajax({
                url: $.dept.BASE + "/depts/all",
                type: "post",
                success: function(data) {
                    var depts = data.depts;
                    var deptSelect = $("#parentId");
                    var parentId = $("#_parentId").val();
                    deptSelect.empty();

                    // add a empty option.
                    $("<option></option>").val("").text("").appendTo(deptSelect);
                    if (depts && depts.length > 0) {
                        $.each(depts, function (index, dept) {
                            var code = dept.id,
                                name = dept.name;
                            $("<option></option>").val(code).text(name).appendTo(deptSelect);
                        });
                        if (parentId) {
                            deptSelect.val(parentId);
                        }
                    }
                }
            });

            // init button event.
            $("#save").click(function() {
                self.modal('hide');
                $.dept.ajax({
                    url: $.dept.BASE + "/depts/deptSave",
                    type: "post",
                    data: {
                        'id': $("#_deptId").val(),
                        'code': $("#deptId").val(),
                        'name': $("#deptName").val(),
                        'parentId': $("#parentId").val()
                    },
                    success: function() {
                        $.dept.depts._refreshDeptsTable();
                    }
                });
            });
            $("#cancel").click(function() {
                self.modal('hide');
            });
            self.on("hidden.bs.modal", function() {
                this.remove();
            });
        }
    };
});