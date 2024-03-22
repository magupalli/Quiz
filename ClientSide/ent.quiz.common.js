var ENTQuiz = ENTQuiz || {};
(function () {
    'use strict';
    ENTQuiz.Common = {
        Classifications: ['-None-',
            'Normal',
            'Confidential',
            'Top Priority'],
        Directorates: ["-None-",
            "Finance",
            "Procurement",
            "Sales",
            "Support",
            "Admin"
        ],
        showToolTip: function (e, elem) {
            let x = (e.clientX + 20) + 'px',
                y = (e.clientY - 10) + 'px';
            let tooltipelem = $(elem).find(".tooltip")[0];
            tooltipelem.style.top = y;
            tooltipelem.style.left = x;
            if ((e.clientY + tooltipelem.offsetHeight) > (window.screen.height - 50)) {
                tooltipelem.style.top = (window.screen.height - 7 - - tooltipelem.offsetHeight - 100) + 'px';
            }
        },
        getUrlParams: function (paramKey) {
            let params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (let i = 0; i < params.length; i++) {
                if (paramKey == params[i].split('=')[0]) return params[i].split('=')[1];
            }
            return null;
        },
        webapiBaseUrl: "http://testquizsvcs.org.com/api",
        GetItems: function (apiPath, success, error) {
            $.ajax({
                url: apiPath,
                headers: {
                    Accept: "application/json;odata=verbose"
                },
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data_items) {
                    success(data_items);
                },
                error: function (errordata) {
                    error(errordata);
                },
            });
        },
    };
})();