
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
                    ENTQuiz.Manage.GetItemsList_Success(data_items);
                },
                error: function (errordata) {

                    console.log(errordata);
                    if (errordata.responseJSON.ExceptionType == "System.UnauthorizedAccessException") {
                        $(".modlistcontainer").html("<div class='ErrorDiv'>Sorry ! You do not have access to the requested resouce<br/> Please contact IT Helpdesk if need access </div>");
                    }
                    else {
                        $(".page-content-wrapper_MOD").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching quiz info. Please try again after sometime <br/> If problem persists, contact IT Helpdesk if need access </div>");

                    }
                }
            });

        },

        GetItemsList_Success: function (data_items) {
            if (data_items.ErrorCode == undefined) {
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

            this.items = $.grep(this.items_all, function (e) { return ENTQuiz.Manage.isMatchingResult(e); });
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
        filterQuizId: 0,
        filterDescription: '',
        filterLanguage: '',
        filterStartDate: '',
        filterTitle: '',
        filterKeyword: '',

        initializePage: function () {
            this.fetched = false;
            var apiPath_items = this.apiPath + '/getQuizs';
            this.GetItems(apiPath_items);
            $("#ddlPageDisplayItemsLimit_MOD").change(function () {
                ENTQuiz.Manage.pageDisplayItemsLimit = parseInt($("#ddlPageDisplayItemsLimit_MOD").val());
                ENTQuiz.Manage.lastPage = parseInt(ENTQuiz.Manage.items.length / ENTQuiz.Manage.pageDisplayItemsLimit) + (ENTQuiz.Manage.items.length % ENTQuiz.Manage.pageDisplayItemsLimit != 0 ? 1 : 0);
                ENTQuiz.Manage.ShowFirstPage();
            });

        },

        onFilterSelected: function () {
            this.filterQuizId = $("[data-filter='QuizId_MOD']").val().toLowerCase();
            this.filterTitle = $("[data-filter='Title_MOD']").val().toLowerCase();
            this.filterLanguage = $("[data-filter='Language_MOD']").val().toLowerCase();
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
        clearAllInputs: function (columnname) {
            $('#' + columnname + ' input').prop('value', '');
            this.onFilterSelected();
        },
        isMatchingResult: function (e) {


            return (this.filterKeyword == ''
                || e.IDText.toLowerCase().indexOf(this.filterKeyword) >= 0
                || e.Description.toLowerCase().indexOf(this.filterKeyword) >= 0
                || e.Title.toLowerCase().indexOf(this.filterKeyword) >= 0

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
                            <div data-title="QuizId" class="ColCenterDiv col-md-4 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})> ${idx + 1} </div>
                        
                            <div data-title="Title" class="ColDiv col-sm-12 col-md-3 col-lg-2 col-xl-2" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})> 
                            
                                <span class="tooltipParent" 
                                    onmouseover="ENTQuiz.Common.showTooltip(event,this)">
                                    ${(o.Language == 1 ? o.Title : (o.Language == 2 ? o.Title_En : (o.Language == 3 ? (o.Title + '/' + o.Title_En) : "N/A")))}
                                    <span class="tooltiptext">
                                    ${(o.Language == 1 ? o.Title : (o.Language == 2 ? o.Title_En : (o.Language == 3 ? (o.Title + '/' + o.Title_En) : "N/A")))}
                                    </span>
                                </span>                        
                            </div>
                            <div data-title="Directorate" class="ColCenterDiv col-sm-12 col-md-1 col-lg-2 col-xl-2" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})> ${ENTQuiz.Manage.getDirectorateName(o.RequestingDirectorate)} </div>
                            <div data-title="Language" class="ColCenterDiv  col-md-4 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})> 
                                ${(o.Language == 1 ? "Arabic" : (o.Language == 2 ? "English" : (o.Language == 3 ? "Both" : "N/A")))}
                                </div>
                            <div data-title="Status" class="ColCenterDiv  col-md-4 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})> 
                                ${(o.Status == 0 ? "Draft" : (o.Status == 1 ? "Ready" : "N/A"))}
                                </div>
                            <div data-title="ModifiedDate" class="ColCenterDiv  col-md-4 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Manage.ShowItem(${o.ID})> 
                                ${fmtModifiedDate.format("ddd dd MMM yyyy")}
                                </div>
                            <div data-title="Actions" class="ColDiv col-md-5 col-lg-3 col-xl-3" style="padding-left:2%">
                                <a target="_blank" href="/SubmitResponsePreview?quizId=${o.ID}" style="color:#9DC3E6;font-size:14px;" title="Preview"> View </a> &nbsp; |  &nbsp;
                                ${(o.Status == 0 ? `<a href="javascript:void(0);" onclick="ENTQuiz.Manage.EditItem(${o.ID})" style="color:#9DC3E6;font-size:14px;" title="Edit">Edit</a> &nbsp; |  &nbsp;
                                                    <a href="javascript:void(0);" onclick="ENTQuiz.Manage.configureBranching(${o.ID})" style="color:#9DC3E6;font-size:14px;" title="Edit">Branching</a> &nbsp; |  &nbsp;
                                                    <a href="javascript:void(0);" onclick="ENTQuiz.Manage.addImageChoices(${o.ID})" style="color:#9DC3E6;font-size:14px;" title="Edit">Images</a> &nbsp; |  &nbsp;
                                                    <a href="javascript:void(0);" onclick="ENTQuiz.Manage.ShowDeleteItem(${o.ID})" style="color:coral;font-size:14px;">Delete</a> &nbsp; |  &nbsp;
                                                    ` : '')}
                                ${(o.Status == 1 ? `<a href="javascript:void(0);" onclick="ENTQuiz.Manage.ViewResults(${o.ID})" style="color:#9DC3E6;font-size:14px;" title="View results" >Results</a> &nbsp; |  &nbsp;
                                                    <a href="javascript:void(0);" onclick="ENTQuiz.Manage.SendMail(${o.ID},'${(o.Language == 1 ? o.Title : (o.Language == 2 ? o.Title_En : (o.Language == 3 ? o.Title + "/" + o.Title_En : "N/A")))}')" style="color:#9DC3E6;font-size:14px;" title="mail quiz link" >Link</a> &nbsp; |  &nbsp;
                                                    <a href="javascript:void(0);" onclick="ENTQuiz.Manage.ShowCloseItem(${o.ID})" style="color:coral;font-size:14px;" title="Close">Close</a> &nbsp; |  &nbsp;
                                
                                                    ` : '')}
                                ${(o.Status == 2 ? `<a href="javascript:void(0);" onclick="ENTQuiz.Manage.ViewResults(${o.ID})" style="color:#9DC3E6;font-size:14px;" title="View results" >Results</a> &nbsp; |  &nbsp;
                                                    <a href="javascript:void(0);" onclick="ENTQuiz.Manage.ShowReOpenItem(${o.ID})" style="color:coral;font-size:14px;">ReOpen</a> &nbsp; |  &nbsp;
                                                    ` : '')}
                            </div>
                        </div>`;

                }).join('');
                $("#divItems_MOD").html(htmlText);
                $(".curPageInfo_MOD").html("Page " + this.currentPage);
            }
        },
        getDirectorateName: function (directorateId) {
            return ENTQuiz.Common.Directorates[directorateId];
        },
        ViewResults: function (quizId) {
            window.location = 'ViewResult.aspx?quizId=' + quizId;
        },
        EditItem: function (quizId) {
            location = "EditQuiz?quizId=" + quizId;
        },
        SendMail: function (quizId, subject) {
            location = `mailto:<email>?subject=${encodeURIComponent(subject)}
                        &body=Dear,%0d%0aPlease follow below link to submit your valuable response
                        %0d%0a${encodeURIComponent(_spPgeContextInfo.webAbsoluteUrl + '/pages/quiz/submitresponse.aspx?quizId' + quizId)}
                        %0d%0a%0d%0aRegards,%0d%0aQuiz Team`;
        },
        configureBranching: function (quizId) {
            location = "ConfigureBranching.aspx?quizId=" + quizId;
        },
        addImageChoices: function (quizId) {
            location = "AddImageFiles.aspx?quizId=" + quizId;
        },
        // renderTrackers:function(){
        //     if(this.itemTrackers != undefined && this.itemTrackers.length > 0){
        //         var htmlText = this.itemTrackers.map(function(item,idx){
        //             return `
        //             <div>
        //                 <input type="checkbox" value="${item}" onclick="ENTQuiz.Manage.onFilterSelected()" checked 
        //                         style="vertical-align:top;" />& nbsp; 
        //                 <span class="tooltipParent" onmouseover="ENTQuiz.Common.showTooltip(event,this)">${item} <span class="tooltiptext">${item}</span></span>
        //             </div>
        //             `;
        //         }).join('');

        //         $("#filterTrackers_MOD").html(htmlText);
        //     }
        // }
        ShowItem: function (Id) {
            $("#lblModTitle").html('');
            $("#lblModDescription").html('');
            let item = $.grep(this.items, function (e) { return e.ID == Id; });
            if (item != undefined && item.length > 0) {
                $(".detailsContainer_View_MOD").show();
                $(".NoRecordsFound_ViewItem").hide();
                $("#mdlDialog_View_MOD").modal("show");
                let modTitle = (item[0].Language == 1 ? item[0].Title : (item[0].Language == 2 ? item[0].Title_En : (item[0].Language == 3 ? item[0].Title + '/' + item[0].Title_En : "N/A")));
                let modDescription = (item[0].Language == 1 ? item[0].Description : (item[0].Language == 2 ? item[0].Description_En : (item[0].Language == 3 ? item[0].Description + '/' + item[0].Description_En : "N/A")));
                $("#lblModTitle").html(modTitle);
                $("#lblModDescription").html(modDescription);
            }
            else {
                $(".detailsContainer_View_MOD").hide();
                $(".NoRecordsFound_ViewItem").show();
                $("#mdlDialog_View_MOD").modal("show");
            }
        },
        AddItem: function () {
            location = "/CreateQuiz.aspx";
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
            $("#hdnQuizId_Delete").val('');
            $(".NoRecordsFound_DeleteItem").hide();
            $(".QuizAcknowledgement_Delete").hide();

            var item = $.grep(this.items, function (e) { return e.ID == Id; });
            if (item != undefined && item.length > 0) {
                $(".detailsContainer_Delete_MOD").show();
                $("#mdlDialog_Delete_MOD").modal("show");
                let modTitle = (item[0].Language == 1 ? item[0].Title : (item[0].Language == 2 ? item[0].Title_En : (item[0].Language == 3 ? item[0].Title + '/' + item[0].Title_En : "N/A")));
                let modDescription = (item[0].Language == 1 ? item[0].Description : (item[0].Language == 2 ? item[0].Description_En : (item[0].Language == 3 ? item[0].Description + '/' + item[0].Description_En : "N/A")));

                $("#lblModTitle_del").html(modTitle);
                $("#lblModDescription_del").html(modDescription);

                $("#hdnQuizId_Delete").val(Id);
            }
            else {

                $(".detailsContainer_Delete_MOD").hide();
                $(".NoRecordsFound_DeleteItem").show();
                $("#mdlDialog_Delete_MOD").modal("show");
            }
        },

        ShowCloseItem: function (Id) {
            $("#lblModTitle_close").html('');
            $("#lblModDescription_close").html('');
            $("#hdnQuizId_Close").val('');
            $(".NoRecordsFound_CloseItem").hide();
            $(".QuizAcknowledgement_Close").hide();

            var item = $.grep(this.items, function (e) { return e.ID == Id; });
            if (item != undefined && item.length > 0) {
                $(".detailsContainer_Close_MOD").show();
                $("#mdlDialog_Close_MOD").modal("show");
                let modTitle = (item[0].Language == 1 ? item[0].Title : (item[0].Language == 2 ? item[0].Title_En : (item[0].Language == 3 ? item[0].Title + '/' + item[0].Title_En : "N/A")));
                let modDescription = (item[0].Language == 1 ? item[0].Description : (item[0].Language == 2 ? item[0].Description_En : (item[0].Language == 3 ? item[0].Description + '/' + item[0].Description_En : "N/A")));

                $("#lblModTitle_close").html(modTitle);
                $("#lblModDescription_close").html(modDescription);

                $("#hdnQuizId_Close").val(Id);
            }
            else {

                $(".detailsContainer_Close_MOD").hide();
                $(".NoRecordsFound_CloseItem").show();
                $("#mdlDialog_Close_MOD").modal("show");
            }
        },

        ShowReOpenItem: function (Id) {
            $("#lblModTitle_reopen").html('');
            $("#lblModDescription_reopen").html('');
            $("#hdnQuizId_ReOpen").val('');
            $(".NoRecordsFound_ReOpenItem").hide();
            $(".QuizAcknowledgement_ReOpen").hide();

            var item = $.grep(this.items, function (e) { return e.ID == Id; });
            if (item != undefined && item.length > 0) {
                $(".detailsContainer_ReOpen_MOD").show();
                $("#mdlDialog_ReOpen_MOD").modal("show");
                let modTitle = (item[0].Language == 1 ? item[0].Title : (item[0].Language == 2 ? item[0].Title_En : (item[0].Language == 3 ? item[0].Title + '/' + item[0].Title_En : "N/A")));
                let modDescription = (item[0].Language == 1 ? item[0].Description : (item[0].Language == 2 ? item[0].Description_En : (item[0].Language == 3 ? item[0].Description + '/' + item[0].Description_En : "N/A")));

                $("#lblModTitle_reopen").html(modTitle);
                $("#lblModDescription_reopen").html(modDescription);

                $("#hdnQuizId_ReOpen").val(Id);
            }
            else {

                $(".detailsContainer_ReOpen_MOD").hide();
                $(".NoRecordsFound_ReOpenItem").show();
                $("#mdlDialog_ReOpen_MOD").modal("show");
            }
        },
        DeleteItem: function () {
            var quizId = $("#hdnQuizId_Delete").val();

            if (quizId != '') {
                quizId = parseInt(quizId);
                var apiPath_item = ENTQuiz.Manage.apiPath + "/deleteQuiz?quizId=" + quizId + '&absolutePath=' + location.pathname;
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
                        ENTQuiz.Manage.initializePage();
                        $("#hdnQuizId_Delete").val('');
                        $("#lblModTitle_del").html('');
                        $("#lblModDescription_del").html('');

                        $(".QuizAcknowledgement_Delete").html('Record deleted successfully');

                        $(".detailsContainer_Delete_MOD").hide();
                        $(".NoRecordsFound_DeleteItem").hide();
                        $(".QuizAcknowledgement_Delete").show();

                    },
                    error: function (errordata) {
                        console.log("Error occured while deleting item");
                        if (errordata.responseJSON.ExceptionType == "ENTHubQuiz.QuizAPI.ViewModels.CustomException") {
                            $(".QuizAcknowledgement_Delete").html(errordata.responseJSON.ExceptionMessage);

                            $(".detailsContainer_Delete_MOD").hide();
                            $(".NoRecordsFound_DeleteItem").hide();
                        }
                        if (errordata.responseJSON.ExceptionType == "System.UnAuthorizedAccessException") {
                            $(".QuizAcknowledgement_Delete").html("Sorry ! You do not have access to the requested resource. Please contact IT helpdesk if need access");

                            $(".detailsContainer_Delete_MOD").hide();
                            $(".NoRecordsFound_DeleteItem").hide();
                        }
                        $(".QuizAcknowledgement_Delete").show();
                    }
                });
            }
        },

        CloseItem: function () {
            var quizId = $("#hdnQuizId_Close").val();

            if (quizId != '') {
                quizId = parseInt(quizId);
                var apiPath_item = ENTQuiz.Manage.apiPath + "/closeQuiz?quizId=" + quizId + '&absolutePath=' + location.pathname;
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
                        ENTQuiz.Manage.initializePage();
                        $("#hdnQuizId_Close").val('');
                        $("#lblModTitle_close").html('');
                        $("#lblModDescription_close").html('');

                        $(".QuizAcknowledgement_Close").html('Record closed successfully');

                        $(".detailsContainer_Close_MOD").hide();
                        $(".NoRecordsFound_CloseItem").hide();
                        $(".QuizAcknowledgement_Close").show();

                    },
                    error: function (errordata) {
                        console.log("Error occured while closing item");
                        if (errordata.responseJSON.ExceptionType == "ENTHubQuiz.QuizAPI.ViewModels.CustomException") {
                            $(".QuizAcknowledgement_Close").html(errordata.responseJSON.ExceptionMessage);

                            $(".detailsContainer_Close_MOD").hide();
                            $(".NoRecordsFound_CloseItem").hide();
                        }
                        if (errordata.responseJSON.ExceptionType == "System.UnAuthorizedAccessException") {
                            $(".QuizAcknowledgement_Close").html("Sorry ! You do not have access to the requested resource. Please contact IT helpdesk if need access");

                            $(".detailsContainer_Close_MOD").hide();
                            $(".NoRecordsFound_CloseItem").hide();
                        }
                        $(".QuizAcknowledgement_Close").show();
                    }
                });
            }
        },

        ReOpenItem: function () {
            var quizId = $("#hdnQuizId_ReOpen").val();

            if (quizId != '') {
                quizId = parseInt(quizId);
                var apiPath_item = ENTQuiz.Manage.apiPath + "/reOpenQuiz?quizId=" + quizId + '&absolutePath=' + location.pathname;
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
                        ENTQuiz.Manage.initializePage();
                        $("#hdnQuizId_ReOpen").val('');
                        $("#lblModTitle_reopen").html('');
                        $("#lblModDescription_reopen").html('');

                        $(".QuizAcknowledgement_ReOpen").html('Record re-opened successfully');

                        $(".detailsContainer_ReOpen_MOD").hide();
                        $(".NoRecordsFound_ReOpenItem").hide();
                        $(".QuizAcknowledgement_ReOpen").show();

                    },
                    error: function (errordata) {
                        console.log("Error occured while re-opening item");
                        if (errordata.responseJSON.ExceptionType == "ENTHubQuiz.QuizAPI.ViewModels.CustomException") {
                            $(".QuizAcknowledgement_ReOpen").html(errordata.responseJSON.ExceptionMessage);

                            $(".detailsContainer_ReOpen_MOD").hide();
                            $(".NoRecordsFound_ReOpenItem").hide();
                        }
                        if (errordata.responseJSON.ExceptionType == "System.UnAuthorizedAccessException") {
                            $(".QuizAcknowledgement_ReOpen").html("Sorry ! You do not have access to the requested resource. Please contact IT helpdesk if need access");

                            $(".detailsContainer_ReOpen_MOD").hide();
                            $(".NoRecordsFound_ReOpenItem").hide();
                        }
                        $(".QuizAcknowledgement_ReOpen").show();
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

