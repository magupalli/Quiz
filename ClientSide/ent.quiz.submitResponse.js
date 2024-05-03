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
                    let apiPath_item = this.apiPath + '/getActiveQuiz?quizId=' + quizId;
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
                    if (!(!this.quiz.AllowMultipleResponse && this.quiz.HasUserAlreadySubmitted)) {
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
                        if (ENTQuiz.Common.getUrlParams("IsDlg") != undefined) {
                            SP.SOD.executeFunc('sp.js', function () {
                                SP.UI.MOdalDialog.commonModalDialogClose(1, 1);
                            });
                        }
                        else {
                            window.location = `/pages/Quiz/ViewResponse.aspx?quizId=${this.quiz.ID}&responseId=${this.quiz.ResponseId}`;
                            // console.log("Response already submitted.Multiple responses not allowed");
                            // $(".entQuizContainer").html("<div class='divAlreadySubmittedErrorContainer'><div class='divAlreadySubmittedError'>Sorry ! Response already submitted.Multiple responses not allowed</div></div>")
                            // $(".divAlreadySubmittedErrorContainer").show();
                        }
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
                        ctl += '<div style="color:coral;font-size:15px;font-weight:bold;">Image files not found</div>';
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

                    $(".entQuizResponseContainer").show();

                    if (this.userLanguage == 1) {
                        $(".entQuizResponseContainer").removeClass("DirectionLTR");
                        $(".entQuizResponseContainer").addClass("DirectionRTL");
                        $(".entQuizResponseContainer").attr("dir", "rtl");
                        $("[name='btnModSubmit']").text("SubmitInArabic");
                        $("[name='btnModCancel']").text("CancelInArabic");
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
                    let htmlQuizQuestions = '';
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
            isValidData: true,
            submitQuiz: function (respStatus) {
                //console.log("Submit invoked");
                ENTQuiz.Response.isSubmitted = false;

                let quizResponse = ENTQuiz.Response.getQuizResponseFromForm();
                quizResponse.ResponseStatus = respStatus;
                ENTQuiz.Response.quizResponse = quizResponse;

                if (ENTQuiz.Response.isValidData) {

                    let apiPath_item = this.apiPath + '/submitQuizResponse';
                    ENTQuiz.Response.isSubmitted = true;
                    $.ajax({
                        type: 'POST',
                        url: apiPath_item,
                        data: ENTQuiz.Response.quizResponse,
                        headers: {
                            Accept: "application/json;odata=verbose"
                        },
                        async: true,

                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data_items) {
                            $(".entQuizContainer").hide();
                            if (ENTQuiz.Response.quiz.HasThankyouMessage) {
                                $(".entQuizResponseAcknowledgement").html(ENTQuiz.Response.quizMessage.ThankyouMessage);
                                $("#btnThankyou").show();
                                $("#btnShowScore").show();
                            }
                            else {
                                $(".entQuizResponseAcknowledgement").html("Processing result. Please wait ...")
                                ENTQuiz.Response.ProcessQuizResponse();

                            }
                            $(".entQuizResponseAcknowledgementContainer").show();
                        },
                        error: function (errordata) {
                            console.log(errordata);

                            if (errordata.responseJSON.ExceptionType == "ENTHubQuiz.QuizAPI.ViewModels.CustomException") {
                                $(".entQuizContainer").html("<div class='ErrorDiv'>" + errordata.responseJSON.ExceptionMessage + "</div>");
                            }
                            else {
                                $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! Error occured while submitting response. Please try again after some time. <br /> If problem persists, contact IT heldesk</div>");

                            }
                        }

                    });


                }
                else {
                    console.log("Data Validations failed");
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
                this.fetchedResponse = false;
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apiPath + '/getQuizResponseOnly?quizId=' + quizId;
                    $.ajax({

                        url: apiPath_item,
                        data: {
                            absolutePath: location.pathname
                        },
                        headers: {
                            Accept: "application/json;odata=verbose"
                        },
                        async: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data_item) {
                            if (data_item != undefined && data_item.ErrorCode == undefined) {
                                ENTQuiz.Response.quizResult = data_item;
                                ENTQuiz.Response.fetchedResponse = true;

                                if (ENTQuiz.Response.quiz == null) {
                                    $(".entQuizContainer").html("<div class='ErrorDiv'>No Active quiz found with given Id</div>");
                                }
                                else if (ENTQuiz.Response.quizResult.quizResponses == undefined ||
                                    ENTQuiz.Response.quizResult.quizResponses.length == 0) {
                                    $(".entQuizContainer").html("<div class='ErrorDiv'>No Response found with given Id</div>");
                                }
                                else {
                                    let score = ENTQuiz.Response.getScore(ENTQuiz.Response.quizResult.quizResponses[0]);
                                    if (score >= ENTQuiz.Response.quiz.PassScore) {
                                        $(".entQuizResponseAcknowledgement").html(ENTQuiz.Response.quizMessage.Pass);
                                    }
                                    else {
                                        $(".entQuizResponseAcknowledgement").html(ENTQuiz.Response.quizMessage.Fail);
                                    }
                                    $("#btnThankyou").show();
                                    $("#btnShowScore").show();
                                }

                            }
                            else {
                                $(".entQuizContainer").html("<div class='ErrorDiv'> Sorry ! Error occured while fetching Quiz Questions. Please try again after some time. <br/> If problem persists, contact IT helpdesk.</div><div style='margin:5%;color:#coral;'>" + data_item.ErrorMessage + "</div>");

                            }
                        },
                        error: function (errordata) {
                            console.log(errordata);

                            if (errordata.responseJSON.ExceptionType == "ENTHubQuiz.QuizAPI.ViewModels.CustomException") {
                                $(".entQuizContainer").html("<div class='ErrorDiv'>" + errordata.responseJSON.ExceptionMessage + "</div>");
                            }
                            else {
                                $(".entQuizContainer").html("<div class='ErrorDiv'> Sorry ! Error occured while fetching Quiz Questions. Please try again after some time. <br/> If problem persists, contact IT helpdesk.</div>");

                            }
                        }

                    });
                }
                else {
                    console.log("Quiz not selected");
                    $(".entQuizContainer").html("<div class='ErrorDiv'> Quiz not selected.  <br/> for additional info, please contact IT helpdesk.</div>");

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