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
                    let apiPath_item = this.apiPath + '/getQuizResponses?quizId=' + quizId + '&absolutePath=' + location.pathname;
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

                let qtnResponse = '';
                let modQuestionResponses = [];

                if (ENTQuiz.Response.quizResult.QuizQuestionAllResponses != undefined &&
                    ENTQuiz.Response.quizResult.QuizQuestionAllResponses.length > 0) {
                    modQuestionResponses = $.grep(ENTQuiz.Response.quizResult.QuizQuestionAllResponses, function (oQuizQuestionResponse) {
                        return (oQuizQuestionResponse.ID == qtn.ID);
                    });
                }


                //Textbox
                if (qtn.DataTypeID == 1 ||
                    qtn.DataTypeID == 2 ||
                    qtn.DataTypeID == 3) {

                    if (modQuestionResponses.length > 0) {
                        $(modQuestionResponses).each(function (idx, resp) {
                            if (idx > 0) qtnResponse += '<br /><hr />';
                            qtnResponse += '<span class="entModCtlValue">' + resp.QuestionResponse + '</span>';
                        });
                    }
                    if (qtnResponse == '') qtnResponse = ' - ';
                    else {

                        let modQtn = $.grep(ENTQuiz.Response.quiz.Questions, function (oQuestion) {
                            return (oQuestion.ID == qtn.ID);
                        });
                        qtnResponse = '<div onclick="ENTQuiz.Response.ShowQuestionResponses(this)"><span style="font-weight:bold;cursor:pointer;color:#fff;padding:2%;"><i class="fa fa-plus-square"/> Show Responses</span><div style="display:none"><h3>' + (ENTQuiz.Response.userLanguage == 1 ? modQtn[0].Question : modQtn[0].Question_En) + '</h3>' + qtnResponse + '</div></div>';
                    }

                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + ' </div>';

                }
                //Checkbox
                else if (qtn.DataTypeID == 4) {

                    if (modQuestionResponses.length > 0) {
                        let checkedCount = 0;
                        let uncheckedCount = 0;
                        let checkedPercent = 0;
                        checkedCount = $.grep(modQuestionResponses, function (oQuizQuestionResponse) {
                            return oQuizQuestionResponse.QuestionResponse.toLowercase() == "true";
                        }).length;
                        uncheckedCount = modQuestionResponseslength - checkedCount;
                        checkedPercent = (checkedCount * 100.0 / modQuestionResponses.length).toFixed(2);
                        qtnResponse += '<div class="entModQtnCtlValue" style="font-weight:bold;padding:2%">' +
                            '<div>Yes - ' + checkedCount + '(' + checkedPercent + '%) </div>' +
                            '<div class="quizHBarB">' +
                            (checkedPercent > 0 ? '<div class="quizHBar" style="width:' + checkedPercent + '%;"></div>' : '&nbsp;') +
                            '</div>' +
                            '<div style="margin-bottom:2%"></div>' +
                            '<div>No - ' + uncheckedCount + '(' + (100.0 - checkedPercent).toFixed(2) + '%)</div>' +
                            '<div class="quizHBarB">' +
                            ((100.0 - checkedPercent) > 0 ? '<div class="quizHBar" style="width:' + (100.0 - checkedPercent) + '%;"></div>' : '&nbsp;') +
                            '</div>' +
                            '</div>';
                    }
                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + '" </div>';

                }

                //Dropdown //RadioButtons //Branching
                else if (qtn.DataTypeID == 5 ||
                    qtn.DataTypeID == 6 ||
                    qtn.DataTypeID == 13) {
                    let Specs = $.parseJSON(qtn.Specs);
                    if (modQuestionResponses.length > 0) {
                        let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                        for (let i = 0; i < optionsCount; i++) {
                            let selectedOptionCount = $.grep(modQuestionResponses, function (omodQuestionResponse) {
                                return omodQuestionResponse.QuestionResponse == '' + i;
                            }).length;

                            let selectedOptionPercent = (selectedOptionCount * 100.0 / modQuestionResponses.length).toFixed(2);

                            qtnResponse += '<div class="entModQtnCtlValue" style="font-weight:bold;padding:2%">' +
                                '<div>' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en.trim()) + ' - ' +
                                selectedOptionCount + ' (' + selectedOptionPercent + '%) </div>' +
                                '<div class="quizHBarB">' +
                                (selectedOptionPercent > 0 ? '<div class="quizHBar" style="width:' + selectedOptionPercent + '%;"></div>' : '&nbsp;') +
                                '</div>' +
                                '</div>';
                        }
                    }
                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + ' </div>';

                }


                //MultiCheckboxes
                else if (qtn.DataTypeID == 7) {
                    let Specs = $.parseJSON(qtn.Specs);
                    if (modQuestionResponses.length > 0) {
                        let modQuestionResponsesAggregated = [];
                        $(modQuestionResponses).each(function (idx, omodQuestionResponses) {
                            let omodQuestionResponsesArray = $.parseJSON(omodQuestionResponses.QuestionResponse);
                            $(omodQuestionResponsesArray).each(function (idx2, omodQuestionResponse) {
                                modQuestionResponsesAggregated.push(omodQuestionResponse);
                            });
                        });
                        let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                        for (let i = 0; i < optionsCount; i++) {
                            let selectedOptionCount = $.grep(modQuestionResponsesAggregated, function (omodQuestionResponse) {
                                return omodQuestionResponse == '' + i;
                            }).length;
                            let selectedOptionPercent = (selectedOptionCount * 100.0 / modQuestionResponses.length).toFixed(2);

                            qtnResponse += '<div class="entModQtnCtlValue" style="font-weight:bold;padding:2%">' +
                                '<div>' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en.trim()) + ' - ' +
                                selectedOptionCount + ' (' + selectedOptionPercent + '%) </div>' +
                                '<div class="quizHBarB">' +
                                (selectedOptionPercent > 0 ? '<div class="quizHBar" style="width:' + selectedOptionPercent + '%;"></div>' : '&nbsp;') +
                                '</div>' +
                                '</div>';
                        }
                    }
                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + ' </div>';
                }

                //RatingByNumbers //Slider
                else if (qtn.DataTypeID == 8 ||
                    qtn.DataTypeID == 10) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let minRating = Specs.min;
                    let maxRating = Specs.max;
                    let stepRating = Specs.step;

                    if (modQuestionResponses.length > 0) {
                        for (let i = minRating; i <= maxRating; i = i + stepRating) {
                            let selectedRatingCount = $.grep(modQuestionResponses, function (omodQuestionResponse) {
                                return omodQuestionResponse.QuestionResponse == '' + i;
                            }).length;
                            let selectedRatingPercent = (selectedRatingCount * 100.0 / modQuestionResponses.length).toFixed(2);

                            qtnResponse += '<div class="entModQtnCtlValue" style="font-weight:bold;padding:2%">' +
                                '<div> Rating:' + i + ' - ' +
                                selectedRatingCount + ' (' + selectedRatingPercent + '%) </div>' +
                                '<div class="quizHBarB">' +
                                (selectedRatingPercent > 0 ? '<div class="quizHBar" style="width:' + selectedRatingPercent + '%;"></div>' : '&nbsp;') +
                                '</div>' +
                                '</div>';
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

                //5 - Emojis
                else if (qtn.DataTypeID == 14) {

                    let emojis = ["fas fa-frown", "far fa-frown", "far fa-meh", "far fa-smile", "fas fa-smile"];

                    if (modQuestionResponses.length > 0) {
                        for (let i = 0; i <= 5; i = i++) {
                            let selectedRatingCount = $.grep(modQuestionResponses, function (omodQuestionResponse) {
                                return omodQuestionResponse.QuestionResponse == '' + i;
                            }).length;
                            let selectedRatingPercent = (selectedRatingCount * 100.0 / modQuestionResponses.length).toFixed(2);

                            qtnResponse += '<div class="entModQtnCtlValue" style="font-weight:bold;padding:2%">' +
                                '<div> <span class="RatingByEmojiDisabled ' + emojis[i] + '"></span>&nbsp; :' + i + ' - ' +
                                selectedRatingCount + ' (' + selectedRatingPercent + '%) </div>' +
                                '<div class="quizHBarB">' +
                                (selectedRatingPercent > 0 ? '<div class="quizHBar" style="width:' + selectedRatingPercent + '%;"></div>' : '&nbsp;') +
                                '</div>' +
                                '</div>';
                        }
                    }


                    if (qtnResponse == '') qtnResponse = ' - ';
                    else {
                        let modQtn = $.grep(ENTQuiz.Response.Questions, function (oQuestion) {
                            return (oQuestion.ID == qtn.ID);
                        });
                        qtnResponse = '<div onclick="ENTQuiz.Response.ShowQuestionResponses(this)"><span style="font-weight:bold;cursor:pointer;color:#fff;padding:2%;"><i class="fa fa-plus-square" /> Show Responses</span><div style="display:none;"><h3>' + (ENTQuiz.Response.userLanguage == 1 ? modQtn[0].Question : modQtn[0].Question_En) + '</h3>' + qtnResponse + '</div></div>';
                    }
                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + ' </div>';

                }

                //MatrixQuestion
                else if (qtn.DataTypeID == 9) {

                    let matrix = $.parseJSON(qtn.Specs);
                    let cols = (ENTQuiz.Response.userLanguage == 1 ? matrix.Cols.ar : matrix.Cols.en);
                    let rows = (ENTQuiz.Response.userLanguage == 1 ? matrix.Rows.ar : matrix.Rows.en);

                    let colsCount = cols.length;
                    let rowsCount = rows.length;
                    let questionColLengthCSS = ' col-sm-' + (12 - colsCount);

                    if (colsCount <= 3) questionColLengthCSS = 'col-sm-6';

                    let qtnResponse = '';
                    if (modQuestionResponses.length > 0) {
                        let modQuestionResponsesAggregated = [];
                        $(modQuestionResponses).each(function (idx, omodQuestionResponses) {
                            let omodQuestionResponseArray = $.parseJSON(omodQuestionResponses.QuestionResponse);
                            $(omodQuestionResponseArray).each(function (idx2, omodQuestionResponse) {
                                modQuestionResponsesAggregated.push(omodQuestionResponse);
                            });
                        });

                        qtnResponse += '<div class="row">';
                        qtnResponse += '<span class="' + questionColLengthCSS + ' MatrixCell" ' + (ENTQuiz.Response.userLanguage == 1 ? ' style="float:right" ' : '') + '><span>';
                        for (let i = 0; i < colsCount; i++) {
                            if (colsCount <= 3)
                                qtnResponse += '<span class="col-sm-2 MatrixCell MatrixCellHeader " ' + (ENTQuiz.Response.userLanguage == 1 ? ' style="float:right;" ' : '') + '>' + cols[i].trim() + '</span>';
                            else
                                qtnResponse += '<span class="col-sm-1 MatrixCell ' + (ENTQuiz.Response.userLanguage == 1 ? ' MatrixCellHeader_AR ' : ' MatrixCellHeader_EN ') + ' " ' + (ENTQuiz.Response.userLanguage == 1 ? ' style="float:right;" ' : '') + '>' + cols[i].trim() + '</span>';
                        }
                        qtnResponse += "</div>";
                        for (let r = 0; r < rowsCount; r++) {
                            qtnResponse += '<div class="row MatrixRow" style="padding:2% 0;">';
                            let qtnResponse_Row = $.grep(modQuestionResponsesAggregated, function (qtnResponseItem) {
                                return (r == qtnResponseItem.RowID);
                            });
                            for (let i = 0; i < colsCount; i++) {
                                if (i == 0)
                                    qtnResponse += '<span class="' + questionColLengthCSS +
                                        ' MatrixCell " style="line-height:50pt;" ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? 'float:right;' : '') + '" >' + rows[r].trim() + '</span>';

                                let checkedCount = 0;
                                let checkedPercent = 0;
                                if (qtnResponse_Row != undefined && qtnResponse_Row.length > 0) {
                                    checkedCount = $.grep(qtnResponse_Row, function (qtnResponse_RowItem) {
                                        return qtnResponse_RowItem.RowResponse == (i + 1);
                                    }).length;
                                    checkedPercent = ((checkedCount * 100.0 / qtnResponse_Row.length) * 0.4).toFixed(2);
                                }

                                if (colsCount <= 3)
                                    qtnResponse += '<span class="col-sm-2 MatrixCell" ' + (ENTQuiz.Response.userLanguage == 1 ? ' style="float:right" ' : ' ') + '>' +
                                        '<div class="MatrixCheckPercent">' + (checkedPercent / 0.4).toFixed(2) + '%</div>' +
                                        '<div class="quizVBarB">' +
                                        (checkedPercent > 0 ? '<div class="quizVBar" style="height:' + checkedPercent + 'pt;"></div>' : '&nbsp;') +
                                        '</div>' +
                                        '</span>';
                                else
                                    qtnResponse += '<span class="col-sm-1 MatrixCell" ' + (ENTQuiz.Response.userLanguage == 1 ? ' style="float:right" ' : ' ') + '>' +
                                        '<div class="MatrixCheckPercent">' + (checkedPercent / 0.4).toFixed(2) + '%</div>' +
                                        '<div class="quizVBarB">' +
                                        (checkedPercent > 0 ? '<div class="quizVBar" style="height:' + checkedPercent + 'pt;"></div>' : '&nbsp;') +
                                        '</div>' +
                                        '</span>';
                            }
                            qtnResponse += "</div>";
                        }
                        qtnResponse += "</div>";
                    }
                    let modQtn = $.grep(ENTQuiz.Response.quiz.Questions, function (oQuestion) {
                        return (oQuestion.ID == qtn.ID);
                    });

                    if (qtnResponse != '')
                        qtnResponse = '<div onclick="ENTQuiz.Response.ShowQuestionResponses(this)"><span style="font-weight:bold;cursor:pointer;color:#fff;padding:2%;"><i class="fa fa-plus-square" /> Show Responses</span><div style="display:none;"><h3>' + (ENTQuiz.Response.userLanguage == 1 ? modQtn[0].Question : modQtn[0].Question_En) + '</h3>' + qtnResponse + '</div></div>';
                    else
                        qtnResponse = ' - ';

                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + ' </div>';

                }

                //FileAttachment
                else if (qtn.DataTypeID == 11) {
                    let modResponseFiles = [];
                    if (ENTQuiz.Response.quizResult.responseFiles != undefined &&
                        ENTQuiz.Response.quizResult.responseFiles.length > 0) {
                        modResponseFiles = $.grep(ENTQuiz.Response.quizResult.responseFiles, function (oresponseFile) {
                            return (oresponseFile.QuestionId == qtn.ID);
                        });
                    }

                    if (modResponseFiles.length > 0) {
                        $(modResponseFiles).each(function (idx, respFile) {
                            let quizId = ENTQuiz.Common.getUrlParams("quizId");
                            let responseId = respFile.ResponseId;
                            let getFileURL = ENTQuiz.Response.apiPath + '/getResponseFile?fileId=' + respFile.ID + '&quizId=' + quizId + '&responseId=' + responseId + '&absolutePath=' + location.pathname;
                            if (idx > 0) qtnResponse += '<br /><hr />';
                            qtnResponse += '<span class="entModQtnCtlValue"><a href="' + getFileURL + '" style="color:#fff">' + respFile.FileName + ' &nbsp; &nbsp; <i class="fas fa-download"></i></a></span>';
                        });
                    }

                    if (qtnResponse == '') qtnResponse = ' - ';
                    else {
                        let modQtn = $.grep(ENTQuiz.Response.quiz.Questions, function (oQuestion) {
                            return (oQuestion.ID == qtn.ID);
                        });
                        qtnResponse = '<div onclick="ENTQuiz.Response.ShowQuestionResponses(this)"><span style="font-weight:bold;cursor:pointer;color:#fff;padding:2%;"><i class="fa fa-plus-square" /> Show Responses </span><div style="display:none"><h3>' + (ENTQuiz.Response.userLanguage == 1 ? modQtn[0].Question : modQtn[0].Question_En) + '</h3>' + qtnResponse + '</div></div>';

                    }
                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + ' </div>';

                }

                //RankingQuestion
                else if (qtn.DataTypeID == 12) {

                    let Specs = $.parseJSON(qtn.Specs);

                    if (modQuestionResponses.length > 0) {
                        let modQuestionResponsesAggregated = [];
                        $(modQuestionResponses).each(function (idx, omodQuestionResponses) {
                            let omodQuestionResponsesArray = $.parseJSON(omodQuestionResponses.QuestionResponse);
                            $(omodQuestionResponsesArray).each(function (idx2, omodQuestionResponse) {
                                modQuestionResponsesAggregated.push(omodQuestionResponse);
                            });
                        });
                        let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                        for (let i = 0; i < optionsCount; i++) {

                            let qtnResponse_Row = $.grep(modQuestionResponsesAggregated, function (qtnResponseItem) {
                                return (i == qtnResponseItem.RowID);
                            });
                            qtnResponse += '<div>' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + '</div>';

                            for (let j = 0; j < optionsCount; j++) {

                                let selectedOptionCount = $.grep(qtnResponse_Row, function (qtnResponse_RowItem) {
                                    return qtnResponse_RowItem.RowResponse == (j + 1);
                                }).length;
                                let selectedOptionPercent = (selectedOptionCount * 100.0 / qtnResponse_Row.length).toFixed(2);

                                qtnResponse += '<div class="entModQtnCtlValue" style="font-weight:bold;padding:2%">' +
                                    '<div> Rank - ' + (j + 1) + ' - ' +
                                    selectedOptionCount + ' (' + selectedOptionPercent + '%) </div>' +
                                    '<div class="quizHBarB">' +
                                    (selectedOptionPercent > 0 ? '<div class="quizHBar" style="width:' + selectedOptionPercent + '%;"></div>' : '&nbsp;') +
                                    '</div>' +
                                    '</div>';
                            }

                        }


                        let modQtn = $.grep(ENTQuiz.Response.quiz.Questions, function (oQuestion) {
                            return (oQuestion.ID == qtn.ID);
                        });
                        qtnResponse = '<div onclick="ENTQuiz.Response.ShowQuestionResponses(this)"><span style="font-weight:bold;cursor:pointer;color:#fff;padding:2%;"><i class="fa fa-plus-square" /> Show Responses </span><div style="display:none"><h3>' + (ENTQuiz.Response.userLanguage == 1 ? modQtn[0].Question : modQtn[0].Question_En) + '</h3>' + qtnResponse + '</div></div>';

                        return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + ' </div>';
                    }
                }

                //Image Choices
                else if (qtn.DataTypeID == 15) {
                    let qtnImagechoices = $.grep(ENTQuiz.Response.quiz.Imagechoices, function (imageFile) {
                        return imageFile.QuestionId == qtn.ID;
                    });

                    if (modQuestionResponses.length > 0) {
                        if (qtnImagechoices.length > 0) {
                            for (let i = 0; i <= qtnImagechoices.length; i++) {
                                let selectedRatingCount = $.grep(modQuestionResponses, function (omodQuestionResponse) {
                                    return omodQuestionResponse.QuestionResponse == '' + i;
                                }).length;
                                let selectedRatingPercent = (selectedRatingCount * 100.0 / modQuestionResponses.length).toFixed(2);

                                qtnResponse += '<div class="entModQtnCtlValue" style="font-weight:bold;padding:2%">' +
                                    '<div> <img src="data:image/jpg;base64,' + qtnImagechoices[i].FileContentAsBytes + '" title="' + qtnImagechoices[i].FileName + '" class="ImageChoiceDisabled" /> ' + '   ' +
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


                return "";
            },
            ShowQuestionResponses: function (questionResponseBlock) {
                $(".detailsContainer_View_MOD").html('');
                (".detailsContainer_View_MOD").html('<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + ($(questionResponseBlock).find("div").html()) + '</div>');
                $("#mslDialog_View_MOD").modal("show");

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
                        '<div class="entQuizResponseCountContainer">' +
                        (this.userLanguage == 1 ? '<div class="entQuizResponseCountHeader">ResponseCount-arabic</div>' : '<div class="entQuizResponseCountHeader">Response Count</div>') +
                        '<div class="entQuizResponseCount">' + Math.round(ENTQuiz.Response.quizResult.QuizQuestionAllResponses.length / ENTQuiz.Response.quiz.Questions.length) + '</div>' +
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

                }
            },
            cancelQuiz: function () {
                window.location = 'ManageQuizs.aspx';
            },
            exportToExcel: function(){
                if(ENTQuiz.Common.getUrlParams("quizId")!= undefined){
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apipath + '/getQuizResponses_Export?quizId='+quizId + '&absolutePath=' + location.pathname;
                    window.location = apiPath_item;
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