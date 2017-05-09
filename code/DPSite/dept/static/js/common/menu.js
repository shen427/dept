$(function() {
    $.dept.menu = {
        URL : {
            DEPTS_INDEX: $.dept.BASE + "/depts/index",
            STAFFS_INDEX: $.dept.BASE + "/staffs/index"
        },
        init : function() {
            var uls = $('.sidebar-nav > ul > *').clone();
            uls.addClass('visible-xs');
            $('#main-menu').append(uls.clone());

            $(".sidebar-nav li > a").click($.dept.menu._menuItem);
        },
        _menuItem: function(e) {
            var li = $(this).parent();
            e.preventDefault();
            if ($(this).attr('data-target')) {
                return;
            }
            $(".sidebar-nav li").removeClass("active");
            li.addClass("active");

            if ($(this).is("#staff")) {
                $.dept.menu.staff.staffs();
            } else if ($(this).is("#dept")) {
                $.dept.menu.staff.depts();
            } else if ($(this).is("#project")) {
                $.dept.menu.staff.projects();
            } else if ($(this).is("#salesPlan")) {
                $.dept.menu.staff.salesPlan();
            } else if ($(this).is("#planHistory")) {
                $.dept.menu.staff.planHistory();
            } else if ($(this).is("#actualScore")) {
                $.dept.menu.staff.actualScore();
            }
        },
        staff: {
            staffs: function() {
            },
            depts: function() {
                ajaxPost(
                    $.dept.BASE + "/depts/index",
                    function(data) {
                        $("#main").html(data);
                    }
                );
            }
        },
        project: {
            projects: function() {
            }
        },
        score: {
            salesPlan: function() {
            },
            planHistory: function() {
            },
            actualScore: function() {
            }
        }
    };
});