
var Recruitment = Recruitment || {};

(function () {

    'use strict';
     
    Recruitment.Common = {
        Classifications: ['None', 'Normal', 'Important'],
        Directorates: ["D1", "D2", "D3"],
        showTooltip: function (e, elem) {
            var x = (e.clientX + 20) + 'px',
                y = (e.clientY + 20) + 'px';

            var tooltipelem = $(elem).find(".tooltiptext")[0];
            tooltipelem.style.top = y;
            tooltipelem.style.left = x;

            if ((e.clientY + tooltipelem.offsetHeight) > (window.screen.height - 50)) {
                tooltipelem.style.top = (window.screen.height - 70 - tooltipelem.offsetHeight - 100) + 'px';
            }

        },
        getUrlParams: function (paramKey) {
            var params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (let idx = 0; idx < params.length; idx++) {
                if (paramKey == params[idx].split('=')[0]) return params[i].split('=')[1];

            }
        },
        webapiBaseUrl: "http://dev.recrtuimentapp.com/api",
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
                }
            });
        },
    };
})();

(function () {

    'use strict';
    Recruitment.Manage = {

        fetched: false,
        items_all: [],
        items: [],
        currentPage: 1,
        lastPage: 1,
        pageDisplayItemsLimit: 10,
        GetItems: function (apiPath_items) {
            $.ajax({
                url: apiPath_items,
                data: {
                    absolutePath: location.pathname,
                },
                headers: {
                    Accept: "application/json;odata=verbose"
                },
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data_items) {
                    Recruitment.Manage.Getitems_Success(data_items);
                },
                error: function (errordata) {

                    console.log(errordata);
                    if (errordata.responseJSON.ExceptionType == "System.UnauthorizedAccessException") {
                        $(".modlistcontainer").html("<div class='ErrorDiv'>Sorry ! You do not have access to the requested resouce<br/> Please contact IT Helpdesk if need access </div>");
                    }
                    else {
                        $(".page-content-wrapper_MOD").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching recruitment info. Please try again after sometime <br/> If problem persists, contact IT Helpdesk if need access </div>");

                    }
                }
            });

        },

        Getitems_Success: function (data_items) {
            if (data_items.errorCode == undefined) {
                this.items_all = data_items;
                this.fetched = true;
                this.items = data_items;
                this.currentPage = 1;
                this.lastPage = 1;
                if (this.items.length > 0) {
                    this.lastPage = parseInt(this.items.length / this.pageDisplayItemsLimit) + (this.items.length % this.pageDisplayItemsLimit != 0 ? 1 : 0);

                    if (this.currentPage < this.lastPage) {
                        $(".nextPageLink_MOD").css({ "visibility": "visible" });
                        $(".lastPageLink_MOD").css({ "visibility": "visible" });
                    }
                    else {
                        $(".nextPageLink_MOD").css({ "visibility": "hidden" });
                        $(".lastPageLink_MOD").css({ "visibility": "hidden" });
                    }

                    $(".pageCounterRow_MOD").css({ "visibility": "visible" });
                    this.renderItems(this.currentPage);
                    // this.itemProjects = $.unique(dataitems.map(function(dataitem){return dataitem.Project})).sort();
                    // this.renderProjects();

                }
                else {

                    $("#divItems_MOD").html("<div class='NoRecorsFound'>No records found matching the given search</div>");
                    $(".pageCounterRow_MOD").css({ "visibility": "hidden" });
                }
            }
            else {
                $(".page-content-wrapper_MOD").html("<div style='margin:5%;color:coral'>" + data_items.ErrorMessage + "</div>");
            }
        },
        filterData: function () {

            this.items = $.grep(this.items_all, function (e) { return Recruitment.Manage.isMatchingResult(e); });
            this.currentPage = 1;
            this.lastPage = 1;

            $(".firstPageLink_MOD").css({ "visibility": "hidden" });
            $(".prevPageLink_MOD").css({ "visibility": "hidden" });
            if (this.items.length > 0) {
                this.lastPage = parseInt(this.items.length / this.pageDisplayItemsLimit) + (this.items.left % this.pageDisplayItemsLimit != 0 ? 1 : 0);

                $(".curPageInfo_MOD").css({ "visibility": "visible" });

                if (this.currentPage < this.lastPage) {
                    $(".nextPageLink_MOD").css({ "visibility": "visible" });
                    $(".lastPageLink_MOD").css({ "visibility": "visible" });
                }
                else {
                    $(".nextPageLink_MOD").css({ "visibility": "hidden" });
                    $(".lastPageLink_MOD").css({ "visibility": "hidden" });
                }

                this.renderItems(this.currentPage);

            }
            else {
                $("#divItems_MOD").html("<div class='NoRecorsFound'>No records found matching the given search</div>");
                $(".curPageInfo_MOD").css({ "visibility": "hidden" });
                $(".nextPageInfo_MOD").css({ "visibility": "hidden" });
                $(".lastPageInfo_MOD").css({ "visibility": "hidden" });

                $(".fromRecordNum_MOD").text(0);
                $(".toRecordNum_MOD").text(0);
                $(".resultsCount_MOD").text(0);
            }
        },
        sortField: '',
        sortResults: function (elem) {
            var asc = true;
            var prop = $(elem).data('fieldname');
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
            $(".sortIconLTR").removeClass("fa-sort-up");
            $(".sortIconLTR").removeClass("fa-sort-down");
            $(".sortIconLTR").addClass("fa-sort");

            if (asc) {
                $(elem).find(".sortIconLTR").removeClass("fa-sort");
                $(elem).find(".sortIconLTR").addClass("fa-sort-up");
            }
            else {

                $(elem).find(".sortIconLTR").removeClass("fa-sort");
                $(elem).find(".sortIconLTR").addClass("fa-sort-down");

            }

        },
        //Page Navigation 
        ShowFirstPage: function () {

            this.currentPage = 1;
            $(".firstPageLink_MOD").css({ "visibility": "hidden" });
            $(".prevPageLink_MOD").css({ "visibility": "hidden" });
            if (this.currentPage < this.lastPage) {
                $(".nextPageLink_MOD").css({ "visibility": "visible" });
                $(".lastPageLink_MOD").css({ "visibility": "visible" });
            }
            else {
                $(".nextPageLink_MOD").css({ "visibility": "hidden" });
                $(".lastPageLink_MOD").css({ "visibility": "hidden" });
            }
            this.renderItems(this.currentPage);
        },
        showPreviousPage: function () {
            if (this.currentPage > 1) {
                this.currentPage--;
                if (this.currentPage > 1) {
                    $(".firstPageLink_MOD").css({ "visibility": "visible" });
                    $(".prevPageLink_MOD").css({ "visibility": "visible" });
                }
                else {
                    $(".firstPageLink_MOD").css({ "visibility": "hidden" });
                    $(".prevPageLink_MOD").css({ "visibility": "hidden" });
                }
                if (this.currentPage < this.lastPage) {
                    $(".nextPageLink_MOD").css({ "visibility": "visible" });
                    $(".lastPageLink_MOD").css({ "visibility": "visible" });
                }
                else {
                    $(".nextPageLink_MOD").css({ "visibility": "hidden" });
                    $(".lastPageLink_MOD").css({ "visibility": "hidden" });
                }
                this.renderItems(this.currentPage);
            }
        },

        showNextPage: function () {

            this.currentPage++;

            $(".firstPageLink_MOD").css({ "visibility": "visible" });
            $(".prevPageLink_MOD").css({ "visibility": "visible" });


            if (this.currentPage < this.lastPage) {
                $(".nextPageLink_MOD").css({ "visibility": "visible" });
                $(".lastPageLink_MOD").css({ "visibility": "visible" });
            }
            else {
                $(".nextPageLink_MOD").css({ "visibility": "hidden" });
                $(".lastPageLink_MOD").css({ "visibility": "hidden" });
            }
            this.renderItems(this.currentPage);

        },

        ShowLastPage: function () {

            this.currentPage = this.lastPage;
            $(".firstPageLink_MOD").css({ "visibility": "visible" });
            $(".prevPageLink_MOD").css({ "visibility": "visible" });

            $(".nextPageLink_MOD").css({ "visibility": "hidden" });
            $(".lastPageLink_MOD").css({ "visibility": "hidden" });

            this.renderItems(this.currentPage);
        },
        apiPath: "",
        filterRecruitmentId: 0,
        filterdescription: '',
        filterTitle: '',
        filterKeyword: '',
        initializePage: function () {
            this.fetched = false;
            var apiPath_items = this.apiPath + '/getItems';
            this.GetItems(apiPath_items);
            $("#ddlPageDisplayItemsLimit_MOD").change(function () {
                Recruitment.Manage.pageDisplayItemsLimit = parseInt($("#ddlPageDisplayItemsLimit_MOD").val());
                Recruitment.Manage.lastPage = parseInt(Recruitment.Manage.items.length / Recruitment.Manage.pageDisplayItemsLimit) + (Recruitment.Manage.items.length % Recruitment.Manage.pageDisplayItemsLimit != 0 ? 1 : 0);
                Recruitment.Manage.ShowFirstPage();
            });

        },

        onFilterSelected: function () {
            this.filterKeyword = $("[data-filter='Keyword_MOD']").val().toLowerCase();
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
        isMatchingResult: function (e) {
            var fmtModifiedDate;
            if (!IsNullOrUndefined(e.ModifiedDate))
                fmtModifiedDate = new Date(e.ModifiedDate);
            return (this.filterKeyword == ''
                || Recruitment.Manage.getDirectorateName(e.Classification).toLowercase().indexOf(this.filterKeyword) >= 0

                //|| fmtModifiedDate.format("ddd dd MMM yyyy").toLowerCase().indexOf(this.filterKeyword) >= 0

            );
        },
        renderItems: function (displayPagenum) {
            if (this.items != undefined && this.items.length > (displayPagenum - 1) * this.pageDisplayItemsLimit) {
                $(".pageCounter_MOD").show();
                var startIndex = (displayPagenum - 1) * this.pageDisplayItemsLimit;
                var endIndex = startIndex + (this.pageDisplayItemsLimit - 1);

                $(".fromRecordNum_MOD").text(startIndex + 1);
                $(".resultsCount_MOD").text(this.items.length);

                var htmlText = this.items.map(function (o, idx) {
                    if (idx < startIndex || idx > endIndex) return "";

                    $(".toRecordNum_MOD").text(idx + 1);

                    var fmtModifiedDate;
                    if (!IsNullOrUndefined(e.ModifiedDate))
                        fmtModifiedDate = new Date(e.ModifiedDate);

                    return `
                        <div class="${((idx % 2) == 0 ? 'div-container2' : 'div-container2')} row"
                            <div data-title="RecId" class="ColCenterDiv col-md-1 col-lg-1 col-xl-1" 
                                onclick="Recruitment.Manage.ShowItem(${o.ID})> ${idx + 1} </div>
                        
                            <div data-title="Title" class="ColCenterDiv col-cm-12 col-md-3 col-lg-2 col-xl-2" 
                                onclick="Recruitment.Manage.ShowItem(${o.ID})> 
                            
                                <span class="tooltipParent" 
                                    onmouseover="Recruitment.Common.showTooltip(event,this)">
                                    ${o.Title}
                                    <span class="tooltiptext">${o.Title}</span>
                                </span>
                        
                            </div>
                            <div data-title="Actions" class="ColDiv col-md-5 col-lg-3 col-xl-3" style="padding-left:2%"
                                <a target="_blank" href="/Preview?RecId=${o.ID}" style="color:#9DC3E6;font-size:14px;" title="Preview"> View </a> &nbsp; |  &nbsp;
                                ${(o.Status == 0 ? `<a href="javascript:void(0);" onclick="Recruitment.Manage.EditItem(${o.ID})" style="color:#9DC3E6;font-size:14px;">Edit</a> &nbsp; |  &nbsp;
                                                    <a href="javascript:void(0);" onclick="Recruitment.Manage.ShowDeleteItem(${o.ID})" style="color:coral;font-size:14px;">Delete</a> &nbsp; |  &nbsp;
                                
                                                    ` : '')}
                                ${(o.Status == 1 ? `<a href="javascript:void(0);" onclick="Recruitment.Manage.ViewItem(${o.ID})" style="color:#9DC3E6;font-size:14px;">View</a> &nbsp; |  &nbsp;
                                                    <a href="javascript:void(0);" onclick="Recruitment.Manage.ShowCloseItem(${o.ID})" style="color:coral;font-size:14px;">Close</a> &nbsp; |  &nbsp;
                                
                                                    ` : '')}
                                ${(o.Status == 2 ? `<a href="javascript:void(0);" onclick="Recruitment.Manage.ViewItem(${o.ID})" style="color:#9DC3E6;font-size:14px;">View</a> &nbsp; |  &nbsp;
                                                    <a href="javascript:void(0);" onclick="Recruitment.Manage.ShowReOpenItem(${o.ID})" style="color:coral;font-size:14px;">ReOpen</a> &nbsp; |  &nbsp;
                                
                                                    ` : '')}
                            </div>
                        </div>`;

                }).join('');
                $("#divItems_MOD").html(htmlText);
                $(".curPageInfo_MOD").html("Page " + this.currentPage);
            }
        },
        getDirectorateName: function (directorateId) {
            return Recruitment.Common.Directorates[directorateId];
        },
        EditItem: function (recId) {
            location = "/EditItem?recId=" + recId;
        },
        SendMail: function (recId, subject) {
            location = `mailto:<email>?subject=${encodeURIComponent(subject)}
                        &body=Dear,%0d%0aPlease follow below link to submit your valuable response
                        %0d%0a${encodeURIComponent('/pages/submitresponse?recId' + recId)}
                        %0d%0a%0d%0aRegards,%0d%0aRecruitment Team`;
        },
        ShowItem: function (recId) {
            location = "/EditItem?recId=" + recId;
        },
        // renderTrackers:function(){
        //     if(this.itemTrackers != undefined && this.itemTrackers.length > 0){
        //         var htmlText = this.itemTrackers.map(function(item,idx){
        //             return `
        //             <div>
        //                 <input type="checkbox" value="${item}" onclick="Recruitment.Manage.onFilterSelected()" checked 
        //                         style="vertical-align:top;" />& nbsp; 
        //                 <span class="tooltipParent" onmouseover="Recruitment.Common.showTooltip(event,this)">${item} <span class="tooltiptext">${item}</span></span>
        //             </div>
        //             `;
        //         }).join('');

        //         $("#filterTrackers_MOD").html(htmlText);
        //     }
        // }
        AddItem: function () {
            location = "/CreateItem";
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
        ShowDeleteItem: function (Id) {
            $("#lblModTitle_del").html('');
            $("#lblModDescription_del").html('');
            $("#hdnRecId_del").val('');
            $(".NoRecordsFound_del").hide();
            $(".RecAcknowledgement_del").hide();

            var item = $.grep(this.items, function (e) { return e.ID == Id; });
            if (item != undefined && item.length > 0) {
                $(".detailsContainer_del_MOD").show();
                $("mdlDialog_del_MOD").modal("show");
                var recTitle = item[0].Title;
                var recDescription = item[0].Description;

                $("#lblModTitle_del").html(recTitle);
                $("#lblModDescription_del").html(recDescription);

                $("#hdnRecId_del").val(Id);
            }
            else {

                $(".detailsContainer_del_MOD").hide();
                $(".NoRecordsFound_del").show();
                $("mdlDialog_del_MOD").modal("show");
            }
        },
        DeleteItem: function () {
            var recId = $("#hdnRecId_del").val();

            if (recId != '') {
                recId = parseInt(recId);
                var apiPath_item = Recruitment.Manage.apipath + "/DeleteItem?recId=" + recId;
                $.ajax({
                    type: "POST",
                    url: apiPath_item,
                    headers: {
                        Accept: "applicaiton/json;odata=verbose"
                    },
                    async: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data_items) {
                        Recruitment.Manage.initializePage();
                        $("#hdnRecId_del").val('');
                        $("#lblModTitle_del").html('');
                        $("#lblModDescription_del").html('');

                        $(".RecAcknowledgement_del").html('Record deleted successfully');

                        $(".detailsContainer_del_MOD").hide();
                        $(".NoRecordsFound_del").hide();
                        $(".RecAcknowledgement_del").show();

                    },
                    error: function (errordata) {
                        console.log("Error occured while deleting item");
                        if (errordata.responseJSON.ExceptionType == "Recruitment.ViewMOdels.CustomException") {
                            $(".RecAcknowledgement_del").html(errordata.responseJSON.ExceptionMessage);

                            $(".detailsContainer_del_MOD").hide();
                            $(".NoRecordsFound_del").hide();
                        }
                        if (errordata.responseJSON.ExceptionType == "System.UnAuthorizedAccessException") {
                            $(".RecAcknowledgement_del").html("Sorry ! You do not have access to the requested resource. Please contaict IT helpdesk if need access");

                            $(".detailsContainer_del_MOD").hide();
                            $(".NoRecordsFound_del").hide();
                        }
                        $(".RecAcknowledgement_del").show();
                    }
                });
            }
        },

    };
})();

$(function () {
    var inDesignMode = document.forms[MSOWebPartpageForName].MSOLayout_InDesignMode.value;
    if (inDesignMode == "1")
        $(".page-content-wrapper").hide();
    else {
        $(".page-content.wrapper").show();
        Recruitment.Manage.apiPath = Recruitment.Common.webapiBaseUrl + "/Recruitment";
        Recruitment.Manage.initializePage();
    }
    $(":input").on("focus", function () {
        $(this).attr("autocomplete", "off");
    });
    $(".MessageField").on("animationend", function () {
        $(this).removeClass("animationMessageField");
    });
})
