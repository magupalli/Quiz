
(function () {

    'use strict';
    ENTQuiz.Manage = {

        fetched: false,
        items_all: [],
        items: [],
        currentPage: 1,
        lastPage: 1,
        pageDisplayItemsLimit: 10,
        GetItems: function (apiPath_items) {
            $.ajax({
                url: apiPath_items,

                headers: {
                    Accept: "application/json;odata=verbose"
                },
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data_items) {
                    ENTQuiz.Manage.GetAdmins_Success(data_items);
                },
                error: function (errordata) {
                    ENTQuiz.Manage.getAdmins_Error(errordata);

                }
            });

        },

        GetAdmins_Success: function (data_items) {
            if (data_items.ErrorCode == undefined) {

                this.items_all = data_items;
                this.fetched = true;
                this.items = data_items;
                this.currentPage = 1;
                this.lastPage = 1;
                if (this.items.length > 0) {
                    this.lastPage = parseInt(this.items.length / this.pageDisplayItemsLimit) + (this.items.length % this.pageDisplayItemsLimit != 0 ? 1 : 0);

                    if (this.currentPage < this.lastPage) {
                        $(".nextPageLink_SVY").css({ "visibility": "visible" });
                        $(".lastPageLink_SVY").css({ "visibility": "visible" });
                    }
                    else {
                        $(".nextPageLink_SVY").css({ "visibility": "hidden" });
                        $(".lastPageLink_SVY").css({ "visibility": "hidden" });
                    }

                    $(".pageCounterRow_SVY").css({ "visibility": "visible" });
                    this.renderItems(this.currentPage);

                }
                else {

                    $("#divItems_SVY").html("<div class='NoRecorsFound'>No records found matching the given search</div>");
                    $(".pageCounterRow_SVY").css({ "visibility": "hidden" });
                }
            }
            else {
                $(".page-content-wrapper_SVY").html("<div style='margin:5%;color:coral'>" + data_items.ErrorMessage + "</div>");
            }
        },
        getAdmins_Error: function () {

            console.log(errordata);
            if (errordata.responseJSON.ExceptionType == "System.UnauthorizedAccessException") {
                $(".modlistcontainer").html("<div class='ErrorDiv'>Sorry ! You do not have access to the requested resouce<br/> Please contact IT Helpdesk if need access </div>");
            }
            else {
                $(".page-content-wrapper_SVY").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching Admins info. Please try again after sometime <br/> If problem persists, contact IT Helpdesk if need access </div>");

            }
        },
        filterData: function () {

            this.items = $.grep(this.items_all, function (e) { return ENTQuiz.Manage.isMatchingResult(e); });
            this.currentPage = 1;
            this.lastPage = 1;

            $(".firstPageLink_SVY").css({ "visibility": "hidden" });
            $(".prevPageLink_SVY").css({ "visibility": "hidden" });
            if (this.items.length > 0) {
                this.lastPage = parseInt(this.items.length / this.pageDisplayItemsLimit) + (this.items.left % this.pageDisplayItemsLimit != 0 ? 1 : 0);

                $(".curPageInfo_SVY").css({ "visibility": "visible" });

                if (this.currentPage < this.lastPage) {
                    $(".nextPageLink_SVY").css({ "visibility": "visible" });
                    $(".lastPageLink_SVY").css({ "visibility": "visible" });
                }
                else {
                    $(".nextPageLink_SVY").css({ "visibility": "hidden" });
                    $(".lastPageLink_SVY").css({ "visibility": "hidden" });
                }

                this.renderItems(this.currentPage);

            }
            else {
                $("#divItems_SVY").html("<div class='NoRecorsFound'>No records found matching the given search</div>");
                $(".curPageInfo_SVY").css({ "visibility": "hidden" });
                $(".nextPageInfo_SVY").css({ "visibility": "hidden" });
                $(".lastPageInfo_SVY").css({ "visibility": "hidden" });

                $(".fromRecordNum_SVY").text(0);
                $(".toRecordNum_SVY").text(0);
                $(".resultsCount_SVY").text(0);
            }
        },
        sortField: '',
        sortResults: function (elem) {
            var asc = true;
            var prop = $(elem).data('fieldname');
            if (prop.indexOf('StartDate') == 0) prop = prop.replace('StartDate', 'StartDateValue');
            if (prop + '#' == this.sortField) {
                this.sortField = prop;
                asc = false;
            }
            else {
                this.sortField = prop + '#';
            }
            this.items_all.sort(function (a, b) {
                if (isNaN(a[prop])) {
                    if (asc)
                        return (a[prop].toLowercase() > b[prop].toLowercase()) ? 1 : ((a[prop].toLowerCase() < b[prop].toLowercase()) ? -1 : 0);
                    else
                        return (b[prop].toLowercase() > a[prop].toLowercase()) ? 1 : ((b[prop].toLowerCase() < a[prop].toLowercase()) ? -1 : 0);
                }
                else {
                    if (asc)
                        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                    else
                        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                }
            });
            this.onFilterSelected();
            $(".HeaderDiv").removeClass("descendingIcon");
            $(".HeaderDiv").removeClass("ascendingIcon");


            if (asc) {
                $(elem).addClass("ascendingIcon");
            }
            else {
                $(elem).addClass("descendingIcon");
            }

        },
        //Page Navigation 
        ShowFirstPage: function () {

            this.currentPage = 1;
            $(".firstPageLink_SVY").css({ "visibility": "hidden" });
            $(".prevPageLink_SVY").css({ "visibility": "hidden" });
            if (this.currentPage < this.lastPage) {
                $(".nextPageLink_SVY").css({ "visibility": "visible" });
                $(".lastPageLink_SVY").css({ "visibility": "visible" });
            }
            else {
                $(".nextPageLink_SVY").css({ "visibility": "hidden" });
                $(".lastPageLink_SVY").css({ "visibility": "hidden" });
            }
            this.renderItems(this.currentPage);
        },
        showPreviousPage: function () {
            if (this.currentPage > 1) {
                this.currentPage--;
                if (this.currentPage > 1) {
                    $(".firstPageLink_SVY").css({ "visibility": "visible" });
                    $(".prevPageLink_SVY").css({ "visibility": "visible" });
                }
                else {
                    $(".firstPageLink_SVY").css({ "visibility": "hidden" });
                    $(".prevPageLink_SVY").css({ "visibility": "hidden" });
                }
                if (this.currentPage < this.lastPage) {
                    $(".nextPageLink_SVY").css({ "visibility": "visible" });
                    $(".lastPageLink_SVY").css({ "visibility": "visible" });
                }
                else {
                    $(".nextPageLink_SVY").css({ "visibility": "hidden" });
                    $(".lastPageLink_SVY").css({ "visibility": "hidden" });
                }
                this.renderItems(this.currentPage);
            }
        },

        showNextPage: function () {

            this.currentPage++;

            $(".firstPageLink_SVY").css({ "visibility": "visible" });
            $(".prevPageLink_SVY").css({ "visibility": "visible" });


            if (this.currentPage < this.lastPage) {
                $(".nextPageLink_SVY").css({ "visibility": "visible" });
                $(".lastPageLink_SVY").css({ "visibility": "visible" });
            }
            else {
                $(".nextPageLink_SVY").css({ "visibility": "hidden" });
                $(".lastPageLink_SVY").css({ "visibility": "hidden" });
            }
            this.renderItems(this.currentPage);

        },

        ShowLastPage: function () {

            this.currentPage = this.lastPage;
            $(".firstPageLink_SVY").css({ "visibility": "visible" });
            $(".prevPageLink_SVY").css({ "visibility": "visible" });

            $(".nextPageLink_SVY").css({ "visibility": "hidden" });
            $(".lastPageLink_SVY").css({ "visibility": "hidden" });

            this.renderItems(this.currentPage);
        },
        apiPath: "",
        filterAdminId: 0,
        filterAdminName: '',
        filterEmail: '',
        filterDepartment: '',
        filterKeyword: '',

        initializePage: function () {
            this.fetched = false;
            var apiPath_items = this.apiPath + '/getAdmins';
            ENTQuiz.Manage.GetItems(apiPath_items);
            $("#ddlPageDisplayItemsLimit_SVY").change(function () {
                ENTQuiz.Manage.pageDisplayItemsLimit = parseInt($("#ddlPageDisplayItemsLimit_SVY").val());
                ENTQuiz.Manage.lastPage = parseInt(ENTQuiz.Manage.items.length / ENTQuiz.Manage.pageDisplayItemsLimit) + (ENTQuiz.Manage.items.length % ENTQuiz.Manage.pageDisplayItemsLimit != 0 ? 1 : 0);
                ENTQuiz.Manage.ShowFirstPage();
            });
        },

        onFilterSelected: function () {
            this.filterAdminId = $("[data-filter='AdminId_SVY']").val().toLowerCase();
            this.filterAdminName = $("[data-filter='AdminName_SVY']").val().toLowerCase();
            this.filterEmail = $("[data-filter='Email_SVY']").val().toLowerCase();
            this.filterDepartment = $("[data-filter='Department_SVY']").val().toLowerCase();
            this.filterKeyword = $("[data-filter='Keyword_SVY']").val().toLowerCase();
            this.filterData();
        },
        selectAllChecks: function (columnname) {
            $('#' + columnname + ' input:checkbox').prop('checked', true);
            this.onFilterSelected();
        },
        clearAllChecks: function (columnname) {
            $('#' + columnname + ' input:checkbox').prop('checked', false);
            this.onFilterSelected();
        },

        clearAllInputs: function (columnname) {
            $('#' + columnname + ' input').prop('value', '');
            this.onFilterSelected();
        },
        isMatchingResult: function (e) {


            return (this.filterAdminId == '' || e.IDText.toLowerCase().indexOf(this.filterAdminId) >= 0) &&
                (this.filterAdminName == '' || e.DisplayName.toLowerCase().indexOf(this.filterAdminName) >= 0) &&
                (this.filterEmail == '' || e.Email.toLowerCase().indexOf(this.filterEmail) >= 0) &&
                (this.filterDepartment == '' || e.DeptText.toLowerCase().indexOf(this.filterDepartment) >= 0) &&
                (this.filterKeyword == ''
                    || e.IDText.toLowerCase().indexOf(this.filterKeyword) >= 0
                    || e.DisplayName.toLowerCase().indexOf(this.filterKeyword) >= 0
                    || e.Email.toLowerCase().indexOf(this.filterKeyword) >= 0
                    || e.DeptText.toLowerCase().indexOf(this.filterKeyword) >= 0

                );
        },
        renderItems: function (displayPagenum) {
            if (this.items != undefined && this.items.length > (displayPagenum - 1) * this.pageDisplayItemsLimit) {
                $(".pageCounter_SVY").show();
                var startIndex = (displayPagenum - 1) * this.pageDisplayItemsLimit;
                var endIndex = startIndex + (this.pageDisplayItemsLimit - 1);

                $(".fromRecordNum_SVY").text(startIndex + 1);
                $(".resultsCount_SVY").text(this.items.length);

                var htmlText = this.items.map(function (o, idx) {
                    if (idx < startIndex || idx > endIndex) return "";

                    $(".toRecordNum_SVY").text(idx + 1);

                    var fmtStartDate;
                    if (!IsNullOrUndefined(e.StartDate))
                        fmtStartDate = new Date(e.StartDate);

                    return `
                        <div class="${((idx % 2) == 0 ? 'div-container2' : 'div-container2')} row"
                            <div data-title="QuizId" class="ColCenterDiv col-md-4 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})> ${o.ID} </div>
                        
                            <div data-title="Title" class="ColDiv col-sm-12 col-md-3 col-lg-3 col-xl-3" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})>                             
                                <span class="tooltipParent" 
                                    onmouseover="ENTQuiz.Common.showTooltip(event,this)">
                                    ${o.DisplayName}
                                    <span class="tooltiptext">
                                    ${o.DisplayName}
                                    </span>
                                </span>                        
                            </div>
                            <div data-title="Email" class="ColDiv col-sm-12 col-md-5 col-lg-4 col-xl-4" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})>                             
                                <span class="tooltipParent" 
                                    onmouseover="ENTQuiz.Common.showTooltip(event,this)">
                                    ${o.Email}
                                    <span class="tooltiptext">
                                    ${o.Email}
                                    </span>
                                </span>                        
                            </div>
                            <div data-title="DeptName" class="ColDiv col-sm-12 col-md-4 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})>                             
                                <span class="tooltipParent" 
                                    onmouseover="ENTQuiz.Common.showTooltip(event,this)">
                                    ${o.DeptText}
                                    <span class="tooltiptext">
                                    ${o.DeptText}
                                    </span>
                                </span>                        
                            </div>
                            <div data-title="Status" class="ColCenterDiv  col-md-4 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})> 
                                ${(o.IsActive ? 'Active' : 'Disabled')}
                            </div>

                            <div data-title="Actions" class="ColCenterDiv  col-md-4 col-lg-2 col-xl-2"> 
                                <a href="javascript:void(0)" onclick="ENTQuiz.Manage.ShowChangeStatus(${o.ID})" class="btn btn-primary">${(o.IsActive ? 'Disable' : 'Enable')}</a>
                            </div>
                        </div>`;

                }).join('');
                $("#divItems_SVY").html(htmlText);
                $(".curPageInfo_SVY").html("Page " + this.currentPage);
            }
        },


        isNewItem: function (dateValue) {
            if (dateValue != undefined && dateValue != '') {
                var now = Date();
                var givenDate = new Date(dateValue);
                var diff = now.getTie - givenDate.getTime();
                var years = Math.floor(diff / (1000 * 60 * 60 * 24 * 30 * 12));
                diff -= years * ((1000 * 60 * 60 * 24 * 30 * 12));

                var months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
                diff -= months * ((1000 * 60 * 60 * 24 * 30));

                var days = Math.floor(diff / (1000 * 60 * 60 * 24));

                return years == 0 && months == 0 && days < 5;
            }
            return false;
        },
        clearAdminStatusInfo: function () {
            $("#spnAdminName").html('');
            $("#spnDeptName").html('');
            $("#spnNewStatus").html('');
            $("#hdnAdminId").val(0);
            $("#hdnAdminDeptId").val(0);
            $("#hdnCurrentStatus").val('');
            $("#divAdminChangeStatusAcknowledgement").html('');
        },
        ShowChangeStatus: function (adminId) {
            ENTQuiz.Manage.clearAdminStatusInfo();
            $("#mdlDialog_ChangeAdminStatus_SVY").modal("show");

            var apiPath_item = ENTQuiz.Manage.apiPath + "/getAdmin?adminId=" + adminId;
            $.ajax({
                type: "POST",
                url: apiPath_item,
                headers: {
                    Accept: "application/json;odata=verbose"
                },
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data_items) {

                    $("#spnAdminName").html(data_item.DisplayName);
                    $("#spnDeptName").html(data_item.DeptText);
                    $("#spnNewStatus").html('<b>' + (data_item.IsActive ? 'Disable' : 'Enable') + '</b>');
                    $("#hdnAdminId").val(data_item.ID);
                    $("#hdnAdminDeptId").val(data_item.DeptId);
                    $("#hdnCurrentStatus").val(data_item.IsActive ? 1 : 0);
                },
                error: function (errordata) {
                    console.log(errordata);

                    $(".divAdminChangeStatusAcknowledgement").show();

                    if (errordata.responseJSON.ExceptionType == "System.UnAuthorizedAccessException") {
                        $(".divAdminChangeStatusAcknowledgement").html("<div class='ErrorDiv'>Sorry ! You do not have access to the requested resource. Please contact IT helpdesk if need access</div>");
                    }
                    else {
                        $(".divAdminChangeStatusAcknowledgement").html("<div class='ErrorDiv'>Sorry ! error occured while fetching Admin Info. Plese try again after sometime. <br /> If problem persists, contact IT helpdesk</div>");
                    }
                }
            });
        },

        changeAdminStatus: function () {
            var hdnAdminId = parseInt($("#hdnAdminId").val());
            var hdnCurrentStatus = parseInt($("#hdnCurrentStatus").val());

            let admin = {
                ID: hdnAdminId,
                IsActive: (hdnCurrentStatus == 1 ? false : true),
            };


            if (hdnAdminId != 0) {
                var apiPath_item = ENTQuiz.Manage.apiPath + "/changeAdminStatus";
                $.ajax({
                    type: "POST",
                    url: apiPath_item,
                    data: admin,
                    headers: {
                        Accept: "application/json;odata=verbose"
                    },
                    async: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data_items) {
                        ENTQuiz.Manage.clearAdminStatusInfo();
                        $(".divChangeAdminStatus").hide();

                        $(".divAdminChangeStatusAcknowledgement").html('<div style="color:#fff;font-size:14px">Admin status updated successfully</div>');

                        $(".divAdminChangeStatusAcknowledgement").show();

                    },
                    error: function (errordata) {
                        console.log("Error occured while deleting item");

                        if (errordata.responseJSON.ExceptionType == "System.UnAuthorizedAccessException") {
                            $(".divAdminChangeStatusAcknowledgement").html("Sorry ! You do not have access to the requested resource. Please contact IT helpdesk if need access");
                        }
                        else {
                            $(".divAdminChangeStatusAcknowledgement").html("<div class='ErrorDiv'>" + errordata.responseJSON.ExceptionMessage + "</div>");
                        }
                        $(".divChangeAdminStatus").hide();
                        $(".divAdminChangeStatusAcknowledgement").show();
                    }
                });
            }
        },

        showAddAdmin: function () {
            ENTQuiz.Manage.ClearEmpSearch();
            $("#divSearchAdmin").show();
            $("#mdlDialog_Addadmin_SVY").modal('show');

            $(".divAdminAddedConfirmation").hide();
            $(".divAdminAddingError").html('');
            $(".divAdminAddingError").hide();
            $(".divSearchAdmin").show();
        },
        ClearEmpSearch: function () {
            $("#txtEmpSearchText").val('');
            $("#txtSelectedEmpLogin").val('');
            $("#ddlempSearchList").empty();
            $(".divSearchList").hide();
            $("#ddlDepartment")[0].selectedIndex = 0;
            return false;
        },
        SearchEmployees: function () {
            $("#ddlempSearchList").empty();
            $("#txtSelectedEmpLogin").val('');
            let searchText = $("#txtEmpSearchText").val();
            let apiPath_items = ENTQuiz.Manage.apiPath + '/getEmployees?searchText' + encodeURIComponent(searchText);

            ENTQuiz.Common.GetItems(apiPath_items,
                ENTQuiz.Manage.searchEmpoyees_Success,
                ENTQuiz.Manage.searchEmpoyees_Error);
            return false;
        },
        searchEmpoyees_Success: function (data_items) {
            if (data_items.ErrorCode == undefined) {
                let items = data_items;
                if (items.length > 0) {
                    $(items).each(function (idx, item) {
                        $("#ddlempSearchList").append(
                            $('<option/>').val(item.LoginName).text(item.DisplayName + ' < ' + item.Email + ' > ')
                        );
                    });
                    $(".divSearchList").show();
                } else {
                    $("#ddlempSearchList").empty();
                    $(".divSearchList").hide();
                }
            }
            else {

            }
        },
        searchEmpoyees_Error: function (errordata) {
            console.log(errordata);
        },
        setSelectedEmployee: function () {
            $("#txtEmpsearchText").val($("#ddlempSearchList").find(":selected").text());
            $("#txtSelectedEmpLogin").val($("#ddlempSearchList").find(":selected").val());
        },
        createAdmin: function () {
            let deptId = parseInt($("ddlDepartment").val());
            let admin = {
                LoginName: $("#txtSelectedEmpLogin").val(),
                DeptId: deptId,
            };

            var apiPath_item = ENTQuiz.Manage.apiPath + "/createAdmin";
            $.ajax({
                type: "POST",
                url: apiPath_item,
                data: admin,
                headers: {
                    Accept: "application/json;odata=verbose"
                },
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data_items) {
                    ENTQuiz.Manage.clearEmpSearch();
                    $(".divSearchAdmin").hide();
                    $(".divAdminAddingError").hide();
                    $(".divAdminAddedConfirmation").show();
                },
                error: function (errordata) {
                    console.log("Error occured while adding admin");

                    if (errordata.responseJSON.ExceptionType == "System.UnAuthorizedAccessException") {
                        $(".divAdminAddingError").html("Sorry ! You do not have access to the requested resource. Please contact IT helpdesk if need access");
                    }
                    else {
                        $(".divAdminAddingError").html("<div class='ErrorDiv'>" + errordata.responseJSON.ExceptionMessage + "</div>");
                    }
                    $(".divSearchAdmin").hide();
                    $(".divAdminAddedConfirmation").hide();
                    $(".divAdminAddingError").show();
                }
            });
        },
    };
})();

$(function () {
    var inDesignMode = document.forms[MSOWebPartpageForName].MSOLayout_InDesignMode.value;
    if (inDesignMode == "1")
        $(".page-content-wrapper").hide();
    else {
        $(".page-content.wrapper").show();
        ENTQuiz.Manage.apiPath = ENTQuiz.Common.webapiBaseUrl + "/Quiz";
        ENTQuiz.Manage.initializePage();
    }
    $(":input").on("focus", function () {
        $(this).attr("autocomplete", "off");
    });
    $(".MessageField").on("animationend", function () {
        $(this).removeClass("animationMessageField");
    });
})

