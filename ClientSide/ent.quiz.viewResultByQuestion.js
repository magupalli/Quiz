(
    function () {
        'use strict';
        ENTQuiz.Response = {

            userLanguage: 0,
            apiPath: "",
            quiz: {},
            quizResult: {},
            fetched: false,

            initializePage: function () {
                this.fetched = false;
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apiPath + '/getQuizResponsesByQuestion?quizId=' + quizId + '&absolutePath=' + location.pathname;
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
            SetUserLanguage: function (langID) {
                this.userLanguage = langID;
                $(".entQuizLanguage").hide();
                this.renderQuiz();
                return false;
            },
            OnGetQuizResponse_Success: function (data_item) {
                //console.log("OnGetQuizResponse_Success");
                //console.log(data_item);
                if (data_item != undefined && data_item.ErrorCode == undefined) {
                    this.quizResult = data_item;
                    this.quiz = data_item.quiz;
                    this.fetched = true;

                    for (let i = 0; i < this.quizResult.quizResponses.length; i++) {
                        let score = this.getScore(this.quizResult.quizResponses[i]);
                        this.scores.push(score);
                        if (score >= this.quiz.PassScore) this.passCount++;
                    }

                    if (this.quiz.Language == 3) {
                        $(".entQuizDataLoaderMessage").hide();
                        $(".entQuizLanguage").show();
                    }
                    else {
                        $(".entQuizDataLoaderMessage").hide();
                        this.SetUserLanguage(this.quiz.Language);
                    }

                }
                else {
                    $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching Quiz questions. Please try again after some time. <br/> If Problem persists, contact IT Helpdesk</div><div style='margin:5%;color:coral'>" + data_item.ErrorMessage + "</div>");

                }
            },



            getQuestionControlWithValue: function (qtn) {

                /*
                        1 - RadioButtons
                        2 - ImageChoices
                        3 - Date
                        4 - DropDown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                */

                let quizResponse = ''
                let quizQuestionResponses = [];
                if (ENTQuiz.Response.quizResult.QuizQuestionAllResponses != undefined &&
                    ENTQuiz.Response.quizResult.QuizQuestionAllResponses.length > 0) {
                    quizQuestionResponses = $.grep(ENTQuiz.Response.quizResult.QuizQuestionAllResponses,
                        function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                }


                //Radiobuttons
                if (qtn.DataTypeID == 1 ||
                    qtn.DataTypeID == 4) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let answer = $.parseJSON(qtn.Answer);

                    if (quizQuestionResponses.length > 0) {
                        let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                        for (let i = 0; i < optionsCount; i++) {
                            let selectedOptionCount = $.grep(quizQuestionResponses, function (oquizQuestionResponse) {
                                return oquizQuestionResponse.QuestionResponse == '' + i;
                            }).length;
                            let selectedOptionPercent = (selectedOptionCount * 100.0 / quizQuestionResponses.length).toFixed(2);

                            qtnResponse += '<div class="entQuizQtnCtlValue ' + (ENTQuiz.Response.userLanguage == 1 ? (Specs.ar[i].trim() == answer.ar.trim() ? ' correctAns ' : '') : (Specs.en[i].trim() == answer.en.trim() ? ' correctAns ' : '')) + '" style="font-weight:bold;padding:2%"  >' +
                                '<div>' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                ' - ' + selectedOptionCount + ' (' + selectedOptionPercent + '%)' +
                                '</div>' +
                                '<div class="quizHBarB">' +
                                (selectedOptionPercent > 0 ? '<div class="quizHbar" style="width:' + selectedOptionPercent + '%;"></div>' : '&nbsp;') +
                                '</div>'
                            '</div>';
                        }
                    }

                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + '</div>';
                }

                //Image Choices
                else if (qtn.DataTypeID == 2) {
                    let answer = $.parseJSON(qtn.Answer);
                    let qtnImageChoices = $.grep(ENTQuiz.Response.quiz.ImageChoices, function (imageFile) {
                        return imageFile.QuestionId == qtn.ID;
                    });

                    if (quizQuestionResponses.length > 0) {
                        if (qtnImageChoices.length > 0) {
                            for (let i = 0; i <= qtnImageChoices.length; i++) {
                                let selectedRatingCount = $.grep(quizQuestionResponses, function (oquizQuestionResponse) {
                                    return oquizQuestionResponse.QuestionResponse == '' + i;
                                }).length;
                                let selectedRatingPercent = (selectedRatingCount * 100.0 / quizQuestionResponses.length).toFixed(2);

                                qtnResponse += '<div class="entQuizQtnCtlValue ' + ((qtnImageChoices[i].FileIdx + 1) == answer.ans ? ' correctAns ' : '') + '" style="font-weight:bold;padding:2%">' +
                                    '<div> <img src="data:image/jpg;base64,' + qtnImageChoices[i].FileContentAsBytes + '" title="' + qtnImageChoices[i].FileName + '" class="ImageChoiceDisabled" /> ' + '   ' +
                                    selectedRatingCount + ' (' + selectedRatingPercent + '%) </div>' +
                                    '<div class="quizHBarB">' +
                                    (selectedRatingPercent > 0 ? '<div class="quizHBar" style="width:' + selectedRatingPercent + '%;"></div>' : '&nbsp;') +
                                    '</div>' +
                                    '</div>';
                            }
                        }
                        else {
                            qtnResponse += '<div style="color:coral;font-size:15px;font-weight:bold;">Image files not found</div>';
                        }
                    }

                    if (qtnResponse == '') qtnResponse = ' - ';
                    else {
                        let modQtn = $.grep(ENTQuiz.Response.Questions, function (oQuestion) {
                            return (oQuestion.ID == qtn.ID);
                        });
                        qtnResponse = '<div onclick="ENTQuiz.Response.ShowQuestionResponses(this)"><span style="font-weight:bold;cursor:pointer;color:#fff;padding:2%;"><i class="fa fa-plus-square" /> Show Responses</span><div style="display:none;"><h3 >' + (ENTQuiz.Response.userLanguage == 1 ? modQtn[0].Question : modQtn[0].Question_En) + '</h3>' + qtnResponse + '</div></div>';
                    }
                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + '" </div>';


                }
                //Date
                else if (qtn.DataTypeID == 3) {
                    let answer = $.parseJSON(qtn.Answer);
                    let arrResponses = [];
                    let arrResponsesCount = [];
                    if (quizQuestionResponses.length > 0) {
                        $(quizQuestionResponses).each(function (idx, resp) {
                            if (arrResponses != null && arrResponses.length != 0) {
                                if (arrResponses.indexOf(resp.QuestionResponse) == -1) {
                                    arrResponses.push(resp.QuestionResponse);
                                    arrResponsesCount.push(1);
                                }
                                else {
                                    arrResponsesCount[arrResponses.indexOf(resp.QuestionResponse)]++;
                                }
                            }
                            else {
                                arrResponses.push(resp.QuestionResponse);
                                arrResponsesCount.push(1);
                            }
                        });
                    }

                    let optionsCount = arrResponses.length;
                    for (let i = 0; i < optionsCount; i++) {
                        let selectedOptionPercent = (arrResponsesCount[i] * 100.0 / quizQuestionResponses.length).toFixed(2);
                        qtnResponse += '<div class="entQuizQtnCtlValue ' + (arrResponses[i].trim() == answer.ans.trim() ? ' correctAns ' : '') + '" style="font-weight:bold;padding:2%;" >' +
                            '<div> ' + arrResponses[i] + ' - ' + arrResponsesCount[i] + ' (' + selectedOptionPercent + '%) </div>' +
                            '<div class="quizHBarB">' +
                            (selectedOptionPercent > 0 ? '<div class="quizHBar" style="width:' + selectedOptionPercent + '%;" > </div>' : '&nbsp;') +
                            '</div> ' +
                            '</div> ';
                    }

                    if (qtnResponse == '') qtnResponse = ' - ';
                    else {
                        let modQtn = $.grep(ENTQuiz.Response.Questions, function (oQuestion) {
                            return (oQuestion.ID == qtn.ID);
                        });
                        qtnResponse = '<div onclick="ENTQuiz.Response.ShowQuestionResponses(this)"><span style="font-weight:bold;cursor:pointer;color:#fff;padding:2%;"><i class="fa fa-plus-square" /> Show Responses</span><div style="display:none;"><h3 >' + (ENTQuiz.Response.userLanguage == 1 ? modQtn[0].Question : modQtn[0].Question_En) + '</h3>' + qtnResponse + '</div></div>';
                    }
                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + '" </div>';


                }

                //MultiCheckboxes
                else if (qtn.DataTypeID == 5) {
                    let answer = $.parseJSON(qtn.Answer);
                    let Specs = $.parseJSON(qtn.Specs);
                    if (quizQuestionResponses.length > 0) {
                        let quizQuestionResponsesAggregated = [];
                        $(quizQuestionResponses).each(function (idx, oquizQuestionResponses) {
                            let oquizQuestionResponsesArray = $.parseJSON(oquizQuestionResponses.QuestionResponse);
                            $(oquizQuestionResponsesArray).each(function (idx2, oquizQuestionResponse) {
                                quizQuestionResponsesAggregated.push(oquizQuestionResponse);
                            });
                        });
                        let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                        for (let i = 0; i < optionsCount; i++) {
                            let selectedOptionCount = $.grep(quizQuestionResponsesAggregated, function (oquizQuestionResponse) {
                                return oquizQuestionResponse == '' + i;
                            }).length;
                            let selectedOptionPercent = (selectedOptionCount * 100.0 / quizQuestionResponses.length).toFixed(2);


                            let isAnswer = false;
                            if (ENTQuiz.Response.userLanguage == 1) {
                                isAnswer = $.grep(answer.ar, function (oAnswer) {
                                    return oAnswer == Specs.ar[i].trim();
                                }).length > 0;
                            } else {
                                isAnswer = $.grep(answer.en, function (oAnswer) {
                                    return oAnswer == Specs.en[i].trim();
                                }).length > 0;
                            }

                            qtnResponse += '<div class="entQuizQtnCtlValue ' + (isAnswer ? ' correctAns ' : '') +
                                '" style="font-weight:bold;padding:2%">' +
                                '<div>' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en.trim()) +
                                ' - ' +
                                selectedOptionCount + ' (' + selectedOptionPercent + '%) </div>' +
                                '<div class="quizHBarB">' +
                                (selectedOptionPercent > 0 ? '<div class="quizHBar" style="width:' + selectedOptionPercent + '%;"></div>' : '&nbsp;') +
                                '</div>' +
                                '</div>';
                        }
                    }
                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + ' </div>';
                }

                //RankingQuestion
                else if (qtn.DataTypeID == 6) {

                    let answer = $.parseJSON(qtn.Answer);
                    let Specs = $.parseJSON(qtn.Specs);

                    if (quizQuestionResponses.length > 0) {
                        let quizQuestionResponsesAggregated = [];
                        $(quizQuestionResponses).each(function (idx, oquizQuestionResponses) {
                            let oquizQuestionResponsesArray = $.parseJSON(oquizQuestionResponses.QuestionResponse);
                            $(oquizQuestionResponsesArray).each(function (idx2, omodQuestionResponse) {
                                quizQuestionResponsesAggregated.push(omodQuestionResponse);
                            });
                        });
                        let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                        for (let i = 0; i < optionsCount; i++) {

                            let qtnResponse_Row = $.grep(quizQuestionResponsesAggregated, function (qtnResponseItem) {
                                return (i == qtnResponseItem.RowID);
                            });
                            qtnResponse += '<div class="RankItem">' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + '</div>';

                            for (let j = 0; j < optionsCount; j++) {

                                let selectedOptionCount = $.grep(qtnResponse_Row, function (qtnResponse_RowItem) {
                                    return qtnResponse_RowItem.RowResponse == (j + 1);
                                }).length;
                                let selectedOptionPercent = (selectedOptionCount * 100.0 / qtnResponse_Row.length).toFixed(2);

                                qtnResponse += '<div class="entQuizQtnCtlValue ' + (answer.ans[i] == (j + 1) ? ' correctAns ' : '') + '" style="font-weight:bold;padding:2%">' +
                                    '<div> Rank - ' + (j + 1) + ' - ' +
                                    selectedOptionCount + ' (' + selectedOptionPercent + '%) </div>' +
                                    '<div class="quizHBarB">' +
                                    (selectedOptionPercent > 0 ? '<div class="quizHBar" style="width:' + selectedOptionPercent + '%;"></div>' : '&nbsp;') +
                                    '</div>' +
                                    '</div>';
                            }

                        }


                        let quizQtn = $.grep(ENTQuiz.Response.quiz.Questions, function (oQuestion) {
                            return (oQuestion.ID == qtn.ID);
                        });
                        qtnResponse = '<div onclick="ENTQuiz.Response.ShowQuestionResponses(this)"><span style="font-weight:bold;cursor:pointer;color:#fff;padding:2%;"><i class="fa fa-plus-square" /> Show Responses </span><div style="display:none"><h3>' + (ENTQuiz.Response.userLanguage == 1 ? quizQtn[0].Question : quizQtn[0].Question_En) + '</h3>' + qtnResponse + '</div></div>';

                        return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + ' </div>';
                    }
                }
                return "";

            },

            ShowQuestionResponses: function (questionResponseBlock) {
                $(".detailsContainer_View_MOD").html('');
                (".detailsContainer_View_MOD").html('<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + ($(questionResponseBlock).find("div").html()) + '</div>');
                $("#mslDialog_View_MOD").modal("show");

            },
            scores: [],
            passCount: 0,

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

            renderQuiz: function () {
                if (this.quiz != undefined &&
                    this.quiz.Questions != undefined &&
                    this.quiz.Questions.length > 0) {
                    let quizId = this.quiz.ID;
                    $("#ent_quizId").val(quizId);

                    $(".entQuizResponseContainer").show();

                    if (this.userLanguage == 1) {
                        $(".entQuizResponseContainer").removeClass("DirectionLTR");
                        $(".entQuizResponseContainer").addClass("DirectionRTL");
                        $(".entQuizResponseContainer").attr("dir", "rtl");
                    }
                    else {

                        $(".entQuizResponseContainer").removeClass("DirectionRTL");
                        $(".entQuizResponseContainer").addClass("DirectionLTR");
                        $(".entQuizResponseContainer").attr("dir", "ltr");
                    }

                    let htmlQuizHeader = '<div class="entQuizHeader">' +
                        (this.userLanguage == 1 ? this.quiz.Title : this.quiz.Title_En) +
                        '</div>' +
                        '<div class="entQuizDescription">' +
                        (this.userLanguage == 1 ? this.quiz.Description : this.quiz.Description_En) +
                        '</div>' +
                        '<div class="entQuizResponseCountContainer" style="display:none">' +
                        '   <div class="row" style="margin:1% 25%;" >' +
                        '       <div class="entQuizResponseCountHeader col-sm-8">Response Count</div>' +
                        '       <div class="entQuizResponseCount col-sm-4" style="text-align:center">' + Math.round(ENTQuiz.Response.quizResult.QuizQuestionAllResponses.length / ENTQuiz.Response.quiz.Questions.length) + '</div>' +
                        '   </div>' +
                        '   <div class="row" style="margin:1% 25%;" >' +
                        '       <div class="entQuizResponseCountHeader col-sm-8">Average Score</div>' +
                        '       <div class="entQuizResponseAvgScore col-sm-4" style="text-align:center"></div>' +
                        '   </div>' +
                        '   <div class="row" style="margin:1% 25%;" >' +
                        '       <div class="entQuizResponseCountHeader col-sm-8">Highest Score</div>' +
                        '       <div class="entQuizResponseHighScore col-sm-4" style="text-align:center"></div>' +
                        '   </div>' +
                        '   <div class="row" style="margin:1% 25%;" >' +
                        '       <div class="entQuizResponseCountHeader col-sm-8">Lowest Score</div>' +
                        '       <div class="entQuizResponseLowScore col-sm-4" style="text-align:center"></div>' +
                        '   </div>' +
                        '   <div class="row" style="margin:1% 25%;" >' +
                        '       <div class="entQuizResponseCountHeader col-sm-8">Pass Rate</div>' +
                        '       <div class="entQuizResponsePassScore col-sm-4" style="text-align:center"></div>' +
                        '   </div>' +
                        '</div>';


                    let htmlQuizQuestions = this.quiz.Questions.map(function (o, idx) {

                        let htmlQuizQuestion = '<div class="entQuizQuestionContainer">' +
                            '<div class="entQuizQuestion">' + (qtnCntrDisplay) + ' . &nbsp; ' +
                            (ENTQuiz.Response.userLanguage == 1 ? o.Question : o.Question_En) +
                            '</div>' +
                            '<div class="entQuizQuestionControl" data-qtnid="' + o.ID + '" data-datatypeid="' + o.DataTypeID + '" >' +
                            ENTQuiz.Response.getQuestionControlWithValue(o) +
                            '</div>' +
                            '</div>';

                        return htmlQuizQuestion;


                    }).join('');
                    $('.entQuizHeaderContainer').html(htmlQuizHeader);
                    $('.entQuizQuestionsContainer').html(htmlQuizQuestions);

                    const average = array => array.reduce((a, b) => a + b) / array.length * 1.0;
                    $(".entQuizResponseAvgScore").html(average(ENTQuiz.Response.scores).toFixed(2));
                    $(".entQuizResponseHighScore").html(Math.max(...ENTQuiz.Response.scores));
                    $(".entQuizResponseLowScore").html(Math.min(...ENTQuiz.Response.scores));
                    $(".entQuizResponsePassRate").html((this.passCount * 100.0 / this.items_all.length).toFixed(2));
                    $(".entQuizResponseCountContainer").show();


                }
            },
            cancelQuiz: function () {
                window.location = 'ManageQuizs.aspx';
            },
            viewManageQuiz: function () {
                window.location = 'ManageQuizs.aspx';
            },
            exportToExcel: function () {
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apipath + '/getQuizResponses_Export?quizId=' + quizId + '&absolutePath=' + location.pathname;
                    window.location = apiPath_item;
                }
            },

            viewResultByPerson: function () {
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    window.location = 'viewResultByPerson.aspx?quizId=' + quizId;
                }
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