(
    function () {
        'use strict';
        ENTQuiz.Response = {

            fetched: false,
            items_all: [],
            items: [],
            currentPage: 1,
            lastPage: 1,

            apiPath: "",
            quiz: {},
            quizResult: {},

            initializePage: function () {
                this.fetched = false;
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apiPath + '/getQuizResponsesByPerson?quizId=' + quizId + '&absolutePath=' + location.pathname;
                    this.getQuizResponseFromDB(apiPath_item);
                }
                else {
                    console.log("Quiz not selected ");
                    if (ENTQuiz.Common.getUrlParams("quizId") == undefined)
                        $(".entQuizContainer").html("<divclass='ErrorDiv'>Quiz not selected <br/> For additional info, please contact IT helpdesk </div>");

                }
            },

            getQuizResponseFromDB: function (apiPath_item) {
                $.ajax({
                    url: apiPath_item,
                    headers: {
                        Accept: "application/json;odata=verbose"
                    },
                    async: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data_items) {
                        ENTQuiz.Response.OnGetQuizResponse_Success(data_items);
                    },
                    error: function (errordata) {
                        console.log(errordata);
                        if (errordata.responseJSON.ExceptionType == "System.UnauthorizedAccessException") {
                            $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! You do not have access to the requested resource <br /> Please contact it helpdesk if need access</div>")
                        }
                        else {
                            $(".entQuizContainer").html("<div class='ErrorDiv'> Sorry ! Error occured while fetching Quiz result. Please try again after some time. <br/> If problem persists, contact IT helpdesk.</div>");
                        }
                    },
                });
            },

            OnGetQuizResponse_Success: function (data_item) {
                //console.log("OnGetQuizResponse_Success");
                //console.log(data_item);
                if (data_item != undefined && data_item.ErrorCode == undefined) {
                    this.quizResult = data_item;
                    this.quiz = data_item.quiz;
                    this.fetched = true;

                    $(".entQuizDataLoaderMessage").hide();
                    for (let i = 0; i < this.quizResult.quizResponses.length; i++) {
                        let item = {
                            ID: 0,
                            Username: '',
                            Name: '',
                            Score: 0,
                            Percent: 0,
                            Result: '',
                            ModifiedDate: '',
                        };
                        item.ID = this.quizResult.quizResponses[i].ID;
                        item.Username = this.quizResult.quizResponses[i].Username;
                        item.Name = this.quizResult.quizResponses[i].DisplayName;
                        item.ModifiedDate = this.quizResult.quizResponses[i].ModifiedDate;
                        let score = this.getScore(this.quizResponses.quizResponses[i]);
                        this.scores.push(score);
                        item.Score = score;
                        item.Percent = (score * 100.0 / this.quiz.Questions.length).toFixed(2) + '%';
                        item.Result = (score >= this.quiz.PassScore) ? 'Pass' : 'Fail';
                        this.items_all.push(item);
                        if (score >= this.quiz.PassScore) this.passCount++;
                    }
                    this.items = this.items_all;
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
                    } else {
                        $("#divItems_MOD").html('<div class="NoRecordsFound>No records found matching the given search</div>');

                        $(".pageCounterRow_MOD").css({ "visibility": "hidden" });
                    }

                }
                else {
                    $(".page-content-wrapper_MOD").html("<div style='margin:5%;color:coral'>" + data_item.ErrorMessage + "</div>");

                }
            },

            getScore: function (quizResponse) {
                let score = 0;
                for (let i = 0; i < quizResponse.QuizQuestionResponses.length; i++) {
                    let isCorrect = true;
                    isCorrect = this.validateQuizQuestionResponse(quizResponse.QuizQuestionResponses[i]);
                    if (isCorrect) score++;
                }

                return score;

            },
            validateQuizQuestionResponse: function (quizQuestionResponse) {
                let isCorrect = false;
                let qtnList = $.grep(ENTQuiz.Response.quiz.Questions, function (data_item) {
                    return data_item.ID == quizQuestionResponse.ID
                });
                if (qtnList != null && qtnList.length > 0) {
                    let qtn = qtnList[0];

                    //Radiobutton 
                    if (qtn.DataTypeID == 1) {
                        let Specs = $.parseJSON(qtn.Specs);
                        let qtnResponse = -1;
                        qtnResponse = quizQuestionResponse.QuestionResponse != undefined ? parseInt(quizQuestionResponse.QuestionResponse) : -1;
                        let answer = $.parseJSON(qtn.Answer);
                        if (qtnResponse >= 0) {
                            isCorrect = (ENTQuiz.Response.quiz.Language == 1 ? (Specs.ar[qtnResponse].trim() == answer.ar.trim() ? true : false) : (Specs.en[qtnResponse].trim() == answer.en.trim() ? true : false));
                        }
                        return isCorrect;
                    }
                    //ImageChoice
                    else if (qtn.DataTypeID == 2) {
                        //let Specs = $.parseJSON(qtn.Specs);
                        let qtnResponse = -1;
                        qtnResponse = quizQuestionResponse.QuestionResponse != undefined &&
                            quizQuestionResponse.QuestionResponse != "" ? parseInt(quizQuestionResponse.QuestionResponse) : "";

                        if (qtn.Answer != undefined && qtn.Answer != "") {
                            let oAnswer = $.parseJSON(qtn.Answer);
                            let answer = $.parseJSON(oAnswer.ans);
                            if (qtnResponse == (answer))
                                isCorrect = true;

                        }
                        return isCorrect;
                    }
                    //Date 
                    else if (qtn.DataTypeID == 3) {

                        let qtnResponse = '';
                        qtnResponse = quizQuestionResponse.QuestionResponse;

                        let answer = $.parseJSON(qtn.Answer);
                        let date_answer = answer.ans;
                        if (qtnResponse.trim() == date_answer.trim())
                            isCorrect = true;

                        return isCorrect;
                    }
                    //Dropdown
                    else if (qtn.DataTypeID == 4) {
                        let Specs = $.parseJSON(qtn.Specs);
                        let qtnResponse = -1;
                        qtnResponse = parseInt(quizQuestionResponse.QuestionResponse);

                        let answer = $.parseJSON(qtn.Answer);
                        isCorrect = (ENTQuiz.Response.quiz.Language == 1 ? (Specs.ar[qtnResponse].trim() == answer.ar.trim() ? true : false) : (Specs.en[qtnResponse].trim() == answer.en.trim() ? true : false));

                        return isCorrect;
                    }
                    //Multicheckboxes
                    else if (qtn.DataTypeID == 5) {
                        let Specs = $.parseJSON(qtn.Specs);
                        let qtnResponse = [];;

                        qtnResponse = quizQuestionResponse.QuestionResponse != undefined && quizQuestionResponse.QuestionResponse != "" ? $.parseJSON(quizQuestionResponse.QuestionResponse) : [];
                        let answer = $.parseJSON(qtn.Answer);
                        let answer_optionsCount = (ENTQuiz.Response.quiz.Language == 1 ? answer.ar.length : answer.en.length);

                        let isAllCorrect = true;

                        if (answer_optionsCount != qtnResponse.length) isAllCorrect = false;
                        else {
                            for (let q = 0; q < qtnResponse.length; q++) {
                                if (ENTQuiz.Response.quiz.Language == 1) {
                                    if (Specs.ar[qtnResponse[q]].trim() != answer.ar[q].trim()) {
                                        isAllCorrect = false;
                                        break;
                                    }
                                }
                                else {
                                    if (Specs.en[qtnResponse[q]].trim() != answer.en[q].trim()) {
                                        isAllCorrect = false;
                                        break;
                                    }
                                }
                            }
                        }

                        return isAllCorrect;
                    }
                    //RankingQuestion
                    else if (qtn.DataTypeID == 6) {
                        let qtnResponse = [];
                        qtnResponse = quizQuestionResponse.QuestionResponse != undefined && quizQuestionResponse.QuestionResponse != "" ? $.parseJSON(quizQuestionResponse.QuestionResponse) : [];

                        let answer = $.parseJSON(qtn.Answer);

                        if (qtnResponse == undefined || qtnResponse.length != answer.ans.length) {
                            return false;
                        }
                        else {
                            for (let a = 0; a < answer.ans.length; a++) {
                                if (qtnResponse[a].RowResponse != answer.ans[a]) {
                                    return false;
                                }
                            }
                            return true;
                        }

                    }
                }

                return false;
            },


            filterData: function () {

                this.items = $.grep(this.items_all, function (e) { return ENTQuiz.Response.isMatchingResult(e); });
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
            pageDisplayItemsLimit: 10,
            filterPersonId: 0,
            filterName: '',
            filterScore: '',
            filterKeyword: '',

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

                let fmtModifiedDate;
                if (!IsNullOrUndefined(e.ModifiedDate)) fmtModifiedDate = new Date(e.ModifiedDate);

                return (this.filterKeyword == ''
                    || (e.Name != null && e.Name.toLowerCase().indexOf(this.filterKeyword) >= 0)
                    || fmtModifiedDate.format("ddd dd MMM yyyy").toLowerCase().indexOf(this.filterKeyword) >= 0

                );
            },
            scores: [],
            passCount: 0,
            renderItems: function (displayPagenum) {
                if (this.items != undefined && this.items.length > (displayPagenum - 1) * this.pageDisplayItemsLimit) {
                    $(".pageCounter_MOD").show();
                    var startIndex = (displayPagenum - 1) * this.pageDisplayItemsLimit;
                    var endIndex = startIndex + (this.pageDisplayItemsLimit - 1);

                    $(".fromRecordNum_MOD").text(startIndex + 1);
                    $(".resultsCount_MOD").text(this.items.length);
                    $(".entQuizResponseCount").text(this.items_all.length);

                    const average = array => array.reduce((a, b) => a + b) / array.length * 1.0;
                    $(".entQuizResponseAvgScore").html(average(ENTQuiz.Response.scores).toFixed(2));
                    $(".entQuizResponseHighScore").html(Math.max(...ENTQuiz.Response.scores));
                    $(".entQuizResponseLowScore").html(Math.min(...ENTQuiz.Response.scores));
                    $(".entQuizResponsePassRate").html((this.passCount * 100.0 / this.items_all.length).toFixed(2));
                    $(".entQuizResponseCountContainer").show();

                    var htmlText = this.items.map(function (o, idx) {
                        if (idx < startIndex || idx > endIndex) return "";

                        $(".toRecordNum_MOD").text(idx + 1);

                        var fmtModifiedDate;
                        if (!IsNullOrUndefined(e.ModifiedDate))
                            fmtModifiedDate = new Date(e.ModifiedDate);

                        return `
                        <div class="${((idx % 2) == 0 ? 'div-container2' : 'div-container2')} row"
                            <div data-title="ResponseId" class="ColCenterDiv col-sm-1 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Response.ShowItem(${o.ID})> ${idx + 1} </div>
                        
                            <div data-title="Name" class="ColDiv col-sm-12 col-md-5 col-lg-5 col-xl-5" 
                                onclick="ENTQuiz.Response.ShowItem(${o.ID})> 
                            
                                <span class="tooltipParent" 
                                    onmouseover="ENTQuiz.Common.showTooltip(event,this)">
                                    ${o.Name}
                                    <span class="tooltiptext">
                                    ${o.Name}
                                    </span>
                                </span>                        
                            </div>
                            <div data-title="Score" class="ColCenterDiv col-sm-12 col-md-1 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Response.ShowItem(${o.ID})> ${o.Score} </div>
                            <div data-title="Percent" class="ColCenterDiv col-sm-12 col-md-1 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Response.ShowItem(${o.ID})> ${o.Percent} </div>
                            <div data-title="Result" class="ColCenterDiv col-sm-12 col-md-1 col-lg-1 col-xl-1" 
                                    onclick="ENTQuiz.Response.ShowItem(${o.ID})> ${o.Result} </div>
                                                     
                            <div data-title="ModifiedDate" class="ColCenterDiv  col-md-4 col-lg-1 col-xl-1" 
                                onclick="ENTQuiz.Response.ShowItem(${o.ID})> 
                                ${fmtModifiedDate.format("ddd dd MMM yyyy")}
                                </div>
                        </div>`;

                    }).join('');
                    $("#divItems_MOD").html(htmlText);
                    $(".curPageInfo_MOD").html("Page " + this.currentPage);
                }
            },
            exportToExcel: function () {
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apipath + '/getQuizResponses_Export?quizId=' + quizId + '&absolutePath=' + location.pathname;
                    window.location = apiPath_item;
                }
            },
            viewResultByQuestion: function () {
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    window.location = 'viewResultByQuestion.aspx?quizId=' + quizId;
                }
            },
            viewResultByQuestion: function () {
                window.location = 'ManageQuizs.aspx';

            },
        };
    })();


$(function () {

    let inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
    if (inDesignMode == "1") {
        $(".entQuizContainer").hide();
    }
    else {
        $(".entQuizContainer").show();
        ENTQuiz.Response.apiPath = ENTQuiz.Common.webapiBaseUrl + '/Quiz';
        ENTQuiz.Response.initializePage();

        $(":input").on('focus', function () {
            $(this).attr('autocomplete', 'off')
        });
        $(".MessageField").on('animationend', function () {
            $(this).removeClass('animateMessageField');
        });
    }
});