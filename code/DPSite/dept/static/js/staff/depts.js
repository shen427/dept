$(function() {
    $.dept.depts = {
        init: function() {
            $("#createDept").click($.dept.depts._createEditInit);
            $(".editDept").click($.dept.depts._createEditInit);
            $(".deleteDept").click($.dept.depts._deleteInit);
            $.dept.initHeight();
            debugger;
            $.dept.depts._initDeptTree();
        },
        _initDeptTree: function() {
            var tableDiv = $("#deptContainer");
            var table = $("#depts > tbody");
            tableDiv.hide();
            $.dept.ajax({
                url: $.dept.BASE + "/depts/deptsTree",
                success: function(data) {
                    $("#tree").treeview({
                        data: $.dept.depts._toTreeData(data.contents),
                        onNodeSelected: function(e, d) {
                            tableDiv.show();
                            $("#_currentParentId").val(d.id);
                            $.dept.depts._refreshDeptsTable();
                        },
                        onNodeUnselected : function(e, d) {
                            table.empty();
                            tableDiv.hide();
                            $("#_currentParentId").val('');
                        }
                    });
                    $.dept.depts._refreshDeptsTable();
                }
            });
        },
        _toTreeData: function(data) {
            var pos = {};
            var tree = [];
            var i = 0;
            while(data.length != 0) {
                if (!data[i].pid) {
                    tree.push({
                        id: data[i].id,
                        text: data[i].text,
                        nodes: []
                    });
                    pos[data[i].id] = [tree.length-1];
                    data.splice(i,1);
                    i--;
                } else {
                    var posArr = pos[data[i].pid];
                    if(posArr != undefined) {
                        var obj = tree[posArr[0]];
                        for(var j = 1; j < posArr.length; j++) {
                            obj = obj.nodes[posArr[j]];
                        }

                        obj.nodes.push({
                            id: data[i].id,
                            text: data[i].text,
                            nodes: []
                        });
                        pos[data[i].id] = posArr.concat([obj.nodes.length-1]);
                        data.splice(i,1);
                        i--;
                    }
                }
                i++;
                if(i > data.length - 1) {
                    i = 0;
                }
            }
            $.dept.depts._removeEmptySubNodes(tree);
            return tree;
        },
        _removeEmptySubNodes : function(treeNodes){
            $.each(treeNodes, function() {
                if (this.nodes) {
                    if (this.nodes.length > 0) {
                        $.dept.depts._removeEmptySubNodes(this.nodes);
                    } else {
                        delete this["nodes"];
                    }
                }
            });
        },
        _refreshDeptsTable: function() {
            var parentId = $("#_currentParentId").val(),
                table = $("#depts > tbody");
            table.empty();
            if (!parentId) {
                return;
            }
            var data = {
                parentId: parentId
            };
            $.dept.ajax({
                url: $.dept.BASE + "/depts/deptsData",
                type: "post",
                data : data,
                success: function(data) {
                    var depts = data.depts,
                        html;
                    if (depts && depts.length > 0) {
                        $.each(depts, function (index, dept) {
                            html = "<tr>"
                            // index
                            html = html + "<td>" + dept.indx + "</td>";
                            // code
                            html = html + "<td>" + dept.code + "</td>";
                            // name
                            html = html + "<td>" + dept.name + "</td>";
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
                    $.dept.depts._initDeptTree();
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
                    if (depts && depts.length > 0) {
                        $.each(depts, function (index, dept) {
                            var id = dept.id,
                                code = dept.code,
                                name = dept.name;
                            $("<option></option>").val(id).text(code + ":" + name).appendTo(deptSelect);
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
                        'parentId': $("#_currentParentId").val()
                    },
                    success: function() {
                        $.dept.depts._initDeptTree();
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