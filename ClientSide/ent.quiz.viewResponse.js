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
                let quizResponse = ENTQuiz.Response.quizResult.quizResponses[0];

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
                        } else {
                            isCorrectAns = (Specs.en[qtnResponse].trim() == answer.en.trim());
                        }
                    }
                    let ctl = '';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);

                    //////////////////////////////////////////////////////////////////
                    if (ENTQuiz.Response.quiz.AllowViewResponse) {
                        ctl += '<table dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '" style="width:100%;">';
                        for (let i = 0; i < 5 && i < optionsCount; i++) {
                            if (optionsCount <= 5) {
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:100%"><span class="multiChkBoxStyle ' +
                                    (i == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                    '"><i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    '</span></td></tr>';
                            }
                            else if (optionsCount <= 10) {
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:50%"><span class="multiChkBoxStyle ' +
                                    (i == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                    '"><i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    '</span></td>';
                                if ((i + 5) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="width:50%"><span class="multiChkBoxStyle ' +
                                        ((i + 5) == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                        '"><i class="far fa' + ((i + 5) == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                        (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                        '</span></td></tr>';

                                } else {
                                    ctl += '<td class="multiChkBoxStyle" style="width:50%"></td></tr>';
                                }
                            }
                            else if (optionsCount <= 15) {
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:33%"><span class="multiChkBoxStyle ' +
                                    (i == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                    '"><i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    '</span></td>';
                                ctl += '<td class="multiChkBoxStyle" style="width:33%"><span class="multiChkBoxStyle ' +
                                    ((i + 5) == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                    '"><i class="far fa' + ((i + 5) == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                    '</span></td>';
                                if ((i + 10) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="width:33%"><span class="multiChkBoxStyle ' +
                                        ((i + 10) == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                        '"><i class="far fa' + ((i + 10) == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                        (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) +
                                        '</span></td></tr>';

                                } else {
                                    ctl += '<td class="multiChkBoxStyle" style="width:33%"></td></tr>';
                                }
                            }
                            else if (optionsCount <= 20) {
                                ctl += '<tr><td class="multiChkBoxStyle" style="width:25%"><span class="multiChkBoxStyle ' +
                                    (i == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                    '"><i class="far fa' + (i == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    '</span></td>';
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"><span class="multiChkBoxStyle ' +
                                    ((i + 5) == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                    '"><i class="far fa' + ((i + 5) == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                    '</span></td>';
                                ctl += '<td class="multiChkBoxStyle" style="width:25%"><span class="multiChkBoxStyle ' +
                                    ((i + 10) == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                    '"><i class="far fa' + ((i + 10) == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) +
                                    '</span></td>';
                                if ((i + 15) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="width:25%"><span class="multiChkBoxStyle ' +
                                        ((i + 15) == qtnResponse ? (isCorrectAns ? ' correctAns ' : ' wrongAns ') : '') +
                                        '"><i class="far fa' + ((i + 15) == qtnResponse ? '-dot' : '') + '-circle" />&nbsp;' +
                                        (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 15].trim() : Specs.en[i + 15].trim()) +
                                        '</span></td></tr>';

                                } else {
                                    ctl += '<td class="multiChkBoxStyle" style="width:25%"></td></tr>';
                                }
                            }
                        }
                        ctl += '</table>';
                    }

                    if (ENTQuiz.Response.quiz.AllowViewAnswers) {
                        ctl += '<div class="entQuizAnswerContainer"><div>Correct Answer is : ' + (ENTQuiz.Response.quiz.userLanguage == 1 ? answer.ar.trim() : answer.en.trim()) + '</div></div>';
                    }
                    if (ENTQuiz.Response.quiz.AllowViewResponse ||
                        ENTQuiz.Response.quiz.AllowViewAnswers) {
                        ctl = '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' + ctl + '</div>';
                    }
                    if (qtnResponse >= 0)
                        (ENTQuiz.Response.userLanguage == 1 ? (Specs.ar[qtnResponse].trim() == answer.ar.trim() ?
                            ENTQuiz.Response.scoreCount++ : 0) : (Specs.en[qtnResponse].trim() == answer.en.trim() ?
                                ENTQuiz.Response.scoreCount++ : 0));
                    return ctl;

                    ////////////////////////////////////////////////////////////////

                }
                //Image Choices
                else if (qtn.DataTypeID == 2) {
                    let qtnImageChoices = $.grep(ENTQuiz.Response.quiz.ImageChoices, function (imageFile) {
                        return imageFile.QuestionId == qtn.ID;
                    });

                    let qtnResponse = -1;
                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let quizQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = quizQuestionResponse[0].QuestionResponse != undefined && quizQuestionResponse[0].QuestionResponse != "" ? parseInt(quizQuestionResponse[0].QuestionResponse) : -1;

                    }

                    ///////////////////////////////////////////////////////////////////////
                    let ctl = '';
                    if (ENTQuiz.Response.quiz.AllowViewResponse) {
                        ctl = '<br/><div> <input type="hidden" value="" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '"  />';
                        if (qtnImageChoices.length > 0) {
                            if (qtn.Answer != undefined && qtn.Answer != "") {
                                let oAnswer = $.parseJSON(qtn.Answer);
                                let answer = parseint(oAnswer.ans);

                                for (let i = 0; i < ENTQuiz.Response.quiz.ImageChoices.length; i++) {

                                    let activeRatingStyle = (qtnResponse != -1 && (qtnResponse - 1) == (qtnImageChoices[i].FileIdx) ? ' ActiveRating ' : '');
                                    let answerStyle = (activeRatingStyle.trim() == 'ActiveRating' ? (qtnResponse == answer ? ' correctAnsImg ' : ' wrongAnsImg ') : '');

                                    ctl += '<img class="ImageChoiceDisabled ' + answerStyle + '" ' +
                                        ' src="data:image/jpg;base64,' + qtnImageChoices[i].FileContentAsBytes + '" title="' + qtnImageChoices[i].FileName + '"  data-imagegroup="ent_mod_q' + qtn.ID + '"  /> &nbsp; ';
                                }
                            }
                        }
                        else {
                            ctl += '<div style="color:coral;font-size:15px;font-weight:bold;padding:10px;background-color:yellow;">Image files not found</div>';
                        }
                        ctl += '</div><br/>';
                    }

                    if (qtnImageChoices.length > 0) {
                        if (qtn.Answer != undefined && qtn.Answer != "") {
                            let oAnswer = $.parseJSON(qtn.Answer);
                            let answer = parseint(oAnswer.ans);
                            if (ENTQuiz.Response.quiz.AllowViewAnswers) {

                                if (answer > 0 && answer <= qtnImageChoices.length) {
                                    ctl += '<div class="entQuizAnswerContainer"><div>Correct answer is : ' +
                                        '<img src="data:image/jpg;base64,' + qtnImageChoices[answer - 1].FileContentAsBytes + '" title="' + qtnImageChoices[answer - 1].FileName + '" class="ImageChoiceDisabled" /> &nbsp; ';

                                    +'</div></div>';
                                }
                                else {
                                    ctl += '<div class="entQuizAnswerContainer"><div>Invalid answer option created by Admin</div></div>';
                                }
                            }
                            if (qtnResponse == answer) ENTQuiz.Response.scoreCount++;
                        }
                        else {
                            ctl += '<div class="entQuizAnswerContainer"><div>Answer not created by Admin</div></div>';

                        }
                    }
                    return ctl;
                }
                //Date
                else if (qtn.DataTypeID == 3) {

                    let qtnResponse = '';
                    if (quizResponse != undefined &&
                        quizResponse.QuizQuestionResponses != undefined &&
                        quizResponse.QuizQuestionResponses.length > 0) {
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = modQuestionResponse[0].QuestionResponse;
                    }
                    let ctl = '';
                    let answer = $.parseJSON(qtn.Answer);
                    let date_answer = answer.ans;
                    if (ENTQuiz.Response.quiz.AllowViewResponse) {
                        ctl = '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">' +
                            '<span class="entQuizQtnCtlValue ' + (qtnResponse.trim() == date_answer.trim() ? ' correctAns ' : ' wrongAns ') + '">' +
                            '<input type="text" value="' + qtnResponse + '" class="entQuizQtnCtl" readonly />' +
                            +'</span>' +
                            +'</div><br/>';
                    }
                    if (ENTQuiz.Response.quiz.AllowViewAnswers) {
                        ctl = '<br/><div class="entQuizAnswerContainer"><div>Correct Answer is : ' + date_answer + '</div></div>';
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
                        let modQuestionResponse = $.grep(quizResponse.QuizQuestionResponses, function (oQuizQuestionResponse) {
                            return (oQuizQuestionResponse.ID == qtn.ID);
                        });
                        qtnResponse = parseInt(modQuestionResponse[0].QuestionResponse);
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

                    if (ENTQuiz.Response.quiz.AllowViewResponse) {
                        ctl += '<span class="' + (isCorrectAns ? ' correctAns ' : ' wrongAns ') + '">';
                        ctl += '<select class="entModQtnCtl" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" disabled> ';
                        for (let i = 0; i < optionsCount; i++) {
                            if (qtnResponse == i)
                                ctl += '<option value="' + i + '" >' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    '</option>';
                        }
                        ctl += '</select></span><br/>';
                    }

                    if (ENTQuiz.Response.quiz.AllowViewAnswers) {
                        ctl += '<br/><div class="entQuizAnswerContainer"><div>Correct Answer is : ' +
                            (ENTQuiz.Response.userLanguage == 1 ? answer.ar.trim() : answer.en.trim()) +
                            +'</div></div>';
                    }
                    (ENTQuiz.Response.userLanguage == 1 ?
                        (Specs.ar[qtnResponse].trim() == answer.ar.trim() ? ENTQuiz.Response.scoreCount++ : 0) :
                        (Specs.en[qtnResponse].trim() == answer.en.trim() ? ENTQuiz.Response.scoreCount++ : 0));

                    return ctl;
                }
                //MultiCheckboxes
                else if (qtn.DataTypeID == 5) {
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

                    let answer = $.parseJSON(qtn.Answer);
                    let answer_optionsCount = (ENTQuiz.Response.Language == 1 ? answer.ar.length : answer.en.length);

                    let isAllCorrect = true;
                    if (answer_optionsCount != qtnResponse.length) isAllCorrect = false;
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
                                    isAllCorrect = false;
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
                        ctl += '<table dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '" style="width:100%">';

                        for (let i = 0; i < optionsCount; i++) {
                            let txtChecked5 = '';
                            let txtChecked10 = '';
                            let txtChecked15 = '';
                            let txtChecked20 = '';
                            if (optionsCount <= 5) {
                                for (let q = 0; q < qtnResponse.length; q++) {
                                    if (i == parseInt(qtnResponse[q])) {
                                        txtChecked5 = "-check"; break;
                                    }
                                }
                                ctl += '<tr><td class="multiChkBoxStyle" style="100%"><i class="far fa' +
                                    txtChecked5 + '-square" /> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    ' </td></tr>';
                            }
                            else if (optionsCount <= 10) {
                                for (let q = 0; q < qtnResponse.length; q++) {
                                    if (i == parseInt(qtnResponse[q])) {
                                        txtChecked5 = "-check"; break;
                                    }
                                    if ((i + 5) == parseInt(qtnResponse[q])) {
                                        txtChecked10 = "-check"; break;
                                    }
                                }
                                ctl += '<tr><td class="multiChkBoxStyle" style="50%"><i class="far fa' +
                                    txtChecked5 + '-square" /> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    ' </td>';
                                if ((i + 5) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="50%"><i class="far fa' +
                                        txtChecked10 + '-square" /> &nbsp;  ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                        ' </td></tr>';
                                }
                                else {
                                    ctl += '<td class="multiChkBoxStyle" style="50%"></td></tr>';
                                }
                            }
                            else if (optionsCount <= 15) {
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
                                ctl += '<tr><td class="multiChkBoxStyle" style="33%"><i class="far fa' +
                                    txtChecked5 + '-square" /> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    ' </td>';
                                ctl += '<td class="multiChkBoxStyle" style="33%"><i class="far fa' +
                                    txtChecked10 + '-square" /> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                    ' </td>';
                                if ((i + 10) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="33%"><i class="far fa' +
                                        txtChecked15 + '-square" /> &nbsp;  ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) +
                                        ' </td></tr>';
                                }
                                else {
                                    ctl += '<td class="multiChkBoxStyle" style="33%"></td></tr>';
                                }
                            }
                            else if (optionsCount <= 20) {
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
                                ctl += '<tr><td class="multiChkBoxStyle" style="25%"><i class="far fa' +
                                    txtChecked5 + '-square" /> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                    ' </td>';
                                ctl += '<td class="multiChkBoxStyle" style="25%"><i class="far fa' +
                                    txtChecked10 + '-square" /> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 5].trim() : Specs.en[i + 5].trim()) +
                                    ' </td>';
                                ctl += '<td class="multiChkBoxStyle" style="25%"><i class="far fa' +
                                    txtChecked15 + '-square" /> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 10].trim() : Specs.en[i + 10].trim()) +
                                    ' </td></tr>';
                                if ((i + 15) < optionsCount) {
                                    ctl += '<td class="multiChkBoxStyle" style="25%"><i class="far fa' +
                                        txtChecked20 + '-square" /> &nbsp;  ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i + 15].trim() : Specs.en[i + 15].trim()) +
                                        ' </td></tr>';
                                }
                                else {
                                    ctl += '<td class="multiChkBoxStyle" style="25%"></td></tr>';
                                }
                            }
                        }
                        ctl += '</table>';
                        ctl += '</div>';
                        ctl += '</div>';
                    }
                    if (ENTQuiz.Response.quiz.AllowViewAnswers) {
                        answer_ctl += '<div><table dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '" style="width:100%">';

                        for (let i = 0; ii < 5 && i < answer_optionsCount; i++) {

                            if (answer_optionsCount <= 5) {

                                answer_ctl += '<tr><td class="answer_multiChkBoxStyle" style="100%"> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i].trim() : answer.en[i].trim()) +
                                    ' </td></tr>';
                            }
                            else if (answer_optionsCount <= 10) {
                                answer_ctl += '<tr><td class="answer_multiChkBoxStyle" style="50%"> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i].trim() : answer.en[i].trim()) +
                                    ' </td>';
                                if ((i + 5) < answer_optionsCount) {
                                    answer_ctl += '<td class="answer_multiChkBoxStyle" style="50%"> &nbsp;  ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i + 5].trim() : answer.en[i + 5].trim()) +
                                        ' </td></tr>';
                                }
                                else {
                                    answer_ctl += '<td class="answer_multiChkBoxStyle" style="50%"></td></tr>';
                                }
                            }
                            else if (answer_optionsCount <= 15) {
                                answer_ctl += '<tr><td class="answer_multiChkBoxStyle" style="33%"> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i].trim() : answer.en[i].trim()) +
                                    ' </td>';

                                answer_ctl += '<td class="answer_multiChkBoxStyle" style="33%"> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i + 5].trim() : answer.en[i + 5].trim()) +
                                    ' </td>';
                                if ((i + 10) < answer_optionsCount) {
                                    answer_ctl += '<td class="answer_multiChkBoxStyle" style="33%"> &nbsp;  ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i + 10].trim() : answer.en[i + 10].trim()) +
                                        ' </td></tr>';
                                }
                                else {
                                    answer_ctl += '<td class="answer_multiChkBoxStyle" style="33%"></td></tr>';
                                }
                            }
                            else if (answer_optionsCount <= 20) {
                                answer_ctl += '<tr><td class="answer_multiChkBoxStyle" style="25%"> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i].trim() : answer.en[i].trim()) +
                                    ' </td>';

                                answer_ctl += '<td class="answer_multiChkBoxStyle" style="25%"> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i + 5].trim() : answer.en[i + 5].trim()) +
                                    ' </td>';
                                answer_ctl += '<td class="answer_multiChkBoxStyle" style="25%"> &nbsp;  ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i + 10].trim() : answer.en[i + 10].trim()) +
                                    ' </td>';
                                if ((i + 15) < answer_optionsCount) {
                                    answer_ctl += '<td class="answer_multiChkBoxStyle" style="25%"> &nbsp;  ' +
                                        (ENTQuiz.Response.userLanguage == 1 ? answer.ar[i + 15].trim() : answer.en[i + 15].trim()) +
                                        ' </td></tr>';
                                }
                                else {
                                    answer_ctl += '<td class="answer_multiChkBoxStyle" style="25%"></td></tr>';
                                }
                            }
                        }
                        answer_ctl += '</table>';
                        answer_ctl += '</div>';

                        ctl += '<div class="entQuizAnswerContainer"><div>Correct Answer is : ' + answer_ctl + '</div></div>';

                    }
                    if (isAllCorrect) ENTQuiz.Response.scoreCount++;

                    return ctl;
                }
                //RankingQuestion
                else if (qtn.DataTypeID == 6) {
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

                    let answer = $.parseJSON(qtn.Answer);
                    let isAllCorrect = true;
                    if (qtnResponse == undefined || qtnResponse.length != answer.length)
                        isAllCorrect = false;
                    else {
                        for (let a = 0; a < answer.ans.length; a++) {
                            if (qtnResponse[a].RowResponse != answer.ans[a]) {
                                isAllCorrect = false;
                                breaak;
                            }
                        }
                    }


                    let ctl = '';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    if (ENTQuiz.Response.quiz.AllowViewResponse) {
                        ctl += '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '">';
                        ctl += '<div class="' + (isAllCorrect ? ' correctAns ' : ' wrongAns ') + '">';

                        for (let i = 0; i < optionsCount; i++) {
                            let qtnResponse_Row = $.grep(qtnResponse, function (qtnResponseItem) {
                                return (i == qtnResponseItem.RowID);
                            });
                            ctl += '<div class="RankingQuestionRow">' +
                                '<select name="ent_mod_q' + qtn.ID + '_' + i + '"  disabled >';

                            ctl += '<option value="' + qtnResponse_Row[0].RowResponse + '" >' + qtnResponse_Row[0].RowResponse + '</option>';

                            ctl += '</select> &nbsp; &nbsp; ' +
                                '<span class="RankingQuestion">' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</span></div>';
                        }
                        ctl += '</div>';
                        ctl += '</div>';
                    }

                    if (ENTQuiz.Response.quiz.AllowViewAnswers) {
                        var answer_ctl = '<div dir="' + (ENTQuiz.Response.userLanguage == 1 ? 'rtl' : 'ltr') + '" style="width:100%;margin-top:1%;">';

                        for (let i = 0; i < optionsCount; i++) {

                            answer_ctl += '<div class="RankingQuestionRow">' +
                                '<select name="ent_mod_q' + qtn.ID + '_' + i + '"  disabled >';

                            answer_ctl += '<option value="' + answer.ans[i] + '" >' + answer.ans[i] + '</option>';

                            answer_ctl += '</select> &nbsp; &nbsp; ' +
                                '<span class="RankingQuestion_Ans">' +
                                (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) +
                                '</span></div>';
                        }
                        answer_ctl += '</div>';
                        ctl += '<div class="siaQuizAnswerContainer"><div>Correct Answer is: ' +
                            answer_ctl +
                            '</div></div>';
                    }
                    if (isAllCorrect) ENTQuiz.Response.scoreCount++;

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

                        qtnCntrDisplay++;
                        let htmlQuizQuestion = '';
                        let htmlQuizQuestionControl = '';
                        htmlQuizQuestionControl = ENTQuiz.Response.getQuestionControlWithValue(o);

                        if (ENTQuiz.Response.quiz.AllowViewResponse ||
                            ENTQuiz.Response.quiz.AllowViewAnswers) {
                            htmlQuizQuestion += '<div class="entQuizQuestionContainer">' +
                                '<div class="entQuizQuestion">' + (qtnCntrDisplay) + ' . &nbsp; ' +
                                (ENTQuiz.Response.userLanguage == 1 ? o.Question : o.Question_En) +
                                '</div>' +
                                '<div class="entQuizQuestionControl" data-qtnid="' + o.ID + '" data-datatypeid="' + o.DataTypeID + '" >' +
                                htmlQuizQuestionControl +
                                '</div>' +
                                '</div>';
                        }

                        return htmlQuizQuestion;

                    }).join('');
                    $('.entQuizHeaderContainer').html(htmlQuizHeader);
                    $('.entQuizQuestionsContainer').html(htmlQuizQuestions);
                    $('.entQuizScoreContainer').html('' +
                        '<div class="entQuizScore">Score : ' + ENTQuiz.Response.scoreCount + ' / ' +
                        ENTQuiz.Response.quiz.Questions.length + '</div>' +
                        '<div class="entQuizPassScore">Pass Score : ' + this.quiz.PassScore + '</div>' +
                        '<div class="entQuizResult' + (ENTQuiz.Response.scoreCount >= this.quiz.PassScore ? 'Pass' : 'Fail') + '">' +
                        (ENTQuiz.Response.scoreCount >= this.quiz.PassScore ? 'Pass' : 'Fail') +
                        '</div>');


                }
            },
            cancelQuiz: function () {
                window.location = '/';
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