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
                Help: ""
            },
            fetched: false,

            getQuizMessages: function (messageId) {
                let apiPath_item = _spPageContextInfo.webAbsoluteUrl + "/api/web/lists/getbytitle('QuizMessages')/items?$filter=ID eq " + messageId + "&$select=ID,WelcomeMessage,ThankyouMessage,HelpMessage";
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
                            $(".entQuizDataLoaderMessage").hide();
                            if (ENTQuiz.Response.quiz.HasThankyouMessage)
                                $(".entQuizResponseAcknowledgement").html(ENTQuiz.Response.quizMessage.Thankyou);
                            if (ENTQuiz.Response.quiz.HasWelcomeMessage) {
                                $(".entQuizResponseWelcome").html(ENTQuiz.Response.quizMessage.Welcome);
                                $(".entQuizResponseWelcome").show();
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
                    let apiPath_item = this.apiPath + '/getDebugInfo?quizId=' + quizId ;
                    this.getDebugInfo(apiPath_item);
                }
                else {
                    console.log("Quiz not selected ");
                    if (ENTQuiz.Common.getUrlParams("quizId") == undefined)
                        $(".entQuizContainer").html("<divclass='ErrorDiv'>Quiz not selected <br/> For additional info, please contact IT helpdesk </div>");
                }
            },
            getDebugInfo: function (apiPath_item) {
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
                        ENTQuiz.Response.OnGetDebugInfo_Success(data_items);
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
            OnGetDebugInfo_Success: function (data_item) {
                //console.log("OnGetQuizResponse_Success");
                //console.log(data_item);
                if (data_item != undefined && data_item.ErrorCode == undefined) {

                    $(".entQuizContainer").html(data_item);

                }
                else {
                    if (data_item == undefined) {
                        console.log("Selected Quiz does not exist anymore");
                        $(".entSureyContainer").html("<div class='ErrorDiv'>Sorry ! Selected Quiz does not exist anymore<br />For additionl info, please contact IT Helpdesk</div>");
                    }
                    else {
                        $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching Quiz questions. Please try again after some time. <br/> If Problem persists, contact IT Helpdesk</div><div style='margin:5%;color:coral'>" + data_item.ErrorMessage + "</div>");
                    }
                }
            },
            getQuestionControl: function (qtn) {

                /*
                Text
                MultiLineText
                Date
                Checkbox
                DropDown
                RadioButtons
                MultiCheckboxes
                RatingByNumbers
                MatrixQuestion
                Slider
                FileAttachment
                Ranking
                Branching
                5 - emojis
                ImageChoices
                
                */


                //Textbox
                if (qtn.DataTypeID == 1) {
                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                        if (validationSpecs.maxChars != undefined) validationAttributes += ' data-maxChars="' + validationSpecs.maxChars + '"';
                    }

                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span><input class="entModQtnCtl" type="text" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" ' + validationAttributes + ' style="width:100%" /></div>';

                }
                //MultiLineTextbox
                else if (qtn.DataTypeID == 2) {
                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                        if (validationSpecs.maxChars != undefined) validationAttributes += ' data-maxChars="' + validationSpecs.maxChars + '"';
                    }

                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span><textarea class="entModQtnCtl" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" ' + validationAttributes + ' style="width:100%" rows="4" ></textarea></div>';

                }

                //Date
                else if (qtn.DataTypeID == 3) {
                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                        if (validationSpecs.min != undefined) validationAttributes += ' data-min="' + validationSpecs.min + '"';
                        if (validationSpecs.max != undefined) validationAttributes += ' data-max="' + validationSpecs.max + '"';
                    }

                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span><input class="entModQtnCtl" type="date" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" /></div>';

                }
                //Checkbox
                else if (qtn.DataTypeID == 4) {
                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                    }

                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span><input class="entModQtnCtl" type="checkbox" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" /></div>';

                }

                //Dropdown
                else if (qtn.DataTypeID == 5) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                    }


                    let ctl = '<div><select class="entModQtnCtl" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" ' + validationAttributes + '> ';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    ctl += '<option value="" >' + (ENTQuiz.Response.userLanguage == 1 ? '-select-' : '-select-') + '</option>';
                    for (let i = 0; i < optionsCount; i++) {
                        ctl += '<option value="' + i + '" >' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + '</option>';
                    }
                    ctl += '</select><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span></div>';

                    return ctl;
                }

                //Radiobuttons
                else if (qtn.DataTypeID == 6) {
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

                //MultiCheckboxes
                else if (qtn.DataTypeID == 7) {
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

                //RatingByNumbers
                else if (qtn.DataTypeID == 8) {
                    let Specs = $.parseJSON(qtn.Specs);
                    let minRating = Specs.min;
                    let maxRating = Specs.max;
                    let stepRating = Specs.step;

                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                    }

                    let ctl = '<br/><div><input type="hidden" value="" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" ' + validationAttributes + ' />';

                    for (let i = minRating; i <= maxRating; i = i + stepRating) {
                        ctl += '<span class="RatingByNumber" data-ratinggroup="ent_mod_q' + qtn.ID + '" onclick="return ENTQuiz.Response.setRatingByNumber(this,' + qtn.ID + ', ' + i + ')">' + i + '</span> &nbsp; ';
                    }
                    ctl += "</div></br>"
                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span>' + ctl + '</div>';

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

                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                    }

                    let ctl = '<div style="margin:auto;width:98%" >';
                    ctl += '<div class="row">';
                    ctl += '<span class="' + questionColLengthCSS + ' MatrixCell"></span>';
                    for (let i = 0; i < colsCount; i++) {
                        if (colsCount <= 3)
                            ctl += '<span class="col-sm-2 MatrixCell MatrixCellHeader" style="text-align:center;">' + cols[i].trim() + '</span>';
                        else
                            ctl += '<span class="col-sm-1 MatrixCell ' + (ENTQuiz.Response.userLanguage == 1 ? ' MatrixCellHeader_AR ' : ' MatrixCellHeader_EN ') + ' " style="text-align:center;">' + cols[i].trim() + '</span>';
                    }
                    ctl += "</div>";
                    for (let r = 0; r < rowsCount; r++) {
                        ctl += '<div class="row MatrixRow" ' + validationAttributes + '>';
                        ctl += '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_' + r + '_Error"></span></div>';

                        for (let i = 0; i < colsCount; i++) {
                            if (i == 0)
                                ctl += '<span class="' + questionColLengthCSS + ' MatrixCell" style="color:#D9D9D9">' + rows[r].trim() + '</span>';

                            if (colsCount <= 3)
                                ctl += '<span class="col-sm-2 MatrixCell" style="text-align:center;">' + '<input type="radio" name="ent_mod_q' + qtn.ID + '_' + r + '" value="' + (i + 1) + '" /> ' + '</span>';
                            else
                                ctl += '<span class="col-sm-1 MatrixCell" style="text-align:center;">' + '<input type="radio" name="ent_mod_q' + qtn.ID + '_' + r + '" value="' + (i + 1) + '" /> ' + '</span>';
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

                    return '<div style="width:80%;margin:auto;"><span class="spanRangeValue">' + (maxRange / 2) + '</span><input type="range" min="' + minRange + '"  max="' + maxRange + '"  step="' + stepRange + '" name="ent_mod_q' + qtn.ID + '" value="' + (maxRange / 2) + '" oninput="ENTQuiz.Response.ShowRangeValue(this)" class="RangeControl" /></div>';
                }

                //FileAttachment
                else if (qtn.DataTypeID == 11) {
                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                    }
                    let ctl = '<input type="file" name="ent_mod_q' + qtn.ID + '"  ' + validationAttributes + ' />';
                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q_' + qtn.ID + 'Error"></span>' + ctl + '</div>';
                }

                //RankingQuestion
                else if (qtn.DataTypeID == 12) {
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

                //BranchingQuestion
                else if (qtn.DataTypeID == 13) {
                    let Specs = $.parseJSON(qtn.Specs);

                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                    }

                    let ctl = '<div ' + validationAttributes + '">';
                    let optionsCount = (ENTQuiz.Response.userLanguage == 1 ? Specs.ar.length : Specs.en.length);
                    for (let i = 0; i < optionsCount; i++) {
                        ctl += '<div style="margin:1%;color:#D9D9D9;"><input type="radio" name="ent_mod_q' + qtn.ID + '" data-valueID="' + i + '" value="' + i + '"  onclick="ENTQuiz.Response.setBranchVisibility(' + qtn.ID + ',this)" style="margin:0;" /> &nbsp; ' + (ENTQuiz.Response.userLanguage == 1 ? Specs.ar[i].trim() : Specs.en[i].trim()) + '</div>';
                    }
                    ctl += "</div>";
                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span>' + ctl + '</div>';
                }

                //5 - Emojis
                else if (qtn.DataTypeID == 14) {

                    let emojis = ["fas fa-frown", "far fa-frown", "far fa-meh", "far fa-smile", "fas fa-smile"];
                    let emojisText_AR = ["Extremely Unsatisfied", "Below Expectation", "Meets Exepectations", "Above Expectations", "Extremely Satisfied"];
                    let emojisText_EN = ["Extremely Unsatisfied", "Below Expectation", "Meets Exepectations", "Above Expectations", "Extremely Satisfied"];

                    let validationAttributes = '';
                    let validationSpecs = {};
                    if (qtn.ValidationSpecs != undefined && qtn.ValidationSpecs != '') {
                        validationSpecs = $.parseJSON(qtn.ValidationSpecs);
                        if (validationSpecs.isRequired) validationAttributes += ' data-isRequired="true" ';
                    }

                    let ctl = '<br/><div><input type="hidden" value="" name="ent_mod_q' + qtn.ID + '" id="ent_mod_q' + qtn.ID + '" ' + validationAttributes + ' />';

                    for (let i = 0; i < 5; i++) {
                        ctl += '<span class="' + emojis[i] + ' RatingByEmoji " data-ratinggroup="ent_mod_q' + qtn.ID + '" onclick="return ENTQuiz.Response.setRatingByNumber(this,' + qtn.ID + ', ' + i + ')" title="' + (ENTQuiz.Response.userLanguage == 1 ? emojisText_AR[i] : emojisText_EN[i]) + '"></span> &nbsp; ';
                    }
                    ctl += "</div><br />"
                    return '<div><span class="ValidationErrorMessage" name="ent_mod_q' + qtn.ID + '_Error"></span>' + ctl + '</div>';
                }

                //Image Choices
                else if (qtn.DataTypeID == 15) {
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

                return "";
            },
            ShowRangeValue: function (ctlRange) {
                $(ctlRange).preav().html($(ctlRange).val());
            },
            setBranchVisibility: function (qtnID, radBtn) {
                $("div[data_branchID^='" + qtnID + "_']").hide();
                if (radBtn.checked) {
                    $("div[data_branchID^='" + qtnID + "_" + $(radBtn).data("valueid") + "']").show();
                }

            },
            setRatingByNumber: function (btnRating, qtnID, ratingValue) {
                $("#ent_mod_q" + qtnID).val(ratingValue);
                $("span[data-ratinggroup='" + $(btnRating).data("ratinggroup") + "']").removeClass("ActiveRating");
                $(btnRating).addClass('ActiveRating');
                return false;
            },

            setImageChoice: function (btnRating, qtnID, ratingValue) {
                $("#ent_mod_q" + qtnID).val(ratingValue);
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
                    let htmlQuizQuestions = this.quiz.Questions.map(function (o, idx) {

                        if (o.ParentBranchID == 0) {
                            qtnCntrDisplay++;
                            let htmlQuizQuestion = '';
                            if (o.DataTypeID != 4) {
                                htmlQuizQuestion += '<div class="entQuizQuestionContainer">' +
                                    '<div class="entQuizQuestion">' + (qtnCntrDisplay) + ' . &nbsp; ' +
                                    (ENTQuiz.Response.userLanguage == 1 ? o.Question : o.Question_En) +
                                    '</div>' +
                                    '<div class="entQuizQuestionControl" data-qtnid="' + o.ID + '" data-datatypeid="' + o.DataTypeID + '" >' +
                                    ENTQuiz.Response.getQuestionControl(o) +
                                    '</div>' +
                                    '</div>';
                            }
                            else {

                                //checkbox
                                htmlQuizQuestion += '<div class="entQuizQuestionContainer">' +
                                    '<div class="entQuizQuestion" >' + (qtnCntrDisplay) + ' . &nbsp; ' +
                                    '<span class="entQuizQuestionControl" data-qtnid="' + o.ID + '" data-datatypeid="' + o.DataTypeID + '" style="padding:1%;" > ' +
                                    ENTQuiz.Response.getQuestionControl(o) +
                                    '</span>' +
                                    (ENTQuiz.Response.userLanguage == 1 ? o.Question : o.Question_En) +
                                    '<span class="ValidationErrorMessage" name="ent_mod_q_' + o.ID + 'Error"></span>' +
                                    '</div>' +
                                    '</div>';
                            }

                            let htmlQuizQuestionBranches = '';
                            if (o.DataTypeID == 13) {
                                let Specs = $.parseJSON(o.Specs);

                                let branchQuestions = $.grep(ENTQuiz.Response.quiz.Questions, function (qtn) {
                                    return qtn.ParentBranchID == o.ID;
                                });

                                if (branchQuestions != undefined && branchQuestions.length > 0) {
                                    let optionsCount = (ENTQuiz.Response.userLanguage ? Specs.ar.length : Specs.en.length);
                                    for (let i = 0; i < optionsCount; i++) {
                                        let branchValueQuestions = $.grep(branchQuestions, function (qtn) { return qtn.ParentBranchValueID == i; });
                                        if (branchValueQuestions != undefined && branchValueQuestions.length > 0) {
                                            htmlQuizQuestionBranches += '<div class="branchStyle" data-branchID="' + o.ID + '_' + i + '" >';

                                            for (let j = 0; j < branchValueQuestions.length; j++) {
                                                htmlQuizQuestionBranches += '<div class="'((j + 1) != branchValueQuestions.length ? 'entQuizQuestionContainer' : 'entQuizQuestionContainerBranched') + '">' +
                                                    '<div class="quizQuestion">(' + (qtnCntrDisplay) + '.' + (j + 1) + '). &nbsp; ' +
                                                    (ENTQuiz.Response.userLanguage == 1 ? branchValueQuestions[j].Question : branchValueQuestions[j].Question_En) +
                                                    '</div>' +
                                                    '<div class="entQuizQuestionControl" data-qtnid="' + branchValueQuestions[j].ID + '" data-datatypeid="' + branchValueQuestions[j].DataTypeID + '" >' +
                                                    ENTQuiz.Response.getQuestionControl(branchValueQuestions[j]) +
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
            isValidData: true,
            FileReaders: [],
            submitQuiz: function (respStatus) {
                //console.log("Submit invoked");
                ENTQuiz.Response.isSubmitted = false;

                let modResponse = ENTQuiz.Response.getQuizResponseFromForm();
                modResponse.ResponseStatus = respStatus;
                ENTQuiz.Response.modResponse = modResponse;

                if (ENTQuiz.Response.isValidData) {
                    for (let i = 0; i < ENTQuiz.Response.FileReaders.length; i++) {
                        //ENTQuiz.Response.FileReaders[i].reader.readAsBinaryString(ENTQuiz.Response.FileReaders[i].File)                  
                        //ENTQuiz.Response.FileReaders[i].reader.readAsArrayBuffer(ENTQuiz.Response.FileReaders[i].File)                   
                        ENTQuiz.Response.FileReaders[i].reader.readAsDataURL(ENTQuiz.Response.FileReaders[i].File);
                    }

                    ENTQuiz.Response.submitQuizwithFiles();
                }
                else {
                    console.log("Data Validations failed");
                }
            },
            isSubmitted: false,
            modResponse: {},
            submitQuizWithFiles: function () {

                if (!ENTQuiz.Response.isSubmitted) {
                    let isAllFilesLoaded = true;
                    for (let i = 0; i < ENTQuiz.Response.FileReaders.length; i++) {
                        isAllFilesLoaded = ENTQuiz.Response.FileReaders[i].isLoaded;
                        if (!isAllFilesLoaded) break;
                    }
                    if (isAllFilesLoaded) {
                        $(".entQuizContainer").hide();
                        if (ENTQuiz.Response.quiz.HasThankyouMessage) {
                            $("entQuizResponseAcknowledgement").html(ENTQuiz.Response.quizMessage.ThankyouMessage);
                        }
                        else {
                            if (ENTQuiz.Response.userLanguage == 1) {
                                $(".entQuizResponseAcknowledgement").html("<div class='entQuizResponseAcknowledgementDefault'><img src='/SiteAssets/Quiz/images/ThankyouImage.png' width='100px' /><br />(Arabic) Thank you <br />Your response submitted successfully</div>");
                                $("[name='btnThankyou']").text("Arabic-Thankyou");
                            }
                            else {
                                $(".entQuizResponseAcknowledgement").html("<div class='entQuizResponseAcknowledgementDefault'><img src='/SiteAssets/Quiz/images/ThankyouImage.png' width='100px' /><br />Thank you <br />Your response submitted successfully</div>");

                            }
                        }
                        $(".entQuizResponseAcknowledgementContainer").show();
                    }
                }
            },
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

                //Textbox //MultilineTextBox
                if (qtnDataTypeID == 1 ||
                    qtnDataTypeID == 2) {
                    let qtnCtl = $(item).find('[name="ent_mod_q_' + qtnId + '"]');

                    $(qtnCtl).removeClass("NotValidData");
                    if (qtnCtl_Error != undefined && qtnCtl_Error.length > 0) {
                        let isrequired = $(qtnCtl).data("isrequired");
                        if (isrequired && (qtnResponse == undefined || qtnResponse.trim() == "")) {
                            ENTQuiz.Response.isValidData = false;
                            errorMsg = (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.Required.ar : ENTQuiz.Response.constants.Required.en);
                            $(qtnCtl).addClass("NotValidData");
                        }
                        let maxChars = $(qtnCtl).data("maxchars");
                        if (maxChars != undefined && maxChars != "" &&
                            parseInt(maxChars) > 0 &&
                            qtnResponse != undefined && qtnResponse.trim() != "" &&
                            qtnResponse.length > parseInt(maxChars)) {
                            ENTQuiz.Response.isValidData = false;
                            errorMsg = (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.ExceededMaxChars.ar : ENTQuiz.Response.constants.ExceededMaxChars.en);
                            $(qtnCtl).addClass("NotValidData");
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
                        let minDate = $(qtnCtl).data("min");
                        if (minDate.trim() != "") {

                            if (qtnResponse == undefined || qtnResponse.trim() == "") {
                                ENTQuiz.Response.isValidData = false;
                                errorMsg += (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.MinDate.ar : ENTQuiz.Response.constants.MinDate.en); + "<br />";
                                $(qtnCtl).addClass("NotValidData");
                            }
                            else {
                                try {
                                    let dateValue = new Date(qtnResponse);
                                    let minDateValue = new Date();
                                    if (minDate.trim() != "Today") {
                                        minDateValue = new Date(minDate.trim());
                                    }
                                    maxDateValue.setHours(0, 0, 0, 0);
                                    if (dateValue < minDateValue) {
                                        ENTQuiz.Response.isValidData = false;
                                        errorMsg += (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.MinDate.ar : ENTQuiz.Response.constants.MinDate.en); + "<br />";
                                        $(qtnCtl).addClass("NotValidData");
                                    }

                                }
                                catch (ex) {
                                    ENTQuiz.Response.isValidData = false;
                                    errorMsg = "Inavlid Date <br />";
                                    $(qtnCtl).addClass("NotValidData");

                                }
                            }
                        }
                        let maxDate = $(qtnCtl).data("max");
                        if (maxDate.trim() != "") {

                            if (qtnResponse == undefined || qtnResponse.trim() == "") {
                                ENTQuiz.Response.isValidData = false;
                                errorMsg += (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.MaxDate.ar : ENTQuiz.Response.constants.MaxDate.en); + "<br />";
                                $(qtnCtl).addClass("NotValidData");
                            }
                            else {
                                try {
                                    let dateValue = new Date(qtnResponse);
                                    let maxDateValue = new Date();
                                    if (maxDate.trim() != "Today") {
                                        maxDateValue = new Date(maxDate.trim());
                                    }
                                    maxDateValue.setHours(23, 59, 59, 999);
                                    if (dateValue > maxDateValue) {
                                        ENTQuiz.Response.isValidData = false;
                                        errorMsg += (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.MaxDate.ar : ENTQuiz.Response.constants.MaxDate.en); + "<br />";
                                        $(qtnCtl).addClass("NotValidData");
                                    }

                                }
                                catch (ex) {
                                    ENTQuiz.Response.isValidData = false;
                                    errorMsg = "Inavlid Date <br />";
                                    $(qtnCtl).addClass("NotValidData");

                                }
                            }
                        }

                        $(qtnCtl_Error).html(errorMsg);
                    }
                }

                //Checkbox
                else if (qtnDataTypeID == 4) {
                    let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                    $(item).removeClass("NotValidData");
                    if (qtnCtl_Error != undefined && qtnCtl_Error.length > 0) {
                        let isrequired = $(qtnCtl).data("isrequired");
                        if (isrequired && (qtnResponse == undefined || qtnResponse.trim() == ""
                            || qtnResponse.trim().toLowerCase() == "false" || qtnResponse.trim() == "0")) {
                            ENTQuiz.Response.isValidData = false;
                            errorMsg = (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.Required.ar : ENTQuiz.Response.constants.Required.en);
                            $(item).addClass("NotValidData");
                        }
                    }
                    $(qtnCtl_Error).html(errorMsg);
                }

                //DropDown
                else if (qtnDataTypeID == 5) {
                    let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                    $(qtnCtl).removeClass("NotValidData");
                    if (qtnCtl_Error != undefined && qtnCtl_Error.length > 0) {
                        let isrequired = $(qtnCtl).data("isrequired");
                        if (isrequired && (qtnResponse == undefined || qtnResponse.trim() == "")) {
                            ENTQuiz.Response.isValidData = false;
                            errorMsg = (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.Required.ar : ENTQuiz.Response.constants.Required.en);
                            $(qtnCtl).addClass("NotValidData");
                        }
                    }
                    $(qtnCtl_Error).html(errorMsg);
                }

                //RadioButton //MultipleCheckbox 
                else if (qtnDataTypeID == 6 ||
                    qtnDataTypeID == 7) {
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
                //Branching
                else if (qtnDataTypeID == 13) {
                    let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                    $(qtnCtl).removeClass("NotValidData");
                    if (qtnCtl_Error != undefined && qtnCtl_Error.length > 0) {
                        let isrequired = $(qtnCtl).parent().parent().data("isrequired");
                        if (isrequired && (qtnResponse == undefined || qtnResponse.trim() == "")) {
                            ENTQuiz.Response.isValidData = false;
                            errorMsg = (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.Required.ar : ENTQuiz.Response.constants.Required.en);
                            $(qtnCtl).addClass("NotValidData");
                        }
                    }
                    $(qtnCtl_Error).html(errorMsg);
                }

                //FileAttachment
                else if (qtnDataTypeID == 11) {
                    let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                    $(qtnCtl).removeClass("NotValidData");
                    if (qtnCtl_Error != undefined && qtnCtl_Error.length > 0) {
                        let isrequired = $(qtnCtl).data("isrequired");
                        if (isrequired && (qtnResponse == undefined || qtnResponse == false)) {
                            ENTQuiz.Response.isValidData = false;
                            errorMsg += (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.Required.ar : ENTQuiz.Response.constants.Required.en);
                            $(qtnCtl).addClass("NotValidData");
                        }
                        $(qtnCtl_Error).html(errorMsg);
                    }
                }
                //RatingByNumbers // Ratings By 5-Emojis
                else if (qtnDataTypeID == 8 ||
                    qtnDataTypeID == 14) {
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

                //MatrixQuestion
                else if (qtnDataTypeID == 9) {
                    let matrixResponses = $.parseJSON(qtnResponse);
                    let rows = $(item).find(".MatrixRows");
                    let rowsCount = rows.length;
                    for (let r = 0; r < rowsCount; r++) {
                        let rowItem = $(rows[r]);
                        $(rowItem).removeClass("NotValidData");
                        let qtnCtl_Error = $(rowItem).find(".ValidationErrorMessage");
                        if (qtnCtl_Error != undefined && qtnCtl_Error.length > 0) {
                            errorMsg = '';
                            let isrequired = $(rowItem).data("isrequired");
                            let rowResponse = $.grep(matrixResponses, function (matrixResponse) {
                                return matrixResponse.RowID == r;
                            });
                            if (isrequired && (rowResponse == undefined ||
                                rowResponse.length == 0 ||
                                rowResponse[0].RowResponse.trim() == "" ||
                                rowResponse[0].RowResponse.trim() == "-1")) {
                                ENTQuiz.Response.isValidData = false;
                                errorMsg += (ENTQuiz.Response.userLanguage == 1 ? ENTQuiz.Response.constants.Required.ar : ENTQuiz.Response.constants.Required.en) + "<br />";
                                $(rowItem).addClass("NotValidData");
                            }
                            $(qtnCtl_Error).html(errorMsg);
                        }
                    }
                }

                //ImageChoices
                else if (qtnDataTypeID == 15) {
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

                //TODO : Pending validation error for other type of controls

            },
            getQuizResponseFromForm: function () {
                ENTQuiz.Response.isValidData = true;
                let quizId = parseInt($("#ent_quizId").val());
                let deptId = parseInt($("#ent_deptId").val());
                let modResponse = {
                    QuizID: quizId,
                    DepartmentId: deptId,
                    QuizQuestionResponses: [],
                    Files: [],
                    Language: ENTQuiz.Response.userLanguage,
                    ResponseStatus: 0,
                };
                ENTquiz.Response.FileReaders = [];

                $(".entQuizQuestionControl").each(function (idx, item) {
                    let qtnDataTypeID = $(item).data("datatypeid");
                    let qtnId = $(item).data("qtnid");
                    let qtnResponse = "";

                    //TextBox
                    if (qtnDataTypeID == 1) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                            ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);
                        }
                    }
                    //MultilineTextBox
                    else if (qtnDataTypeID == 2) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                            ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);
                        }
                    }

                    //Date
                    else if (qtnDataTypeID == 3) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                            ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);
                        }
                    }

                    //Checkbox
                    else if (qtnDataTypeID == 4) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = "" + $(qtnCtl).is(":checked");
                            ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, $(item).parent());

                        }
                    }

                    //Dropdown
                    else if (qtnDataTypeID == 5) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                            ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);
                        }
                    }

                    //Radiobuttons
                    else if (qtnDataTypeID == 6) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]:checked');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                        }
                        ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);

                    }

                    //MultiCheckboxes
                    else if (qtnDataTypeID == 7) {
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

                    //RatingByNumbers //Rating By 5-Emojis
                    else if (qtnDataTypeID == 8 || qtnDataTypeID == 14) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                            ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);
                        }
                    }


                    //MatrixQuestion
                    else if (qtnDataTypeID == 9) {
                        let rows = $(item).find(".MatrixRow");
                        let rowsCount = rows.length;

                        for (let i = 0; i < rowsCount; i++) {
                            if (i > 0) qtnResponse += ',';
                            let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '_' + i + '"]:checked');
                            if (qtnCtl != undefined && qtnCtl.length > 0) {
                                qtnResponse += JSON.stringify({
                                    RowID: i,
                                    RowResponse: $(qtnCtl).val()
                                }, null);
                            }
                            else {
                                qtnResponse += JSON.stringify({
                                    RowID: i,
                                    RowResponse: "-1"
                                }, null);

                            }
                        }
                        qtnResponse = '[' + qtnResponse + ']';
                        ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);

                    }
                    //Slider
                    else if (qtnDataTypeID == 10) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                        }
                    }
                    //FileAttachment
                    else if (qtnDataTypeID == 11) {
                        //fetch file data
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            if (qtnCtl[0].file != undefined && qtnCtl[0].files.length > 0) {
                                qtnResponse = true;
                                let fileCtlFile = qtnCtl[0].files[0];
                                modResponse.Files.push({
                                    QuestionId: qtnId,
                                    FileName: fileCtlFile.name,
                                    FileContentAsString: '',
                                    Size: qtnCtl[0].files[0].size
                                });
                                let reader = new FileReader();
                                ENTQuiz.Response.FileReaders.push({
                                    reader: reader,
                                    isLoaded: false,
                                    File: fileCtlFile,
                                    QuestionId: qtnId,
                                });
                                reader.onload = function () {
                                    let fileItem = $.grep(modResponse.Files, function (file) {
                                        return file.QuestionId == qtnId;
                                    });
                                    let fileReaderItem = $.grep(ENTQuiz.Response.FileReaders, function (file) {
                                        return file.QuestionId == qtnId;
                                    });

                                    fileItem[0].FileContentAsString = reader.result.toString();
                                    fileReaderItem[0].isLoaded = true;
                                    ENTQuiz.Response.submitQuizWithFiles();
                                }
                            }
                            else {
                                qtnResponse = false;
                            }
                        }
                        ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);
                    }

                    //RankingQuestion
                    else if (qtnDataTypeID == 12) {
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
                    //Branching
                    else if (qtnDataTypeID == 13) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]:checked');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                        }
                        ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);

                    }
                    //ImageChoices
                    else if (qtnDataTypeID == 15) {
                        let qtnCtl = $(item).find('[name="ent_mod_q' + qtnId + '"]');
                        if (qtnCtl != undefined && qtnCtl.length > 0) {
                            qtnResponse = $(qtnCtl).val();
                        }
                        ENTQuiz.Response.getValidationError(qtnDataTypeID, qtnId, qtnResponse, item);

                    }

                    modResponse.QuizQuestionResponses.push({
                        ID: qtnId,
                        DataTypeID: qtnDataTypeID,
                        QuestionResponse: qtnResponse
                    });

                });
                return modResponse;
            },
            cancelQuiz: function () {
                window.location = "ManageQuizs.aspx";
                
            },
            publishQuiz: function(){
                if(ENTQuiz.Common.getUrlParams("quizId")!=undefined){
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apiPath + 'publishQuiz?quizId=' + quizId + '&absolutePath=' + location.pathname;
                    $.ajax({
                        type:'POST',
                        url:apiPath_item,
                        headers:{
                            Accept:"application/json;odata=verbose"
                        },
                        async:true,
                        xhrFields:{
                            withCredentials:true
                        },
                        success: function(data_items){
                            alert("Quiz published successfully");
                            window.location = 'ManageQuizs.aspx';
                        },
                        error:function(errordata){
                            console.log("Error while publishing quiz");
                            console.log(errordata);
                            alert("error while publishing quiz");
                        }

                    });
                }
                else {
                    console.log("Quiz not selected");
                    $(".entQuizContainer").html("<div class='ErrorDiv'>Quiz not selected <br /> For additional info, please contact IT Helpdesk</div>");

                }
            },
            ShowPublishQuiz: function(){
                $(".entQuizContainer").hide();
                $("entQuizResponsePublishConfirmationContainer").show();
            },

            BackToQuizView: function(){
                $(".entQuizContainer").show();
                $("entQuizResponsePublishConfirmationContainer").hide();
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