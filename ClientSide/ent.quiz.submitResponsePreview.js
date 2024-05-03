(
    function () {
        'use strict';
        ENTQuiz.Response = {

            userLanguage: 0,
            apiPath: "",
            quiz: {},
            quizMessage: {
                loaded: false,
                Welcome: "",
                Thankyou: "",
                Pass: "",
                Fail: ""
            },
            fetched: false,

            getQuizMessages: function (messageId) {
                let apiPath_item = _spPageContextInfo.webAbsoluteUrl + "/api/web/lists/getbytitle('QuizMessages')/items?$filter=ID eq " + messageId + "&$select=ID,WelcomeMessage,ThankyouMessage,PassMessage,FailMessage";
                $.ajax({
                    url: apiPath_item,
                    headers: {
                        Accept: "application/json;odata=verbose"
                    },
                    async: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data_item) {
                        if (data_item != undefined && data_item.d.results.length > 0) {
                            ENTQuiz.Response.quizMessage.loaded = true;
                            ENTQuiz.Response.quizMessage.Welcome = data_item.d.results[0].WelcomeMessage;
                            ENTQuiz.Response.quizMessage.Thankyou = data_item.d.results[0].ThankyouMessage;
                            ENTQuiz.Response.quizMessage.Pass = data_item.d.results[0].PassMessage;
                            ENTQuiz.Response.quizMessage.Fail = data_item.d.results[0].FailMessage;
                            $(".entQuizDataLoaderMessage").hide();
                            if (ENTQuiz.Response.quiz.HasThankyouMessage)
                                $(".entQuizResponseAcknowledgement").html(ENTQuiz.Response.quizMessage.Thankyou);
                            if (ENTQuiz.Response.quiz.HasWelcomeMessage) {
                                $(".entQuizResponseWelcome").html(ENTQuiz.Response.quizMessage.Welcome);
                                $(".entQuizResponseWelcomeContainer").show();
                            }
                            else {
                                ENTQuiz.Response.proceedToQuiz();
                            }

                        }
                    },
                    error: function (errordata) {
                        console.log(errordata);
                        $(".entQuizContainer").html("<div class='ErrorDiv'> Sorry ! Error occured while fetching Quiz Questions. Please try again after some time. <br/> If problem persists, contact IT helpdesk.</div>");
                    },
                });
            },
            proceedToQuiz: function () {
                $(".entQuizResponseWelcomeContainer").hide();
                if (ENTQuiz.Response.quiz.Language == 3) {
                    $(".entQuizDataLoaderMessage").hide();
                    $(".entQuizLanguage").show();
                }
                else {
                    $(".entQuizDataLoaderMessage").hide();
                    ENTQuiz.Response.SetUserLanguage(ENTQuiz.Response.quiz.Language);
                }
            },
            initializePage: function () {
                this.fetched = false;
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apiPath + '/getActiveQuizPreview?quizId=' + quizId;
                    this.getActiveQuiz(apiPath_item);
                }
                else {
                    console.log("Quiz not selected ");
                    if (ENTQuiz.Common.getUrlParams("quizId") == undefined)
                        $(".entQuizContainer").html("<divclass='ErrorDiv'>Quiz not selected <br/> For additional info, please contact IT helpdesk </div>");
                }
            },
            getActiveQuiz: function (apiPath_item) {
                $.ajax({
                    url: apiPath_item,
                    // data: {
                    //     absolutePath: location.pathname,
                    // },
                    headers: {
                        Accept: "application/json;odata=verbose"
                    },
                    async: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data_items) {
                        ENTQuiz.Response.OnGetQuiz_Success(data_items);
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
            OnGetQuiz_Success: function (data_item) {
                //console.log("OnGetQuizResponse_Success");
                //console.log(data_item);
                if (data_item != undefined && data_item.ErrorCode == undefined) {

                    this.quiz = data_item;
                    this.fetched = true;
                    if (this.quiz.MessageId != undefined &&
                        this.quiz.MessageId > 0
                        //&&(this.quiz.HasWelcomeMessage || this.quiz.HasThankyouMessage)
                    ) {
                        ENTQuiz.Response.getQuizMessages(this.quiz.MessageId);
                    }
                    else {
                        ENTQuiz.Response.proceedToQuiz();
                    }

                }
                else {
                    if (data_item == undefined) {
                        console.log("Selected Quiz does not exist anymore");
                        $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! Selected Quiz does not exist anymore<br />For additionl info, please contact IT Helpdesk</div>");
                    }
                    else {
                        $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching Quiz questions. Please try again after some time. <br/> If Problem persists, contact IT Helpdesk</div><div style='margin:5%;color:coral'>" + data_item.ErrorMessage + "</div>");
                    }
                }
            },
            imagesLoaded: true,
            imagesAnswerLoaded: true,
            getQuestionControl: function (qtn) {

                /*
                1 - RadioButtons
                2 - ImageChoices
                3 - Date
                4 - DropDown
                5 - MultiCheckboxes
                6 - Ranking                
                */

                //Radiobuttons
                if (qtn.DataTypeID == 1) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                    }

                    let ctl = '<div ' + validationAttributes + '>';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    ctl += '<table ' + (ENTQuiz.Response.userLanguage == 1 ? ' dir="rtl" ' : ' dir="ltr" ') + ' style="width:100%" >'
                    for (let i = 0; i < 5 && i < optionsCount; i++) {
                        if (optionsCount <= 5) {
                            ctl += '<tr><td class="multiChkBoxStyle" style="width:100%"><input type="radio"  name="ent_mod_q' +
                                qtn.ID + '" value="' + i + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</td></tr>';
                        }
                        else if (optionsCount <= 10) {
                            ctl += '<tr><td class="multiChkBoxStyle" style="width:50%"><input type="radio"  name="ent_mod_q' +
                                qtn.ID + '" value="' + i + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</td>';
                            if ((i + 5) < optionsCount) {
                                ctl += '<td class="multiChkBoxStyle" style="width:50%"><input type="radio"  name="ent_mod_q' +
                                    qtn.ID + '" value="' + (i + 5) + '"   /> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                    '</td></tr>';
                            }
                            else {
                                ctl += '<td class="multiChkBoxStyle" style="width:50%"></td></tr>';
                            }
                        }
                        else if (optionsCount <= 15) {
                            ctl += '<tr><td class="multiChkBoxStyle" style="width:33%"><input type="radio"  name="ent_mod_q' +
                                qtn.ID + '" value="' + i + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</td>';
                            ctl += '<td class="multiChkBoxStyle" style="width:33%"><input type="radio"  name="ent_mod_q' +
                                qtn.ID + '" value="' + (i + 5) + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                '</td>';
                            if ((i + 10) < optionsCount) {
                                ctl += '<td class="multiChkBoxStyle" style="width:33%"><input type="radio"  name="ent_mod_q' +
                                    qtn.ID + '" value="' + (i + 10) + '"   /> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) +
                                    '</td></tr>';
                            }
                            else {
                                ctl += '<td class="multiChkBoxStyle" style="width:33%"></td></tr>';
                            }
                        }
                        else if (optionsCount <= 20) {
                            ctl += '<tr><td class="multiChkBoxStyle" style="width:25%"><input type="radio"  name="ent_mod_q' +
                                qtn.ID + '" value="' + i + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</td>';
                            ctl += '<td class="multiChkBoxStyle" style="width:25%"><input type="radio"  name="ent_mod_q' +
                                qtn.ID + '" value="' + (i + 5) + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                '</td>';
                            ctl += '<td class="multiChkBoxStyle" style="width:25%"><input type="radio"  name="ent_mod_q' +
                                qtn.ID + '" value="' + (i + 10) + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) +
                                '</td></tr>';
                            if ((i + 15) < optionsCount) {
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"><input type="radio"  name="ent_mod_q' +
                                    qtn.ID + '" value="' + (i + 15) + '"   /> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 15].trim() : Specs.en[i + 15].trim()) +
                                    '</td></tr>';
                            }
                            else {
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"></td></tr>';
                            }
                        }
                    }
                    ctl += '</table>';
                    ctl += '</div>';
                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span>' + ctl + '</div>';

                }
                //Image Choices
                else if (qtn.DataTypeID == 2) {
                    let qtnImagechoices = $.grep(ENTQuiz.Response.quiz.Imagechoices, function (imageFile) {
                        return imageFile.QuestionId == qtn.ID;
                    });
                    let Specs = $.parseJSON(qtn.Specs);
                    let answer = $.parseJSON(qtn.Answer);
                    let imageSize = Specs.size;
                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';

                    }

                    let ctl = '<br/><div> <input type="hidden" value="" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '"  ' + validationAttributes + ' />';
                    if (qtnImagechoices.length > 0) {
                        for (let i = 0; i < qtnImagechoices.length; i++) {
                            ctl += '<img src="data:image/jpg;base64,' + qtnImagechoices[i].FileContentAsBytes + '" title="' + qtnImagechoices[i].FileName + '" class="ImageChoice imageSize' + imageSize + '" data-imagegroup="ent_mod_q' + qtn.ID + '" onclick="return ENTquiz.Response.setImageChoice(this,' + qtn.ID + ',' + qtnimageChoices[i].FileIdx + ')" /> &nbsp; ';
                        }
                    }
                    else {
                        ENTQuiz.Response.imagesLoaded = false;
                        ctl += '<div style="color:coral;font-size:15px;font-weight:bold;">Image files not found</div>' +
                            '<div><button class="modBtnstyle" onclick="ENTQuiz.Response.AddImageFiles(); return false;">Add Image Files</button></div>';
                    }
                    if (answer == undefined || answer.ans == undefined || answer.ans == "") {
                        ENTQuiz.Response.imagesAnswerLoaded = false;
                        ctl += '<div style="color:coral;font-size:15px;font-weight:bold;">Image answer not found</div>';
                    }
                    ctl += "</div><br />";
                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q_' + qtn.ID + 'Error"></span>' + ctl + '</div>';

                }
                //Date
                else if (qtn.DataTypeID == 3) {
                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                        //if (validationSpecs.min != undefined) validationAttributes += ' data-min="' + validationSpecs.min + '"';
                        //if (validationSpecs.max != undefined) validationAttributes += ' data-max="' + validationSpecs.max + '"';
                    }

                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span><input class="entModQtnCtl" type="date" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '"  ' + validationAttributes + ' /></div>';

                }
                //Dropdown
                else if (qtn.DataTypeID == 4) {
                    let Specs = $.parseJSON(qtn.Specs);

                    let ctl = '<div><select class="entModQtnCtl" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" > ';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    //ctl += '<option value="" >' + (ENTQuiz.Response.userLanguage == 1 ? '-select-' : '-select-') + '</option>';
                    for (let i = 0; i < optionsCount; i++) {
                        ctl += '<option value="' + i + '" >' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + '</option>';
                    }
                    ctl += '</select></div>';

                    return ctl;
                }
                //MultiCheckboxes
                else if (qtn.DataTypeID == 5) {
                    let Specs = $.parseJSON(qtn.Specs);

                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                    }

                    let ctl = '<div ' + validationAttributes + '>';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);

                    ctl += '<table ' + (ENTQuiz.Response.userLanguage == 1 ? ' dir="rtl" ' : ' dir="ltr" ') + ' style="width:100%">';
                    for (let i = 0; i < 5 && i < optionsCount; i++) {
                        if (optionsCount <= 5) {
                            ctl += '<tr><td class="multiChkBoxStyle" style="width:100%"><input type="checkbox"  name="ent_mod_q' +
                                qtn.ID + '" value="' + i + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</td></tr>';
                        }
                        else if (optionsCount <= 10) {
                            ctl += '<tr><td class="multiChkBoxStyle" style="width:50%"><input type="checkbox"  name="ent_mod_q' +
                                qtn.ID + '" value="' + i + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</td>';
                            if ((i + 5) < optionsCount) {
                                ctl += '<td class="multiChkBoxStyle" style="width:50%"><input type="checkbox"  name="ent_mod_q' +
                                    qtn.ID + '" value="' + (i + 5) + '"   /> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                    '</td></tr>';
                            }
                            else {
                                ctl += '<td class="multiChkBoxStyle" style="width:50%"></td></tr>';
                            }
                        }
                        else if (optionsCount <= 15) {
                            ctl += '<tr><td class="multiChkBoxStyle" style="width:33%"><input type="checkbox"  name="ent_mod_q' +
                                qtn.ID + '" value="' + i + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</td>';
                            ctl += '<td class="multiChkBoxStyle" style="width:33%"><input type="checkbox"  name="ent_mod_q' +
                                qtn.ID + '" value="' + (i + 5) + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                '</td>';
                            if ((i + 10) < optionsCount) {
                                ctl += '<td class="multiChkBoxStyle" style="width:33%"><input type="checkbox"  name="ent_mod_q' +
                                    qtn.ID + '" value="' + (i + 10) + '"   /> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) +
                                    '</td></tr>';
                            }
                            else {
                                ctl += '<td class="multiChkBoxStyle" style="width:33%"></td></tr>';
                            }
                        }
                        else if (optionsCount <= 20) {
                            ctl += '<tr><td class="multiChkBoxStyle" style="width:25%"><input type="checkbox"  name="ent_mod_q' +
                                qtn.ID + '" value="' + i + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</td>';
                            ctl += '<td class="multiChkBoxStyle" style="width:25%"><input type="checkbox"  name="ent_mod_q' +
                                qtn.ID + '" value="' + (i + 5) + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                '</td>';
                            ctl += '<td class="multiChkBoxStyle" style="width:25%"><input type="checkbox"  name="ent_mod_q' +
                                qtn.ID + '" value="' + (i + 10) + '"   /> &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) +
                                '</td></tr>';
                            if ((i + 15) < optionsCount) {
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"><input type="checkbox"  name="ent_mod_q' +
                                    qtn.ID + '" value="' + (i + 15) + '"   /> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 15].trim() : Specs.en[i + 15].trim()) +
                                    '</td></tr>';
                            }
                            else {
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"></td></tr>';
                            }
                        }
                    }
                    ctl += '</table>';
                    ctl += '</div>';
                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span>' + ctl + '</div>';



                }
                //RankingQuestion
                else if (qtn.DataTypeID == 6) {
                    let Specs = $.parseJSON(qtn.Specs);

                    let ctl = '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    for (let i = 0; i < optionsCount; i++) {

                        ctl += '<div class="RankingQuestionRow">' +
                            '<select name="ent_mod_q' + qtn.ID + '_' + i + '" >';
                        for (let j = 0; j < optionsCount; j++) {
                            ctl += '<option value="' + (j + 1) + '" >' + (j + 1) + '</option>';
                        }
                        ctl += '</select> &nbsp; &nbsp; ';

                        ctl += '<span class="RankingQuestion">' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + '</span>';

                        ctl += '</div>';
                    }
                    ctl += '</div>';

                    return ctl;
                }

                return "";
            },
            setImageChoice: function (btnRating, qtnID, ratingValue) {
                $("#ent_mod_q" + qtnID).val(ratingValue + 1);
                $("img[data-imagegroup='" + $(btnRating).data("imagegroup") + "']").removeClass("ActiveRating");
                $(btnRating).addClass('ActiveRating');
                return false;
            },
            renderQuiz: function () {
                if (this.quiz != undefined &&
                    this.quiz.Questions != undefined &&
                    this.quiz.Questions.length > 0) {

                    let quizId = this.quiz.ID;
                    $("#ent_quizId").val(quizId);
                    $("#ent_deptId").val(this.quiz.DepartmentId);
                    if (this.quiz.Status == 0) {
                        $("#btnPublishQuiz").show();
                        $("#btnEditQuiz").show();
                    }
                    else {
                        $("#btnViewQuiz").show();
                    }

                    $(".entQuizResponseContainer").show();

                    if (this.userLanguage == 1) {
                        $(".entQuizResponseContainer").removeClass("DirectionLTR");
                        $(".entQuizResponseContainer").addClass("DirectionRTL");
                        $(".entQuizResponseContainer").attr("dir", "rtl");
                        $("[name='btnModSubmit']").text("SubmitInArabic");
                        $("[name='btnModCancel']").text("CancelInArabic");
                        $("#btnPublishQuiz").text("Publish in Arabic");

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
                        '<div class="entQuizDescription">Pass Score : ' + this.quiz.PassScore + '</div>';

                    let qtnCntrDisplay = 0;
                    let htmlQuizQuestions = '';
                    ENTQuiz.Response.isValidData = true;
                    if (this.quiz.RandomOrderQuestions) {
                        this.shuffleQuestions();
                    }
                    htmlQuizQuestions = this.quiz.Questions.map(function (o, idx) {

                        qtnCntrDisplay++;
                        let htmlQuizQuestion = '';

                        htmlQuizQuestion += '<div class="entQuizQuestionContainer">' +
                            '<div class="entQuizQuestion">' + (qtnCntrDisplay) + ' . &nbsp; ' +
                            (ENTQuiz.Response.userLanguage == 1 ? o.Question : o.Question_En) +
                            '</div>' +
                            '<div class="entQuizQuestionControl" data-qtnid="' + o.ID + '" data-datatypeid="' + o.DataTypeID + '" >' +
                            ENTQuiz.Response.getQuestionControl(o) +
                            '</div>' +
                            '</div>';

                        return htmlQuizQuestion;


                    }).join('');

                    $('.entQuizHeaderContainer').html(htmlQuizHeader);
                    $('.entQuizQuestionsContainer').html(htmlQuizQuestions);

                }
            },
            shuffleQuestions: function () {
                var curIdx = this.quiz.Questions.length, randomIdx;
                while (curIdx != 0) {
                    randomIdx = Math.floor(Math.random() * curIdx);
                    curIdx--;
                    [this.quiz.Questions[curIdx], this.quiz.Questions[randomIdx]] =
                        [this.quiz.Questions[randomIdx], this.quiz.Questions[curIdx]];
                }
            },

            quizResult: {},
            fetchedResponse: false,
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
                let qtnList = $.grep(ENTQuiz.Response.quiz.Questions, function (data_item) { return data_item.ID == quizQuestionResponse.ID });
                if (qtnList != null && qtnList.length > 0) {
                    let qtn = qtnList[0];
                    //Radiobutton 
                    if (qtn.DataTypeID == 1) {
                        let Specs = $.parseJSON(qtn.Specs);
                        let qtnResponse = -1;
                        qtnResponse = quizQuestionResponse.QuestionResponse != undefined ? parseInt(quizQuestionResponse.QuestionResponse) : -1;
                        let answer = $.parseJSON(qtn.Answer);
                        if (qtnResponse >= 0)
                            isCorrect = (ENTQuiz.Response.quiz.Language == 1 ? (Specs.ar[qtnResponse].trim() == answer.ar.trim() ? true : false) : (Specs.en[qtnResponse].trim() == answer.en.trim() ? true : false));
                        return isCorrect;

                    }
                    //ImageChoice 
                    else if (qtn.DataTypeID == 2) {
                        //let Specs = $.parseJSON(qtn.Specs);
                        let qtnResponse = -1;
                        qtnResponse = quizQuestionResponse.QuestionResponse != undefined && quizQuestionResponse.QuestionResponse != "" ? parseInt(quizQuestionResponse.QuestionResponse) : "";

                        if (qtn.Answer != undefined && qtn.Answer != "") {

                            let oAnswer = $.parseJSON(qtn.Answer);
                            let answer = parseInt(oAnswer.ans);
                            isCorrect = (qtnResponse == (answer));
                        }

                        return isCorrect;
                    }
                    //Date 
                    else if (qtn.DataTypeID == 3) {
                        let qtnResponse = '';
                        qtnResponse = quizQuestionResponse.QuestionResponse;

                        if (qtn.Answer != undefined && qtn.Answer != "") {

                            let answer = $.parseJSON(qtn.Answer);
                            let date_answer = answer.ans;
                            isCorrect = (qtnResponse.trim() == date_answer.trim());
                        }
                        return isCorrect;
                    }
                    //Dropdown 
                    else if (qtn.DataTypeID == 4) {
                        let Specs = $.parseJSON(qtn.Specs);
                        let qtnResponse = -1;
                        qtnResponse = parseInt(quizQuestionResponse.QuestionResponse);

                        if (qtn.Answer != undefined && qtn.Answer != "") {

                            let answer = $.parseJSON(qtn.Answer);
                            isCorrect = (ENTQuiz.Response.quiz.Language == 1 ? (Specs.ar[qtnResponse].trim() == answer.ar.trim() ? true : false) : (Specs.en[qtnResponse].trim() == answer.en.trim() ? true : false));
                        }
                        return isCorrect;
                    }

                    //MultiCheckboxes 
                    else if (qtn.DataTypeID == 5) {
                        let Specs = $.parseJSON(qtn.Specs);
                        let qtnResponse = [];
                        qtnResponse = quizQuestionResponse.QuestionResponse != undefined && quizQuestionResponse.QuestionResponse != "" ? parseInt(quizQuestionResponse.QuestionResponse) : [];

                        let isAllCorrect = true;
                        if (qtn.Answer != undefined && qtn.Answer != "") {

                            let answer = $.parseJSON(qtn.Answer);
                            let answer_optionsCount = (ENTQuiz.Response.quiz.Language == 1 ? answer.ar.length : answer.en.length);
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

                        }
                        return isAllCorrect;
                    }

                    //RankingQuestion 
                    else if (qtn.DataTypeID == 6) {

                        let qtnResponse = [];
                        qtnResponse = quizQuestionResponse.QuestionResponse != undefined && quizQuestionResponse.QuestionResponse != "" ? parseInt(quizQuestionResponse.QuestionResponse) : [];

                        if (qtn.Answer != undefined && qtn.Answer != "") {

                            let answer = $.parseJSON(qtn.Answer);
                            if (qtnResponse == undefined || qtnResponse.length != answer.ans.length)
                                return false
                            else {
                                for (let a = 0; a < answer.ans.length; a++) {
                                    if (qtnResponse[a].RowResponse != answer.ans[a])
                                        return false;
                                }
                            }
                            return true;
                        }
                    }
                }

                return false;
            },
            ProcessQuizResponse: function () {
                let score = ENTQuiz.Response.getScore(ENTQuiz.Response.quizResponse);
                if (score >= ENTQuiz.Response.quiz.PassScore) {
                    $(".entQuizResponseAcknowledgement").html(ENTQuiz.Response.quizMessage.Pass);
                }
                else
                    $(".entQuizResponseAcknowledgement").html(ENTQuiz.Response.quizMessage.Fail);

            },

            isValidData: true,
            submitQuiz: function (respStatus) {
                //console.log("Submit invoked");
                ENTQuiz.Response.isSubmitted = false;

                let quizResponse = ENTQuiz.Response.getQuizResponseFromForm();
                quizResponse.ResponseStatus = respStatus;
                ENTQuiz.Response.quizResponse = quizResponse;

                if (ENTQuiz.Response.isValidData) {

                    $(".entQuizContainer").hide();
                    if (ENTQuiz.Response.quiz.HasThankyouMessage) {
                        $(".entQuizResponseAcknowledgement").html(ENTQuiz.Response.quizMessage.ThankyouMessage);

                    }
                    else {
                        $(".entQuizResponseAcknowledgement").html("Processing result. Please wait ...")
                        ENTQuiz.Response.ProcessQuizResponse();

                    }
                    $(".entQuizResponseAcknowledgementContainer").show();
                    $("#btnThankyou").show();
                    $("#btnShowScore").show();


                }
                else {
                    console.log("Data Validations failed");
                }
            },
            isSubmitted: false,
            quizResponse: {},

            constants: {
                Required: {
                    ar: "Arabic - *Required",
                    en: "*Required"
                },
                ExceededMaxChars: {
                    ar: "Arabic - *Exceeded Max number of characters",
                    en: "Exceeded Max number of characters"
                },
                emojisText: {
                    ar: ["Extremely Satisfied", "Above Expectations", "Meets Expectations", "Below Expectation", "Extremely Unsatisfied"],
                    en: ["Extremely Satisfied", "Above Expectations", "Meets Expectations", "Below Expectation", "Extremely Unsatisfied"],
                },
                MinDate: {
                    ar: "Date Must be greater than Min Date",
                    en: "Date Must be greater than Min Date"
                },
                MaxDate: {
                    ar: "Date Must be less than Max Date",
                    en: "Date Must be less than Max Date"
                },
            },
            getValidationError: function (qtnDataTypeID, qtnId, qtnResponse, item) {
                let errorMsg = "";
                let qtnCtl_Error = $(item).find('[name="ent_mod_q_' + qtnId + 'Error"]');

                //RadioButton //MultipleCheckbox 
                if (qtnDataTypeID == 1 ||
                    qtnDataTypeID == 5) {
                    let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                    $(qtnCtl).removeClass("NotValidData");
                    if (qtnCtl_Error != undefined && qtnCtl_Error.length > 0) {
                        let isrequired = $(qtnCtl).parent().parent().parent().parent().parent().data("isrequired");
                        if (isrequired && (qtnResponse == undefined || qtnResponse.trim() == "")) {
                            ENTQuiz.Response.isValidData = false;
                            errorMsg = (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.Required.ar : ENTQuiz.Response.constants.Required.en);
                            $(qtnCtl).addClass("NotValidData");
                        }
                    }
                    $(qtnCtl_Error).html(errorMsg);
                }

                //ImageChoices
                else if (qtnDataTypeID == 2) {
                    let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                    $(qtnCtl).parent().parent().removeClass("NotValidData");
                    if (qtnCtl_Error != undefined && qtnCtl_Error.length > 0) {
                        let isrequired = $(qtnCtl).data("isrequired");
                        if (isrequired && (qtnResponse == undefined || qtnResponse.trim() == "")) {
                            ENTQuiz.Response.isValidData = false;
                            errorMsg += (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.Required.ar : ENTQuiz.Response.constants.Required.en) + "<br />";
                            $(qtnCtl).parent().parent().addClass("NotValidData");
                        }
                    }
                    $(qtnCtl_Error).html(errorMsg);
                }

                //Date
                else if (qtnDataTypeID == 3) {
                    let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                    $(qtnCtl).removeClass("NotValidData");
                    if (qtnCtl_Error != undefined && qtnCtl_Error.length > 0) {
                        let isrequired = $(qtnCtl).data("isrequired");
                        if (isrequired && (qtnResponse == undefined || qtnResponse.trim() == "")) {
                            ENTQuiz.Response.isValidData = false;
                            errorMsg += (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.Required.ar : ENTQuiz.Response.constants.Required.en) + "<br />";
                            $(qtnCtl).addClass("NotValidData");
                        }

                        $(qtnCtl_Error).html(errorMsg);
                    }
                }

            },
            getQuizResponseFromForm: function () {
                ENTQuiz.Response.isValidData = true;
                let quizId = parseInt($("#ent_quizId").val());
                let deptId = parseInt($("#ent_deptId").val());
                let quizResponse = {
                    QuizID: quizId,
                    DepartmentId: deptId,
                    QuizQuestionResponses: [],
                    Language: ENTQuiz.Response.userLanguage,
                    ResponseStatus: 0,
                };

                $(".entQuizQuestionControl").each(function (idx, item) {
                    let qtnDataTypeID = $(item).data("datatypeid");
                    let qtnId = $(item).data("qtnid");
                    let qtnResponse = "";

                    /*
                        1 - RadioButtons
                        2 - ImageChoices
                        3 - Date
                        4 - DropDown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                    */

                    //Radiobuttons
                    if (qtnDataTypeID == 1) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]:checked');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                        }
                        ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);

                    }

                    //ImageChoices
                    else if (qtnDataTypeID == 2) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                        }
                        ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);

                    }
                    //Date
                    else if (qtnDataTypeID == 3) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                            ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);
                        }
                    }
                    //Dropdown
                    else if (qtnDataTypeID == 4) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                            //ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);
                        }
                    }

                    //MultiCheckboxes
                    else if (qtnDataTypeID == 5) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]:checked');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            $(qtnCtl).each(function (idx, chk) {
                                if (idx > 0) qtnResponse += ",";
                                qtnResponse += '"' + chk.value + '"';
                            });
                            qtnResponse = '[' + qtnResponse + ']';
                            ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);
                        }
                    }
                    //RankingQuestion
                    else if (qtnDataTypeID == 6) {
                        let rows = $(item).find(".RankingQuestion");
                        let rowsCount = rows.length;

                        for (let i = 0; i < rowsCount; i++) {
                            let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '_' + i + '"]');
                            if (qtnCtl != undefined && qtnCtl.length > 0) {
                                if (i > 0) qtnResponse += ',';
                                qtnResponse += JSON.stringify({
                                    RowID: i,
                                    RowResponse: $(qtnCtl).val()
                                }, null);
                            }
                        }
                        qtnResponse = '[' + qtnResponse + ']';
                    }

                    quizResponse.QuizQuestionResponses.push({
                        ID: qtnId,
                        DataTypeID: qtnDataTypeID,
                        QuestionResponse: qtnResponse
                    });

                });
                return quizResponse;
            },
            cancelQuiz: function () {
                if (ENTQuiz.Common.getUrlParams("IsDlg") != undefined) {
                    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
                        SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel, null);
                        window.location = _spPageContextInfo.webAbsoluteUrl;
                    });
                }

                window.location = _spPageContextInfo.webAbsoluteUrl;
            },
            editQuiz: function () {
                let quizId = ENTQuiz.Common.getUrlParams("quizId");
                window.location = 'EditQuiz.aspx?quizId=' + quizId;
            },

            publishQuiz: function () {
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apiPath + '/publishQuiz?quizId=' + quizId + '&absolutePath=' + location.pathname;

                    $.ajax({
                        type: 'POST',
                        url: apiPath_item,
                        //data: ENTQuiz.Response.quizResponse,
                        headers: {
                            Accept: "application/json;odata=verbose"
                        },
                        async: true,

                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data_items) {
                            alert("Quiz Published successfully");
                            window.location = "ManageQuizs.aspx";
                        },
                        error: function (errordata) {
                            console.log(errordata);

                            alert("Error occured while publishing Quiz");
                        }

                    });
                }
                else {

                    alert("Quiz not selected");
                }
            },
            ShowPublishQuiz: function () {
                if (this.imagesLoaded && this.imagesAnswerLoaded) {
                    $(".entQuizContainer").hide();
                    $(".entQuizResponsePublishConfirmationContainer").show();
                }
                else {
                    if (!this.imagesLoaded) {
                        alert("Unable to publish form due to incomplete information");
                    }
                    else if (!this.imagesAnswerLoaded) {
                        alert("Unable to publish form due to incomplete information");
                    }
                }
            },
            BackToQuizView: function () {
                $(".entQuizContainer").show();
                $(".entQuizResponsePublishConfirmationContainer").hide();
            },
            AddimageFiles: function () {
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    window.location = "AddImageFiles.aspx?quizId=" + quizId;
                    return false;
                }
            },
            viewQuiz: function () {
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    window.location = "ViewQuiz.aspx?quizId=" + quizId;
                    return false;
                }
            },
            /////////////////////////////Show Score /////////////////////////
            scoreCount: 0,

            getQuestionControlWithValue: function (qtn) {

                /*
                        1 - RadioButtons
                        2 - ImageChoices
                        3 - Date
                        4 - DropDown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                */

                let quizResponse = ENTQuiz.Response.quizResponse;

                //Radiobuttons
                if (qtn.DataTypeID == 1) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let answer = $.parseJSON(qtn.Answer);

                    let qtnResponse = -1;

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = quizQuestionResponse[0].QuestionResponse != undefined ? parseInt(quizQuestionResponse[0].QuestionResponse) : -1;
                    }

                    let isCorrectAns = false;
                    if (qtnResponse >= 0) {
                        if (ENTQuiz.Response.userLanguage == 1) {
                            isCorrectAns = (Specs.ar[qtnResponse].trim() == answer.ar.trim());
                        }
                        else {
                            isCorrectAns = (Specs.en[qtnResponse].trim() == answer.en.trim());
                        }
                    }


                    let ctl = '';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    ///////////////////////////////////////////////////

                    if (ENTQuiz.Response.AllowViewResponse) {
                        ctl += '<table ' + (ENTQuiz.Response.userLanguage == 1 ? ' dir="rtl" ' : ' dir="ltr" ') + ' style="width:100%" >'
                        for (let i = 0; i < 5 && i < optionsCount; i++) {
                            if (optionsCount <= 5) {
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:100%"><span class="multiChkBoxStyle ' +
                                    (i == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                    '"><i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    '</span></td></tr>';
                            }
                            else if (optionsCount <= 10) {
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:50%"><span class="multiChkBoxStyle ' +
                                    (i == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                    '"><i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    '</span></td>';
                                if ((i + 5) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="width:50%"><span class="multiChkBoxStyle ' +
                                        ((i + 5) == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                        '"><i class="far fa' + ((i + 5) == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                        '</span></td></tr>';
                                }
                                else {
                                    ctl += '<td class="multiChkBoxStyle" style="width:50%"></td></tr>';
                                }
                            }
                            else if (optionsCount <= 15) {
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:33%"><span class="multiChkBoxStyle ' +
                                    (i == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                    '"><i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    '</span></td>';
                                ctl += '<td class="multiChkBoxStyle" style="width:33%"><span class="multiChkBoxStyle ' +
                                    ((i + 5) == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                    '"><i class="far fa' + ((i + 5) == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[(i + 5)].trim() : Specs.en[(i + 5)].trim()) +
                                    '</span></td>';
                                if ((i + 10) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="width:33%"><span class="multiChkBoxStyle ' +
                                        ((i + 10) == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                        '"><i class="far fa' + ((i + 10) == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[(i + 10)].trim() : Specs.en[(i + 10)].trim()) +
                                        '</span></td></tr>';
                                }
                                else {
                                    ctl += '<td class="multiChkBoxStyle" style="width:33%"></td></tr>';
                                }
                            }
                            else if (optionsCount <= 20) {
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:25%"><span class="multiChkBoxStyle ' +
                                    (i == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                    '"><i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    '</span></td>';
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"><span class="multiChkBoxStyle ' +
                                    ((i + 5) == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                    '"><i class="far fa' + ((i + 5) == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[(i + 5)].trim() : Specs.en[(i + 5)].trim()) +
                                    '</span></td>';
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"><span class="multiChkBoxStyle ' +
                                    ((i + 10) == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                    '"><i class="far fa' + ((i + 10) == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[(i + 10)].trim() : Specs.en[(i + 10)].trim()) +
                                    '</span></td></tr>';
                                if ((i + 15) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="width:25%"><span class="multiChkBoxStyle ' +
                                        ((i + 15) == qtnResponse ? (isCorrectAns ? ' correctAns ' : 'wrongAns ') : '') +
                                        '"><i class="far fa' + ((i + 15) == qtnResponse ? '-dot' : '') + '-circle"/> &nbsp; ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[(i + 15)].trim() : Specs.en[(i + 15)].trim()) +
                                        '</span></td></tr>';
                                }
                                else {
                                    ctl += '<td class="multiChkBoxStyle" style="width:25%"></td></tr>';
                                }
                            }
                        }
                        ctl += '</table>';
                    }

                    if (ENTQuiz.Response.quiz.AllowViewAnswers) {
                        ctl += '<div class="entQuizAnswerContainer"><div>Correct Answer is : ' + (ENTQuiz.Response.userLanguage == 1 ? answer.ar.trim() : answer.en.trim()) + '</div></div>';
                    }
                    if (ENTQuiz.Response.quiz.AllowViewResponse ||
                        ENTQuiz.Response.quiz.AllowViewAnswers) {
                        ctl += '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + ctl + '</div>';
                    }
                    ////////////////////////////////////////////////

                    if (qtnResponse >= 0) {
                        (ENTQuiz.Response.userLanguage == 1 ?
                            (Specs.ar[qtnResponse].trim() == answer.ar.trim() ? ENTQuiz.Response.scoreCount++ : 0) :
                            (Specs.en[qtnResponse].trim() == answer.en.trim() ? ENTQuiz.Response.scoreCount++ : 0)
                        )
                    }

                    return ctl;
                }

                //Image Choices
                else if (qtn.DataTypeID == 2) {
                    let qtnImageChoices = $.grep(ENTQuiz.Response.quiz.Imagechoices, function (imageFile) {
                        return imageFile.QuestionId == qtn.ID;
                    });
                    let Specs = $.parseJSON(qtn.Specs);

                    let qtnResponse = -1;
                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = quizQuestionResponse[0].QuestionResponse != undefined && quizQuestionResponse[0].QuestionResponse != "" ? parseInt(quizQuestionResponse[0].QuestionResponse) : "";

                    }
                    let ctl = '';
                    //////////////////////////////////////////////////////////////////////////

                    if (ENTQuiz.Response.quiz.AllowViewResponse) {
                        ctl = '<br/><div> <input type="hidden" value="" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '"  />';
                        if (qtnImageChoices.length > 0) {
                            for (let i = 0; i < ENTQuiz.Response.quiz.ImageChoices.length; i++) {
                                let activeRatingStyle = (qtnResponse != -1 &&
                                    (qtnResponse - 1) == (qtnImageChoices[i].FileIdx) ? ' ActiveRating ' : '');
                                let answerStyle = (activeRatingStyle.trim() == 'ActiveRating' ?
                                    (qtnResponse == answer ? ' correctAns ' : ' wrongAns ') : '');
                                ctl += '<img class="ImageChoiceDisabled ' + activeRatingStyle + answerStyle + '" ' +
                                    ' src="data:image/jpg;base64,' + qtnImageChoices[i].FileContentAsBytes + '" title="' + qtnImageChoices[i].FileName + '"  data-imagegroup="ent_mod_q' + qtn.ID + '"  /> &nbsp; ';
                            }
                        }
                        else {
                            ctl += '<div style="color:coral;font-size:15px;font-weight:bold;">Image files not found</div>';
                        }

                        ctl += "</div><br />";
                    }

                    if (qtnImageChoices.length > 0) {
                        if (qtn.Answer != undefined && qtn.Answer != "") {
                            let oAnswer = $.parseJSON(qtn.Answer);
                            let answer = parseInt(oAnswer.ans);
                            if (ENTQuiz.Response.quiz.AllowViewAnswers) {
                                if (answer > 0 && answer <= qtnImageChoices.length) {
                                    ctl += '<div class="entQuizAnswerContainer"><div>Correct Answer is : ' +
                                        '<img src="data:image/jpg;base64,' + qtnImageChoices[answer - 1].FileContentAsBytes +
                                        '" title="' + qtnImageChoices[answer - 1].FileName +
                                        '" class="ImageChoiceDisabled"  /> &nbsp; '
                                        + '</div></div>';
                                }
                                else {
                                    ctl += '<div class="entQuizAnswerContainer"><div>Invalid Answer Option created by Admin</div></div>';
                                }
                            }
                            if (qtnResponse == answer) ENTQuiz.Response.scoreCount++;
                        }
                        else {
                            ctl += '<div class="entQuizAnswerContainer"><div> Answer not created by Admin</div></div>';

                        }
                    }

                    //////////////////////////////////////////////////////////////////////////


                    return ctl;
                }
                //Date
                else if (qtn.DataTypeID == 3) {

                    let qtnResponse = ' - ';
                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = quizQuestionResponse[0].QuestionResponse;
                    }
                    let ctl = '';
                    let answer = $.parseJSON(qtn.Answer);
                    let date_answer = answer.ans;
                    if (ENTQuiz.Response.quiz.AllowViewAnswers) {
                        ctl += '<br/><div class="entQuizAnswerContainer"><div>Correct Answer is : ' + date_answer + '</div></div>';
                    }

                    if (qtnResponse.trim() == date_answer.trim()) ENTQuiz.Response.scoreCount++;

                    return ctl;

                }
                //Dropdown
                else if (qtn.DataTypeID == 4) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let answer = $.parseJSON(qtn.Answer);
                    let qtnResponse = -1;

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = parseInt(quizQuestionResponse[0].QuestionResponse);
                    }

                    ////////////////////////////////////////////////////////////
                    let isCorrectAns = false;
                    if (qtnResponse >= 0) {
                        if (ENTQuiz.Response.userLanguage == 1) {
                            isCorrectAns = (Specs.ar[qtnResponse].trim() == answer.ar.trim());
                        }
                        else {
                            isCorrectAns = (Specs.en[qtnResponse].trim() == answer.en.trim());
                        }
                    }
                    let ctl = '';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    if (ENTQuiz.Response.quiz.AllowViewResponse) {
                        ctl += '<span class="' + (isCorrectAns ? ' correctAns ' : ' wrongAns ') + '">';
                        ctl = '<select class="entModQtnCtl" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" disabled> ';
                        for (let i = 0; i < optionsCount; i++) {
                            if (qtnResponse == i)
                                ctl += '<option value="' + i + '" >' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + '</option>';
                        }
                        ctl += '</select></span><br />';
                    }
                    if (ENTQuiz.Response.quiz.AllowViewAnswers) {
                        ctl += '<br/><div class="entQuizAnswerContainer"><div>Correct Answer is : ' + (ENTQuiz.Response.userLanguage == 1 ? answer.ar.trim() : answer.en.trim()) + '</div></div>';
                    }

                    if (qtnResponse >= 0) {
                        (ENTQuiz.Response.userLanguage == 1 ?
                            (Specs.ar[qtnResponse].trim() == answer.ar.trim() ? ENTQuiz.Response.scoreCount++ : 0) :
                            (Specs.en[qtnResponse].trim() == answer.en.trim() ? ENTQuiz.Response.scoreCount++ : 0)
                        )
                    }
                    ////////////////////////////////////////////////////////////

                    return ctl;
                }

                //MultiCheckboxes
                else if (qtn.DataTypeID == 5) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let qtnResponse = [];

                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = quizQuestionResponse[0].QuestionResponse != undefined && quizQuestionResponse[0].QuestionResponse != "" ? $.parseJSON(quizQuestionResponse[0].QuestionResponse) : [];
                    }

                    ////////////////////////////////////////////////////////////////////////

                    let answer = $.parseJSON(qtn.Answer);
                    let answer_optionsCount = (ENTQuiz.Response.userLanguage == 1 ? answer.ar.length : answer.en.length);

                    let isAllCorrect = true;
                    if (answer_options != qtnResponse.length) isAllCorrect = false;
                    else {
                        for (let q = 0; q < qtnResponse.length; q++) {
                            if (ENTQuiz.Response.userLanguage == 1) {
                                if (Specs.ar[qtnResponse[q]].trim() != answer.ar[q].trim()) {
                                    isAllCorrect = false;
                                    break;
                                }
                            }
                            else {
                                if (Specs.en[qtnResponse[q]].trim() != answer.en[q].trim()) {
                                    isCorrect = false;
                                    break;
                                }
                            }
                        }

                    }
                    let ctl = '';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    if (ENTQuiz.Response.quiz.AllowViewResponse) {
                        ctl = '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">';

                        ctl += '<div class="' + (isAllCorrect ? ' correctAns ' : ' wrongAns ') + '">';
                        ctl += '<table ' + (ENTQuiz.Response.userLanguage == 1 ? ' dir="rtl" ' : ' dir="ltr" ') + ' style="width:100%">';
                        for (let i = 0; i < 5 && i < optionsCount; i++) {
                            let txtChecked5 = '';
                            let txtChecked10 = '';
                            let txtChecked15 = '';
                            let txtChecked20 = '';
                            if (options <= 5) {
                                for (let q = 0; q < qtnResponse.length; q++) {
                                    if (i == parseInt(qtnResponse[q])) {
                                        txtChecked5 = "-check"; break;
                                    }
                                }
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:100%"><i class="far fa' + txtChecked5 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + ' </td></tr>';
                            }
                            else if (options <= 10) {
                                for (let q = 0; q < qtnResponse.length; q++) {
                                    if (i == parseInt(qtnResponse[q])) {
                                        txtChecked5 = "-check"; break;
                                    }
                                    if ((i + 5) == parseInt(qtnResponse[q])) {
                                        txtChecked10 = "-check"; break;
                                    }
                                }
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:50%"><i class="far fa' + txtChecked5 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + ' </td>';
                                if ((i + 5) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="width:50%"><i class="far fa' + txtChecked10 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) + ' </td></tr>';

                                }
                                else {
                                    ctl += '<td class="multiChkBoxStyle" style="width:50%"> </td></tr>';

                                }
                            }

                            else if (options <= 15) {
                                for (let q = 0; q < qtnResponse.length; q++) {
                                    if (i == parseInt(qtnResponse[q])) {
                                        txtChecked5 = "-check"; break;
                                    }
                                    if ((i + 5) == parseInt(qtnResponse[q])) {
                                        txtChecked10 = "-check"; break;
                                    }
                                    if ((i + 10) == parseInt(qtnResponse[q])) {
                                        txtChecked15 = "-check"; break;
                                    }
                                }
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:33%"><i class="far fa' + txtChecked5 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + ' </td>';
                                ctl += '<td class="multiChkBoxStyle" style="width:33%"><i class="far fa' + txtChecked10 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) + ' </td></tr>';
                                if ((i + 10) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="width:33%"><i class="far fa' + txtChecked15 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) + ' </td></tr>';

                                }
                                else {
                                    ctl += '<td class="multiChkBoxStyle" style="width:33%"> </td></tr>';

                                }
                            }

                            else if (options <= 20) {
                                for (let q = 0; q < qtnResponse.length; q++) {
                                    if (i == parseInt(qtnResponse[q])) {
                                        txtChecked5 = "-check"; break;
                                    }
                                    if ((i + 5) == parseInt(qtnResponse[q])) {
                                        txtChecked10 = "-check"; break;
                                    }
                                    if ((i + 10) == parseInt(qtnResponse[q])) {
                                        txtChecked15 = "-check"; break;
                                    }

                                    if ((i + 15) == parseInt(qtnResponse[q])) {
                                        txtChecked20 = "-check"; break;
                                    }
                                }
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:25%"><i class="far fa' + txtChecked5 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + ' </td>';
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"><i class="far fa' + txtChecked10 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) + ' </td></tr>';
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"><i class="far fa' + txtChecked15 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) + ' </td></tr>';
                                if ((i + 15) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="width:25%"><i class="far fa' + txtChecked20 + '-square" /> &nbsp;  ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 15].trim() : Specs.en[i + 15].trim()) + ' </td></tr>';

                                }
                                else {
                                    ctl += '<td class="multiChkBoxStyle" style="width:25%"> </td></tr>';

                                }
                            }
                        }
                        ctl += '</table>';
                        ctl += '</div>';
                        ctl += '</div>';
                    }
                    if(ENTQuiz.Response.quiz.AllowViewAnswers){
                        let answer_ctl = '<div ><table '+(ENTQuiz.Response.userLanguage ? ' dir="rtl" ':' dir="ltr" ')+' style="width:100%;">';
                        for(let i=0;i<5 && i<answer_optionsCount;i++){
                            if(answer_optionsCount <= 5){
                                answer_ctl+='<tr><td class="answer_multiChkBoxStyle" style="width:100%">'+
                                
                                +'</td></tr>';
                            }
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////

                    ctl = '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">';

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
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = quizQuestionResponse[0].QuestionResponse != undefined && quizQuestionResponse[0].QuestionResponse != "" ? parseInt(quizQuestionResponse[0].QuestionResponse) : "";
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
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = quizQuestionResponse[0].QuestionResponse != undefined && quizQuestionResponse[0].QuestionResponse != "" ? parseInt(quizQuestionResponse[0].QuestionResponse) : "";
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
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (quizQuestionResponse[0].QuestionResponse != undefined && quizQuestionResponse[0].QuestionResponse != "" ? $.parseJSON(quizQuestionResponse[0].QuestionResponse) : []);
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
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (quizQuestionResponse[0].QuestionResponse != undefined && quizQuestionResponse[0].QuestionResponse != "" ? $.parseJSON(quizQuestionResponse[0].QuestionResponse) : 0);
                    }

                    return '<div style="width:80%;margin:auto;"><span class="spanRangeValue">' + qtnResponse + '</span><input type="range" min="' + minRange + '"  max="' + maxRange + '"  step="' + stepRange + '" name="ent_mod_q' + qtn.ID + '" value="' + qtnResponse + '"  class="RangeControl"  disabled /></div>';
                }

                //FileAttachment
                else if (qtn.DataTypeID == 11) {

                    let qtnResponse = false;
                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (quizQuestionResponse[0].QuestionResponse == "true");
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
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (quizQuestionResponse[0].QuestionResponse != undefined && quizQuestionResponse[0].QuestionResponse != "" ? $.parseJSON(quizQuestionResponse[0].QuestionResponse) : []);
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
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = (quizQuestionResponse[0].QuestionResponse != undefined ? parseInt(quizQuestionResponse[0].QuestionResponse) : -1);
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




                return "";
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