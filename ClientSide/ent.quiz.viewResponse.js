(
    function () {
        'use strict';
        ENTQuiz.Response = {

            userLanguage: 0,
            apiPath: "",
            quizResult: {},
            quiz: {},
            fetched: false,

            initializePage: function () {
                this.fetched = false;
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined &&
                    ENTQuiz.Common.getUrlParams("responseId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let responseId = ENTQuiz.Common.getUrlParams("responseId");
                    let apiPath_item = this.apiPath + '/getQuizResponse?quizId=' + quizId + '&responseId=' + responseId + '&absolutePath=' + location.pathname;
                    this.getQuizResponseFromDB(apiPath_item);
                }
                else {
                    console.log("Quiz/Response not selected ");
                    if (ENTQuiz.Common.getUrlParams("quizId") == undefined)
                        $(".entQuizContainer").html("<divclass='ErrorDiv'>Quiz not selected <br/> For additional info, please contact IT helpdesk </div>");
                    else if (ENTQuiz.Common.getUrlParams("responseId") == undefined)
                        $(".entQuizContainer").html("<divclass='ErrorDiv'>QuizResponse not selected <br/> For additional info, please contact IT helpdesk </div>");

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
                        $(".entQuizContainer").html("<div class='ErrorDiv'> Sorry ! Error occured while fetching Quiz Questions. Please try again after some time. <br/> If problem persists, contact IT helpdesk.</div>");
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
                    if (this.quiz == null) {
                        $(".entQuizContainer").html("<div class='ErrorDiv'>No Active quiz found with given id <br/> Please contact IT Helpdesk </div>");
                    }
                    else if (this.quizResult.quizResponses == undefined ||
                        this.quizResult.quizResponses.length == 0) {
                        $(".entQuizContainer").html("<div class='ErrorDiv'>No draft response found with given id <br/> Please contact IT Helpdesk</div>");

                    }
                    else {
                        if (this.quiz.Language == 3) {
                            $(".entQuizDataLoaderMessage").hide();
                            $(".entQuizLanguage").show();
                        }
                        else {
                            $(".entQuizDataLoaderMessage").hide();
                            this.SetUserLanguage(this.quiz.Language);
                        }
                    }
                }
                else {
                    $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching Quiz questions. Please try again after some time. <br/> If Problem persists, contact IT Helpdesk</div><div style='margin:5%;color:coral'>" + data_item.ErrorMessage + "</div>");

                }
            },
            getQuestionControlWithValue: function (qtn) {
                let quizResponse = ENTQuiz.Response.quizResult.quizResponses[0];
                let responseFiles = ENTQuiz.Response.quizResult.responseFiles;

                //Textbox
                if (qtn.DataTypeID == 1 ||
                    qtn.DataTypeID == 2 ||
                    qtn.DataTypeID == 3) {

                    let qtnResponse = ' - ';
                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = '<span class="entModQtnCtlValue">' + modQuestionResponse[0].QuestionResponse + '</span>';
                    }

                    return '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + qtnResponse + '" </div>';

                }
                //Checkbox
                else if (qtn.DataTypeID == 4) {

                    let qtnResponse = '';
                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = modQuestionResponse[0].QuestionResponse == "true" ? "-check" : "";
                    }
                    return '<span dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '"><i class="far fa' + qtnResponse + '"-square /></span>';

                }

                //Dropdown
                else if (qtn.DataTypeID == 5) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let qtnResponse = -1;

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = parseInt(modQuestionResponse[0].QuestionResponse);
                    }

                    let ctl = '<select class="entModQtnCtl" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" disabled> ';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    for (let i = 0; i < optionsCount; i++) {
                        if (qtnResponse == i)
                            ctl += '<option value="' + i + '" >' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + '</option>';
                    }
                    ctl += '</select>';
                    return ctl;
                }

                //Radiobuttons
                else if (qtn.DataTypeID == 6) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let qtnResponse = -1;

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = modQuestionResponse[0].QuestionResponse != undefined ? parseInt(modQuestionResponse[0].QuestionResponse) : -1;
                    }

                    let ctl = '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    for (let i = 0; i < optionsCount; i++) {
                        ctl += '<div style="margin:1%;color:#D9D9D9"><i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle" /> &nbsp; ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + '</div>';
                    }
                    ctl += '</div>';

                    return ctl;
                }

                //MultiCheckboxes
                else if (qtn.DataTypeID == 7) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let qtnResponse = [];

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = modQuestionResponse[0].QuestionResponse != undefined && modQuestionResponse[0].QuestionResponse != "" ? $.parseJSON(modQuestionResponse[0].QuestionResponse) : [];
                    }

                    let ctl = '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">';

                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    for (let i = 0; i < optionsCount; i++) {
                        let txtChecked = '';
                        for (let q = 0; q < qtnResponse.length; q++) {
                            if (i == parseInt(qtnResponse[q])) {
                                txtChecked = "-check"; break;
                            }
                        }
                        ctl += '<div style="margin:1%;color:#D9D9D9;"><i class="far fa' + txtChecked + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + ' </div>';
                    }
                    ctl += '</div>';

                    return ctl;
                }

                //RatingByNumbers
                else if (qtn.DataTypeID == 8) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let minRating = Specs.min;
                    let maxRating = Specs.max;
                    let stepRating = Specs.step;
                    let qtnResponse = '';

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = modQuestionResponse[0].QuestionResponse != undefined && modQuestionResponse[0].QuestionResponse != "" ? parseInt(modQuestionResponse[0].QuestionResponse) : "";
                    }

                    let ctl = '<br/><div><input type="hidden" value="' + (qtnResponse != '' ? qtnResponse : '') + '" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" />';

                    for (let i = minRating; i <= maxRating; i = i + stepRating) {
                        ctl += '<span class="RatingByNumberDisabled ' + (qtnResponse != '' && qtnResponse == i ? 'ActiveRating' : '') + '" data-ratinggroup="ent_mod_q' + qtn.ID + '"  >' + i + '</span> &nbsp; ';
                    }
                    ctl += '</div><br/>';

                    return ctl;
                }

                //5 - Emojis
                else if (qtn.DataTypeID == 14) {

                    let emojis = ["fas fa-frown", "far fa-frown", "far fa-meh", "far fa-smile", "fas fa-smile"];

                    let qtnResponse = '';

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = modQuestionResponse[0].QuestionResponse != undefined && modQuestionResponse[0].QuestionResponse != "" ? parseInt(modQuestionResponse[0].QuestionResponse) : "";
                    }

                    let ctl = '<br/><div><input type="hidden" value="' + (qtnResponse != '' ? qtnResponse : '') + '" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" />';

                    for (let i = 0; i < 5; i++) {
                        ctl += '<span class=" RatingByEmojiDisabled ' + emojis[i] + ' ' + ((qtnResponse + '') != '' && qtnResponse == i ? 'ActiveRating' : '') + '" data-ratinggroup="ent_mod_q' + qtn.ID + '" ></span> &nbsp; ';
                    }
                    ctl += '</div><br/>';

                    return ctl;
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

                    let qtnResponse = [];

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (modQuestionResponse[0].QuestionResponse != undefined && modQuestionResponse[0].QuestionResponse != "" ? $.parseJSON(modQuestionResponse[0].QuestionResponse) : []);
                    }
                    let ctl = '<div style="margin:auto;width:98%;">';
                    ctl += '<div class="row">';
                    ctl += '<span class="' + questionColLengthCSS + ' MatrixCell"></span>';
                    for (let i = 0; i < colsCount; i++) {
                        if (colsCount <= 3)
                            ctl += '<span class="col-sm-2 MatrixCell MatrixCellHeader" style="text-align:center;">' + cols[i].trim() + '</span>';
                        else
                            ctl += '<span class="col-sm-1 MatrixCell ' + (ENTQuiz.Response.userLanguage == 1 ? ' MatrixCellHeader_AR ' : ' MatrixCellHeader_EN') + '" style="text-align:center;">' + cols[i].trim() + '</span>';
                    }
                    ctl += "</div>";
                    for (let r = 0; r < rowsCount; r++) {
                        ctl += '<div class="row MatrixRow">';
                        let qtnResponse_Row = $.grep(qtnResponse, function (qtnResponseItem) {
                            return (r == qtnResponseItem.RowID);
                        });

                        for (let i = 0; i < colsCount; i++) {
                            if (i == 0)
                                ctl += '<span class="' + questionColLengthCSS + ' MatrixCell">' + rows[r].trim() + '</span>';

                            let txtChecked = '';
                            if (qtnResponse_Row != undefined && qtnResponse_Row.length > 0 &&
                                qtnResponse_Row[0].RowResponse == (i + 1))
                                txtChecked = "-dot";

                            if (colsCount <= 3)
                                ctl += '<span class="col-sm-2 MatrixCell" style="text-align:center;">' + '<i class="far fa' + txtChecked + '-circle" /> ' + '</span>';
                            else
                                ctl += '<span class="col-sm-1 MatrixCell" style="text-align:center;">' + '<i class="far fa' + txtChecked + '-circle" /> ' + '</span>';
                        }
                        ctl += "</div>";
                    }
                    ctl += "</div>";
                    return ctl;
                }


                //Slider
                else if (qtn.DataTypeID == 10) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let minRange = parseInt(Specs.min);
                    let maxRange = parseInt(Specs.max);
                    let stepRange = parseInt(Specs.step);

                    let qtnResponse = 0;

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (modQuestionResponse[0].QuestionResponse != undefined && modQuestionResponse[0].QuestionResponse != "" ? $.parseJSON(modQuestionResponse[0].QuestionResponse) : 0);
                    }

                    return '<div style="width:80%;margin:auto;"><span class="spanRangeValue">' + qtnResponse + '</span><input type="range" min="' + minRange + '"  max="' + maxRange + '"  step="' + stepRange + '" name="ent_mod_q' + qtn.ID + '" value="' + qtnResponse + '"  class="RangeControl"  disabled /></div>';
                }

                //FileAttachment
                else if (qtn.DataTypeID == 11) {

                    let qtnResponse = false;
                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (modQuestionResponse[0].QuestionResponse == "true");
                        if (qtnResponse) {
                            let fileItem = $.grep(responseFiles, function (oFile) {
                                return oFile.QuestionId == qtn.ID;
                            });
                            let quizId = ENTQuiz.Common.getUrlParams("quizId");
                            let responseId = ENTQuiz.Common.getUrlParams("responseId");
                            let getFileURL = ENTQuiz.Response.apiPath + '/getResponseFile?fileId=' + fileItem[0].ID + '&quizId=' + quizId + '&responseId=' + responseId + '&absolutePath=' + location.pathname;
                            return '<div><a href="' + getFileURL + '" style="color:#fff"> ' + fileItem[0].FileName + ' &nbsp; &nbsp;<i class="fas fa-download"></i></a> </div>';
                        }
                        else {
                            return '<div>-None-</div>'
                        }
                    }
                    else {
                        return '<div>-None-</div>';
                    }
                }

                //RankingQuestion
                else if (qtn.DataTypeID == 12) {
                    let Specs = $.parseJSON(qtn.Specs);

                    let qtnResponse = [];

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (modQuestionResponse[0].QuestionResponse != undefined && modQuestionResponse[0].QuestionResponse != "" ? $.parseJSON(modQuestionResponse[0].QuestionResponse) : []);
                    }

                    let ctl = '<div >';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    for (let i = 0; i < optionsCount; i++) {
                        let qtnResponse_Row = $.grep(qtnResponse, function (qtnResponseItem) {
                            return (i == qtnResponseItem.RowID);
                        });
                        ctl += '<div class="RankingQuestionRow">' +
                            '<select name="ent_mod_q' + qtn.ID + '_' + i + '"  disabled>';
                        for (let j = 0; j < optionsCount; j++) {
                            if (qtnResponse_Row != undefined && qtnResponse_Row.length > 0 &&
                                qtnResponse_Row[0].RowResponse == (j + 1))
                                ctl += '<option value="' + (j + 1) + '" >' + (j + 1) + '</option>';
                        }
                        ctl += '</select> &nbsp; &nbsp; ' +
                            '<span class="RankingQuestion">' +
                            (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                            '</span></div>';
                    }
                    ctl += '</div>';

                    return ctl;
                }


                //BranchingQuestion
                else if (qtn.DataTypeID == 13) {
                    let Specs = $.parseJSON(qtn.Specs);

                    let qtnResponse = -1;

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (modQuestionResponse[0].QuestionResponse != undefined ? parseInt(modQuestionResponse[0].QuestionResponse) : -1);
                    }

                    let ctl = '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '" style="color:#D9D9D9;">';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    for (let i = 0; i < optionsCount; i++) {
                        ctl += '<i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle"  /> &nbsp; ' +
                            (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                            ' &nbsp; &nbsp; &nbsp; ';
                    }
                    ctl += "</div>";
                    return ctl;
                }

                //Image Choices
                else if (qtn.DataTypeID == 15) {
                    let qtnImagechoices = $.grep(ENTQuiz.Response.quiz.Imagechoices, function (imageFile) {
                        return imageFile.QuestionId == qtn.ID;
                    });

                    let qtnResponse = -1;
                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = modQuestionResponse[0].QuestionResponse != undefined && modQuestionResponse[0].QuestionResponse != "" ? parseInt(modQuestionResponse[0].QuestionResponse) : "";

                    }
                    let ctl = '<br/><div> <input type="hidden" value="" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '"  />';
                    if (qtnImagechoices.length > 0) {
                        for (let i = 0; i < ENTQuiz.Response.quiz.ImageChoices.length; i++) {
                            ctl += '<img class="ImageChoiceDisabled" ' +
                                (qtnResponse != -1 && qtnResponse == qtnImagechoices[i].FileIdx ? 'ActiveRating' : '') +
                                ' src="data:image/jpg;base64,' + qtnImagechoices[i].FileContentAsBytes + '" title="' + qtnImagechoices[i].FileName + '"  data-imagegroup="ent_mod_q' + qtn.ID + '"  /> &nbsp; ';
                        }
                    }
                    else {
                        ctl += '<div style="color:coral;font-size:15px;font-weight:bold;">Image files not found</div>';
                    }
                    ctl += "</div><br />";
                    return ctl;
                }


                return "";
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
                        '</div>';

                    let qtnCntrDisplay = 0;
                    let htmlQuizQuestions = this.quiz.Questions.map(function (o, idx) {

                        if (o.ParentBranchID == 0) {
                            qtnCntrDisplay++;
                            let htmlQuizQuestion = '';
                            if (o.DataTypeID != 4) {
                                htmlQuizQuestion += '<div class="entQuizQuestionContainer">' +
                                    '<div class="entQuizQuestion">' + (qtnCntrDisplay) + ' . &nbsp; '+ 
                                    (ENTQuiz.Response.userLanguage == 1 ? o.Question : o.Question_En) +
                                    '</div>' +
                                    '<div class="entQuizQuestionControl" data-qtnid="' + o.ID + '" data-datatypeid="' + o.DataTypeID + '" >' +
                                    ENTQuiz.Response.getQuestionControlWithValue(o) +
                                    '</div>' +
                                    '</div>';
                            }
                            else {

                                //checkbox
                                htmlQuizQuestion += '<div class="entQuizQuestionContainer">' +
                                    '<div class="entQuizQuestion" >' + (qtnCntrDisplay) + ' . &nbsp; ' +
                                    '<span class="entQuizQuestionControl" style="padding:1%;" data-qtnid="' + o.ID + '" data-datatypeid="' + o.DataTypeID + '" style="padding:1%;" > ' +
                                    ENTQuiz.Response.getQuestionControlWithValue(o) +
                                    '</span>' +
                                    (ENTQuiz.Response.userLanguage == 1 ? o.Question : o.Question_En) +
                                    '</div>' +
                                    '</div>';
                            }

                            let htmlQuizQuestionBranches = '';
                            if (o.DataTypeID == 13) {

                                let quizResponse = ENTQuiz.Response.quizResult.quizResponses[0];
                                let Specs = $.parseJSON(o.Specs);

                                let qtnResponse = -1;
                                let style_Displayblock = ' style="display:block;" ';

                                if (quizResponse != undefined &&
                                    quizResponse.QuizQuestionResponses != undefined &&
                                    quizResponse.QuizQuestionResponses.length > 0) {
                                    let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                                        return (oQuizQuestionResponse.ID == qtn.ID);
                                    });
                                    qtnResponse = (modQuestionResponse[0].QuestionResponse != undefined ? parseInt(modQuestionResponse[0].QuestionResponse) : -1);
                                }

                                let branchQuestions = $.grep(ENTQuiz.Response.quiz.Questions, function (qtn) {
                                    return qtn.ParentBranchID == o.ID;
                                });

                                if (branchQuestions != undefined && branchQuestions.length > 0) {
                                    let optionsCount = (ENTQuiz.Response.userLanguage ? Specs.ar.length : Specs.en.length);
                                    for (let i = 0; i < optionsCount; i++) {
                                        let branchValueQuestions = $.grep(branchQuestions, function (qtn) { return qtn.ParentBranchValueID == i; });
                                        if (branchValueQuestions != undefined && branchValueQuestions.length > 0) {
                                            htmlQuizQuestionBranches += '<div class="branchStyle" data-branchID="' + o.ID + '_' + i + '" ' + (i == qtnResponse ? style_Displayblock : '') + '>';

                                            for (let j = 0; j < branchValueQuestions.length; j++) {
                                                htmlQuizQuestionBranches += '<div class="'((j + 1) != branchValueQuestions.length ? 'entQuizQuestionContainer' : 'entQuizQuestionContainerBranched') + '">' +
                                                    '<div class="quizQuestion">(' + qtnCntrDisplay + '.' + (j + 1) + '). &nbsp; ' +
                                                    (ENTQuiz.Response.userLanguage == 1 ? branchValueQuestions[j].Question : branchValueQuestions[j].Question_En) +
                                                    '</div>' +
                                                    '<div class="entQuizQuestionControl" data-qtnid="' + branchValueQuestions[j].ID + '" data-datatypeid="' + branchValueQuestions[j].DataTypeID + '" >' +
                                                    ENTQuiz.Response.getQuestionControlWithValue(branchValueQuestions[j]) +
                                                    '</div>' +
                                                    '</div>';
                                            }
                                            htmlQuizQuestionBranches += "</div>";
                                        }
                                    }
                                }
                            }

                            return htmlQuizQuestion + htmlQuizQuestionBranches;
                        }

                    }).join('');
                    $('.entQuizHeaderContainer').html(htmlQuizHeader);
                    $('.entQuizQuestionsContainer').html(htmlQuizQuestions);

                }
            },
            cancelQuiz: function () {
                window.location = '/pages/quiz/MyResponses.aspx';
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