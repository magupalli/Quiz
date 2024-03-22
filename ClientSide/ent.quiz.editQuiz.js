(
    function () {
        'use strict';
        ENTQuiz.Manage = {

            fetched: false,
            items_all: [],
            items: [],
            quizLanguage: 1,
            SetQuizLanguage: function (langID) {
                this.quizLanguage = langID;
                $(".entQuizLanguage").hide();
                this.renderQuizCreator();
                return false;
            },
            getDirectorateListControlWithValue: function () {
                let optDirectorates = ENTQuiz.Commaon.Directorates.map(function (o, idx) {
                    return '<option value=' + idx + '>' + o + '</option>';
                }).join('');

                return '<select id="ddlModDirectorate">' +
                    optDirectorates +
                    '       </select>' +
                    '       <script>$("#ddlModDirectorate").val("' + this.quiz.RequestingDirectorate + '")</script>';
            },
            renderQuizCreator: function () {

                if (this.quiz != undefined) {
                    let quizId = this.quiz.ID;
                    $("#ent_modId").val(quizId);
                    let htmlQuizHeader = '';
                    if (this.quizLanguage == 1) {
                        htmlQuizHeader =
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModTitle _AR>' +
                            '       <div class="QtnLabel"> Title </div>' +
                            '       <div > <input type="text" id="txtModTitle_AR" value="' + this.quiz.Title + '"/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDescription _AR>' +
                            '       <div class="QtnLabel"> Description </div>' +
                            '       <div > <textarea  id="txtModDescription_AR" >' + this.quiz.Description + '</textarea></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Directorate </div>' +
                            '       <div > ' + ENTQuiz.Manage.getDirectorateListControlWithValue() + '</div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Allow Cancel </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModAllowCancel" ' + (this.quiz.AllowCancel ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Allow Multiple Responses </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModMultipleResponse" ' + (this.quiz.AllowMultipleResponse ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Has Welcome Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasWelcomeMessage" ' + (this.quiz.HasWelcomeMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Has Thankyou Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasThankyouMessage" ' + (this.quiz.HasThankyouMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Message ID </div>' +
                            '       <div> <input id="txtModMessageId" value="' + (this.quiz.MessageId) + '" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '   </div>' +
                            '</div>' +
                            '';
                    }
                    else if (this.quizLanguage == 2) {
                        htmlQuizHeader =
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModTitle _EN>' +
                            '       <div class="QtnLabel"> Title </div>' +
                            '       <div > <input type="text" id="txtModTitle_EN" value="' + this.quiz.Title_En + '"/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDescription _EN>' +
                            '       <div class="QtnLabel"> Description </div>' +
                            '       <div > <textarea  id="txtModDescription_EN" >' + this.quiz.Description_En + '</textarea></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN>' +
                            '       <div class="QtnLabel"> Directorate </div>' +
                            '       <div > ' + ENTQuiz.Manage.getDirectorateListControlWithValue() + '</div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN>' +
                            '       <div class="QtnLabel"> Allow Cancel </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModAllowCancel" ' + (this.quiz.AllowCancel ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN>' +
                            '       <div class="QtnLabel"> Allow Multiple Responses </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModMultipleResponse" ' + (this.quiz.AllowMultipleResponse ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN>' +
                            '       <div class="QtnLabel"> Has Welcome Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasWelcomeMessage" ' + (this.quiz.HasWelcomeMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN>' +
                            '       <div class="QtnLabel"> Has Thankyou Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasThankyouMessage" ' + (this.quiz.HasThankyouMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN>' +
                            '       <div class="QtnLabel"> Message ID </div>' +
                            '       <div> <input id="txtModMessageId" value="' + (this.quiz.MessageId) + '" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '   </div>' +
                            '</div>' +
                            '';
                    }
                    else if (this.quizLanguage == 3) {
                        htmlQuizHeader =
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModTitle _EN>' +
                            '       <div class="QtnLabel"> Title </div>' +
                            '       <div > <input type="text" id="txtModTitle_EN" value="' + this.quiz.Title_En + '"/></div>' +
                            '   </div>' +
                            '   <div class="col-sm-6 entModTitle _AR>' +
                            '       <div class="QtnLabel"> Title </div>' +
                            '       <div > <input type="text" id="txtModTitle_AR" value="' + this.quiz.Title + '"/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDescription _EN>' +
                            '       <div class="QtnLabel"> Description </div>' +
                            '       <div > <textarea  id="txtModDescription_EN" >' + this.quiz.Description_En + '</textarea></div>' +
                            '   </div>' +
                            '   <div class="col-sm-6 entModDescription _AR>' +
                            '       <div class="QtnLabel"> Description </div>' +
                            '       <div > <textarea  id="txtModDescription_AR" >' + this.quiz.Description + '</textarea></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Directorate </div>' +
                            '       <div > ' + ENTQuiz.Manage.getDirectorateListControlWithValue() + '</div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Allow Cancel </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModAllowCancel" ' + (this.quiz.AllowCancel ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Allow Multiple Responses </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModMultipleResponse" ' + (this.quiz.AllowMultipleResponse ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Has Welcome Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasWelcomeMessage" ' + (this.quiz.HasWelcomeMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Has Thankyou Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasThankyouMessage" ' + (this.quiz.HasThankyouMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR>' +
                            '       <div class="QtnLabel"> Message ID </div>' +
                            '       <div> <input id="txtModMessageId" value="' + (this.quiz.MessageId) + '" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '   </div>' +
                            '</div>' +
                            '';
                    }
                    $(".entCreateQuizHeaderContainer").html(htmlQuizHeader);

                    let htmlQuizQuestions = this.quiz.Questions.map(function (o, idx) {
                        let qtnPlaceHolder = '';
                        if (ENTQuiz.Manage.quizLanguage == 1) {
                            qtnPlaceHolder =
                                '<div class="entCreateQuizQtn" data-QtnId="' + o.ID + '">' +
                                '<div class="fa fa-times-circle" style="color:coral;float:right;margin:1% 1%;position:absolute;cursor:pointer;z-index:100;" onclick="ENTQuiz.Manage.removeQuestion(this);"></div>' +
                                '   <div class="row">' +
                                '       <div class="col-sm-12 _AR">' +
                                '           <div class="QtnLabel"> Question</div>' +
                                '           <div><input type="text" data-fieldtType="QtnText_AR" value="' + o.Question + '"/></div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="row">' +
                                '       <div class="col-sm-12 _AR">' +
                                '           <div class="QtnLabel"> Order: </div>' +
                                '           <div><input type="text" data-fieldtType="QtnOrder_AR" value="' + o.Order + '"/></div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="row">' +
                                '       <div class="col-sm-12 _AR">' +
                                '           <div class="QtnLabel"> DataType: </div>' +
                                '           <div>' +
                                '               ' + ENTQuiz.Manage.getQuestionDataTypeWithValue(o);
                            '           </div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="specsPlaceHolder"></div>' +
                                '   <div class="validationSpecsPlaceHolder"></div>' +
                                '</div>';
                        }
                        else if (ENTQuiz.Manage.quizLanguage == 2) {
                            qtnPlaceHolder =
                                '<div class="entCreateQuizQtn" data-QtnId="' + o.ID + '">' +
                                '<div class="fa fa-times-circle" style="color:coral;float:right;margin:1% 1%;position:absolute;cursor:pointer;z-index:100;" onclick="ENTQuiz.Manage.removeQuestion(this);"></div>' +
                                '   <div class="row">' +
                                '       <div class="col-sm-12 _EN">' +
                                '           <div class="QtnLabel"> Question</div>' +
                                '           <div><input type="text" data-fieldtType="QtnText_EN" value="' + o.Question_En + '"/></div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="row">' +
                                '       <div class="col-sm-12 _EN">' +
                                '           <div class="QtnLabel"> Order: </div>' +
                                '           <div><input type="text" data-fieldtType="QtnOrder_EN" value="' + o.Order + '"/></div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="row">' +
                                '       <div class="col-sm-12 _EN">' +
                                '           <div class="QtnLabel"> DataType: </div>' +
                                '           <div>' +
                                '               ' + ENTQuiz.Manage.getQuestionDataTypeWithValue(o);
                            '           </div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="specsPlaceHolder"></div>' +
                                '   <div class="validationSpecsPlaceHolder"></div>' +
                                '</div>';
                        }
                        if (ENTQuiz.Manage.quizLanguage == 1) {
                            qtnPlaceHolder =
                                '<div class="entCreateQuizQtn" data-QtnId="' + o.ID + '">' +
                                '<div class="fa fa-times-circle" style="color:coral;float:right;margin:1% 1%;position:absolute;cursor:pointer;z-index:100;" onclick="ENTQuiz.Manage.removeQuestion(this);"></div>' +
                                '   <div class="row">' +
                                '       <div class="col-sm-6 _EN">' +
                                '           <div class="QtnLabel"> Question</div>' +
                                '           <div><input type="text" data-fieldtType="QtnText_EN" value="' + o.Question_En + '"/></div>' +
                                '       </div>' +
                                '       <div class="col-sm-6 _AR">' +
                                '           <div class="QtnLabel"> Question</div>' +
                                '           <div><input type="text" data-fieldtType="QtnText_AR" value="' + o.Question + '"/></div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="row">' +
                                '       <div class="col-sm-6 _EN"><div>' +
                                '       <div class="col-sm-6 _AR">' +
                                '           <div class="QtnLabel"> Order: </div>' +
                                '           <div><input type="text" data-fieldtType="QtnOrder_AR" value="' + o.Order + '"/></div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="row">' +
                                '       <div class="col-sm-6 _EN"><div>' +
                                '       <div class="col-sm-6 _AR">' +
                                '           <div class="QtnLabel"> DataType: </div>' +
                                '           <div>' +
                                '               ' + ENTQuiz.Manage.getQuestionDataTypeWithValue(o);
                            '           </div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="specsPlaceHolder"></div>' +
                                '   <div class="validationSpecsPlaceHolder"></div>' +
                                '</div>';
                        }
                        return qtnPlaceHolder;
                    }).join('');
                    $(".entCreateQuizQtnsContainer").html(htmlQuizQuestions);
                    $(".entCreateQuizQtnsContainer").show();
                    this.QtnIdcntr = this.quiz.Questions[this.quiz.Questions.length - 1].Order;
                }
            },
            apiPath: "",
            initializePage: function () {
                this.fetched = false;
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apiPath + '/getQuiz?quizId=' + quizId + '&absolutePath=' + location.pathname;

                    this.getQuizFromDB(apiPath_item);
                }
                else {
                    console.log("Quiz not selected ");
                    if (ENTQuiz.Common.getUrlParams("quizId") == undefined)
                        $(".entQuizContainer").html("<divclass='ErrorDiv'>Quiz not selected <br/> For additional info, please contact IT helpdesk </div>");

                }
            },
            getQuizFromDB: function (apiPath_item) {
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
                        ENTQuiz.Manage.OnGetQuiz_Success(data_items);
                    },
                    error: function (errordata) {
                        console.log(errordata);
                        if (errordata.responseJSON.ExceptionType == "System.UnauthorizedAccessException") {
                            $(".entQuizContainer").html("<div class='ErrorDiv'> Sorry ! You do not have access to the requested resource. <br/> Please contact IT helpdesk if need access.</div>");
                        }
                        else {
                            $(".entQuizContainer").html("<div class='ErrorDiv'> Sorry ! Error occured while fetching Quiz Questions. Please try again after some time. <br/> If problem persists, contact IT helpdesk.</div>");
                        }

                    },
                });
            },
            OnGetQuiz_Success: function (data_item) {
                //console.log("OnGetQuiz_Success");
                //console.log(data_item);
                if (data_item != undefined && data_item.ErrorCode == undefined) {

                    this.quiz = data_item;
                    this.fetched = true;

                    $(".entQuizDataLoaderMessage").hide();
                    this.SetQuizLanguage(this.quiz.Language);

                }
                else {
                    if (data_item == undefined)
                        $(".entQuizContainer").html("<div class='ErrorDiv'>No draft quiz found with given Id. <br/> Please contact IT Helpdesk</div>");
                    else if (data_item.ErrorCode != undefined) {
                        $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching Quiz details. Please try again after some time. <br/> If Problem persists, contact IT Helpdesk</div><div style='margin:5%;color:coral'>" + data_item.ErrorMessage + "</div>");
                    }

                }
            },
            quiz: {},
            QtnIdcntr: 0,
            renderSpecDetailsControlWithValue: function (oID) {
                let o = $.grep(this.quiz.Questions, function (item) { return item.ID == oID; });
                ENTQuiz.Manage.renderSpecsControlWithValue(o[0]);
                ENTQuiz.Manage.renderValidationSpecsControlWithValue(o[0]);
            },
            renderSpecsControlWithValue: function (o) {
                let specsControls = '';
                let entCreateQuizQtn = $('[data-QtnId="' + (o.ID) + '"]');
                if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                    let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                    let specsPlaceHolder = $(entCreateQuizQtn).find(".specsPlaceHolder");
                    let QtnDataTypeValue = parseInt($(QtnDataType).val());
                    let QtnSpecs = $.parseJSON(o.Specs);
                    /*
                        Text
                        MultiLineText
                        Date
                        Checkbox
                        Dropdown
                        RadioButtons
                        MultiCheckboxes
                        RatingByNumbers
                        MatrixQuestion
                        Slider
                        FileAttachment
                        Ranking
                        Branchig
                        5 Emojis
                    */
                    //Dropdown Options //$('[data-fieldtype="QtnOptions_AR"]').val().split('\n').filter(str=>str)
                    if (QtnDataTypeValue == 5 || //DropDown
                        QtnDataTypeValue == 6 || //RadioButtons
                        QtnDataTypeValue == 7 || //MultiCheckboxes
                        QtnDataTypeValue == 12) //Ranking
                    {
                        //Arabic
                        if (this.quizLanguage == 1) {
                            let htmlChoices = '';
                            $(QtnSpecs.ar).map(function (idx, choice) {
                                htmlChoices += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12" _AR>' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_AR" rows="5">' + htmlChoices + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            let htmlChoices = '';
                            $(QtnSpecs.en).map(function (idx, choice) {
                                htmlChoices += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12" _EN>' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_EN" rows="5">' + htmlChoices + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {
                            let htmlChoices_ar = '';
                            $(QtnSpecs.ar).map(function (idx, choice) {
                                htmlChoices_ar += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            let htmlChoices_en = '';
                            $(QtnSpecs.en).map(function (idx, choice) {
                                htmlChoices_en += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN>' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_EN" rows="5">' + htmlChoices_en + '</textarea></div>' +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR>' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_AR" rows="5">' + htmlChoices_ar + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }

                    }

                    //RatingByNumbers //Slider
                    else if (QtnDataTypeValue == 8 || //RatingByNumbers
                        QtnDataTypeValue == 10) //Slider
                    {
                        let minVal = QtnSpecs.min;
                        let maxVal = QtnSpecs.max;
                        let stepVal = QtnSpecs.step;

                        let ctlHTML_AR = '<div style="float:right"><span class="QtnLabel">Min: </span><input placeholder="Min" type="number" value="' + minVal + '" data-fieldType="QtnMinRank" min="0" max="200" onkeypress="return event.charCode>=47 && event.charCode<=57" /></div>' +
                            '                <div style="float:right;margin:0 2%;"><span class="QtnLabel">Max: </span><input placeholder="Max" type="number" value="' + maxVal + '" data-fieldType="QtnMaxRank" min="0" max="200" onkeypress="return event.charCode>=47 && event.charCode<=57" /></div>' +
                            '                <div style="float:right;margin:0 2%;"><span class="QtnLabel">Step: </span><input placeholder="Step" type="number" value="' + stepVal + '" data-fieldType="QtnStepRank" min="0" max="200" onkeypress="return event.charCode>=47 && event.charCode<=57" /></div>';
                        let ctlHTML_EN = '<div style="float:left"><span class="QtnLabel">Min: </span><input placeholder="Min" type="number" value="' + minVal + '" data-fieldType="QtnMinRank" min="0" max="200" onkeypress="return event.charCode>=47 && event.charCode<=57" /></div>' +
                            '                <div style="float:left;margin:0 2%;"><span class="QtnLabel">Max: </span><input placeholder="Max" type="number" value="' + maxVal + '" data-fieldType="QtnMaxRank" min="0" max="200" onkeypress="return event.charCode>=47 && event.charCode<=57" /></div>' +
                            '                <div style="float:left;margin:0 2%;"><span class="QtnLabel">Step: </span><input placeholder="Step" type="number" value="' + stepVal + '" data-fieldType="QtnStepRank" min="0" max="200" onkeypress="return event.charCode>=47 && event.charCode<=57" /></div>';

                        if (this.quizLanguage == 1) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                        else if (this.quizLanguage == 2) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                ctlHTML_EN +
                                '   </div>' +
                                '</div>';
                        }
                        else if (this.quizLanguage == 3) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6 _EN"></div>' +
                                '   <div class="col-sm-6 _AR">' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                    }

                    //MatrixOptions
                    else if (QtnDataTypeValue == 9) {
                        if (this.quizLanguage == 1) {
                            let cols = QtnSpecs.Cols.ar;
                            let rows = QtnSpecs.Rows.ar;
                            let htmlCols = '';
                            let htmlRows = '';
                            $(cols).map(function (idx, choice) {
                                htmlCols += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            $(rows).map(function (idx, choice) {
                                htmlRows += ((idx > 0) ? '\r\n' : '') + choice;
                            });

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR" >' +
                                '       <div class="QtnLabel"> Columns : </div><div><textarea data-fieldType="QtnMatrixCols_AR" rows="5" >' + htmlCols + '</textarea></div>' +
                                '       <div class="QtnLabel"> Rows : </div><div><textarea data-fieldType="QtnMatrixRows_AR" rows="5" style="width:100%">' + htmlRows + '</textarea></div>' +
                                '   </div>' +
                                '</div>';

                        }
                        else if (this.quizLanguage == 2) {
                            let cols = QtnSpecs.Cols.en;
                            let rows = QtnSpecs.Rows.en;
                            let htmlCols = '';
                            let htmlRows = '';
                            $(cols).map(function (idx, choice) {
                                htmlCols += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            $(rows).map(function (idx, choice) {
                                htmlRows += ((idx > 0) ? '\r\n' : '') + choice;
                            });

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN" >' +
                                '       <div class="QtnLabel"> Columns : </div><div><textarea data-fieldType="QtnMatrixCols_EN" rows="5" >' + htmlCols + '</textarea></div>' +
                                '       <div class="QtnLabel"> Rows : </div><div><textarea data-fieldType="QtnMatrixRows_EN" rows="5" style="width:100%">' + htmlRows + '</textarea></div>' +
                                '   </div>' +
                                '</div>';

                        }
                        else if (this.quizLanguage == 3) {
                            let cols_ar = QtnSpecs.Cols.ar;
                            let rows_ar = QtnSpecs.Rows.ar;
                            let htmlCols_ar = '';
                            let htmlRows_ar = '';
                            $(cols_ar).map(function (idx, choice) {
                                htmlCols_ar += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            $(rows_ar).map(function (idx, choice) {
                                htmlRows_ar += ((idx > 0) ? '\r\n' : '') + choice;
                            });

                            let cols_en = QtnSpecs.Cols.en;
                            let rows_en = QtnSpecs.Rows.en;
                            let htmlCols_en = '';
                            let htmlRows_en = '';
                            $(cols_en).map(function (idx, choice) {
                                htmlCols_en += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            $(rows_en).map(function (idx, choice) {
                                htmlRows_en += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6 _EN" >' +
                                '       <div class="QtnLabel"> Columns : </div><div><textarea data-fieldType="QtnMatrixCols_EN" rows="5" >' + htmlCols_en + '</textarea></div>' +
                                '       <div class="QtnLabel"> Rows : </div><div><textarea data-fieldType="QtnMatrixRows_EN" rows="5" style="width:100%">' + htmlRows_en + '</textarea></div>' +
                                '   </div>' +
                                '   <div class="col-sm-6 _AR" >' +
                                '       <div class="QtnLabel"> Columns : </div><div><textarea data-fieldType="QtnMatrixCols_AR" rows="5" >' + htmlCols_ar + '</textarea></div>' +
                                '       <div class="QtnLabel"> Rows : </div><div><textarea data-fieldType="QtnMatrixRows_AR" rows="5" style="width:100%">' + htmlRows_ar + '</textarea></div>' +
                                '   </div>' +
                                '</div>';

                        }
                    }

                    //ImageChoices
                    else if (QtnDataTypeValue == 15) {
                        let selected = " selected='selected' ";
                        let imageSize = QtnSpecs.size;
                        let ctlHTML_AR = '<div style="float:right;"><span class="QtnLabel">Size: </span><select data-fieldType="QtnImageSize"><option value="0" ' + (imageSize == 0 ? selected : '') + '>Small</option><option value="1" ' + (imageSize == 1 ? selected : '') + '>Medium</option><option value="2" ' + (imageSize == 2 ? selected : '') + '>Large</option></select></div>';
                        let ctlHTML_EN = '<div style="float:left;"><span class="QtnLabel">Size: </span><select data-fieldType="QtnImageSize"><option value="0" ' + (imageSize == 0 ? selected : '') + '>Small</option><option value="1" ' + (imageSize == 1 ? selected : '') + '>Medium</option><option value="2" ' + (imageSize == 2 ? selected : '') + '>Large</option></select></div>';

                        if (this.quizLanguage == 1) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                        else if (this.quizLanguage == 2) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                ctlHTML_EN +
                                '   </div>' +
                                '</div>';
                        }
                        else if (this.quizLanguage == 3) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6 _EN"></div>' +
                                '   <div class="col-sm-6 _AR">' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                    }
                    //Branching
                    else if (QtnDataTypeValue == 13) {
                        if (this.quizLanguage == 1) {
                            let htmlChoices = '';
                            $(QtnSpecs.ar).map(function (idx, choice) {
                                htmlChoices += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                '       <div class="QtnLabel"> Options: </div><div><textarea data-fieldType="QtnOptions_AR" rows="5">' + htmlChoices + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        else if (this.quizLanguage == 2) {
                            let htmlChoices = '';
                            $(QtnSpecs.en).map(function (idx, choice) {
                                htmlChoices += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                '       <div class="QtnLabel"> Options: </div><div><textarea data-fieldType="QtnOptions_EN" rows="5">' + htmlChoices + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        else if (this.quizLanguage == 3) {
                            let htmlChoices_ar = '';
                            $(QtnSpecs.ar).map(function (idx, choice) {
                                htmlChoices_ar += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            let htmlChoices_en = '';
                            $(QtnSpecs.en).map(function (idx, choice) {
                                htmlChoices_en += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6 _EN">' +
                                '       <div class="QtnLabel"> Options: </div><div><textarea data-fieldType="QtnOptions_EN" rows="5">' + htmlChoices_en + '</textarea></div>' +
                                '   </div>' +
                                '   <div class="col-sm-6 _AR">' +
                                '       <div class="QtnLabel"> Options: </div><div><textarea data-fieldType="QtnOptions_AR" rows="5">' + htmlChoices_ar + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                    }

                    $(specsPlaceHolder).html(specsControls);


                }
            },

            renderValidationSpecsControlWithValue: function (o) {

                let specsControls = '';
                let entCreateQuizQtn = $('[data-QtnId="' + (o.ID) + '"]');
                if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                    let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                    let specsPlaceHolder = $(entCreateQuizQtn).find('.validationSpecsPlaceHolder');

                    let QtnDataTypeValue = parseInt($(QtnDataType).val());
                    /*
                        Text
                        MultiLineText
                        Date
                        Checkbox
                        Dropdown
                        RadioButtons
                        MultiCheckboxes
                        RatingByNumbers
                        MatrixQuestion
                        Slider
                        FileAttachment
                        Ranking
                        Branchig
                        5 Emojis
                    */
                    //if not Slider and Ranking and Dropdown
                    if (QtnDataTypeValue != 4 && QtnDataTypeValue != 10 && QtnDataTypeValue != 12) {
                        specsControls += this.renderValidationControlWithValue(1, o); //IsRequired
                    }

                    //Text //MultiLineText
                    if (QtnDataTypeValue == 1 || QtnDataTypeValue == 2) {
                        specsControls += this.renderValidationControlWithValue(2, o); //MaxChars
                    }
                    else if (QtnDataTypeValue == 3) {
                        specsControls += this.renderValidationControlWithValue(3, o); //MinDate //MaxDate
                    }
                }

                $(specsPlaceHolder).html(specsControls);
            },
            renderValidationControlWithValue: function (ValidationCtlId, o) {
                let QtnValidationSpecs = $.parseJSON(o.ValidationSpecs);
                if (this.quizLanguage == 1) {
                    //IsRequired
                    if (ValidationCtlId == 1) {
                        let checked = (QtnValidationSpecs.isRequired ? "checked" : "");
                        return '<div class="row">' +
                            '       <div class="col-sm-12 _AR">' +
                            '           <div><span class="QtnLabel"> Is Required : </span><input type="checkbox" data-fieldType="QtnIsRequired" ' + checked + '/></div>' +
                            '       </div>' +
                            '   </div>';
                    }
                    //MaxChars
                    else if (ValidationCtlId == 2) {
                        let maxChars = (QtnValidationSpecs.maxChars);
                        return '<div class="row">' +
                            '       <div class="col-sm-12 _AR">' +
                            '           <div><span class="QtnLabel"> Max Characters: </span><input type="number" value="' + maxChars + '" data-fieldType="QtnMaxChars" min="0" max="200000" onkeypress="return event.charCode>=47 && event.charCode<=57" /></div>' +
                            '       </div>' +
                            '   </div>';
                    }
                    //MinDate //MaxDate
                    else if (ValidationCtlId == 3) {
                        let min = (QtnValidationSpecs.min);
                        let max = (QtnValidationSpecs.max);
                        return '<div class="row">' +
                            '       <div class="col-sm-12 _AR">' +
                            '           <div style="border:solid 1px;width:60%;"><div class="QtnLabel">Min Date : </div><div ><input type="radio" data-fieldtype="QtnMinDate" name="QtnId' + o.ID + '_MinDate" value="0" ' + (min == '' ? 'checked' : '') + '/> None </div><div><input type="radio" data-fieldtype="QtnMinDate"  name="QtnId' + o.ID + '_MinDate" value="1" ' + (min == 'Today' ? 'checked' : '') + '/>Today</div><div><input type="radio" data-fieldtype="QtnMinDate"  name="QtnId' + o.ID + '_MinDate" value="2" ' + (min != '' && min != 'Today' ? 'checked' : '') + '/> <input type="date" data-fieldtype="Qtn_MinDateValue" value="' + ((min != '' && min != 'Today') ? min : '') + '"/> </div></div>' +
                            '           <div style="border:solid 1px;width:60%;"><div class="QtnLabel">Max Date : </div><div ><input type="radio" data-fieldtype="QtnMaxDate" name="QtnId' + o.ID + '_MaxDate" value="0" ' + (max == '' ? 'checked' : '') + '/> None </div><div><input type="radio" data-fieldtype="QtnMaxDate"  name="QtnId' + o.ID + '_MaxDate" value="1" ' + (max == 'Today' ? 'checked' : '') + '/>Today</div><div><input type="radio" data-fieldtype="QtnMaxDate"  name="QtnId' + o.ID + '_MaxDate" value="2" ' + (max != '' && max != 'Today' ? 'checked' : '') + '/> <input type="date" data-fieldtype="Qtn_MaxDateValue" value="' + ((min != '' && min != 'Today') ? min : '') + '"/> </div></div>' +
                            '       </div>' +
                            '   </div>';
                    }
                }
                else if (this.quizLanguage == 2) {
                    //IsRequired
                    if (ValidationCtlId == 1) {
                        let checked = (QtnValidationSpecs.isRequired ? "checked" : "");
                        return '<div class="row">' +
                            '       <div class="col-sm-12 _EN">' +
                            '           <div><span class="QtnLabel"> Is Required : </span><input type="checkbox" data-fieldType="QtnIsRequired" ' + checked + '/></div>' +
                            '       </div>' +
                            '   </div>';
                    }
                    //MaxChars
                    else if (ValidationCtlId == 2) {
                        let maxChars = (QtnValidationSpecs.maxChars);
                        return '<div class="row">' +
                            '       <div class="col-sm-12 _EN">' +
                            '           <div><span class="QtnLabel"> Max Characters: </span><input type="number" value="' + maxChars + '" data-fieldType="QtnMaxChars" min="0" max="200000" onkeypress="return event.charCode>=47 && event.charCode<=57" /></div>' +
                            '       </div>' +
                            '   </div>';
                    }
                    //MinDate //MaxDate
                    else if (ValidationCtlId == 3) {
                        let min = (QtnValidationSpecs.min);
                        let max = (QtnValidationSpecs.max);
                        return '<div class="row">' +
                            '       <div class="col-sm-12 _EN">' +
                            '           <div style="border:solid 1px;width:60%;"><div class="QtnLabel">Min Date : </div><div ><input type="radio" data-fieldtype="QtnMinDate" name="QtnId' + o.ID + '_MinDate" value="0" ' + (min == '' ? 'checked' : '') + '/> None </div><div><input type="radio" data-fieldtype="QtnMinDate"  name="QtnId' + o.ID + '_MinDate" value="1" ' + (min == 'Today' ? 'checked' : '') + '/>Today</div><div><input type="radio" data-fieldtype="QtnMinDate"  name="QtnId' + o.ID + '_MinDate" value="2" ' + (min != '' && min != 'Today' ? 'checked' : '') + '/> <input type="date" data-fieldtype="Qtn_MinDateValue" value="' + ((min != '' && min != 'Today') ? min : '') + '"/> </div></div>' +
                            '           <div style="border:solid 1px;width:60%;"><div class="QtnLabel">Max Date : </div><div ><input type="radio" data-fieldtype="QtnMaxDate" name="QtnId' + o.ID + '_MaxDate" value="0" ' + (max == '' ? 'checked' : '') + '/> None </div><div><input type="radio" data-fieldtype="QtnMaxDate"  name="QtnId' + o.ID + '_MaxDate" value="1" ' + (max == 'Today' ? 'checked' : '') + '/>Today</div><div><input type="radio" data-fieldtype="QtnMaxDate"  name="QtnId' + o.ID + '_MaxDate" value="2" ' + (max != '' && max != 'Today' ? 'checked' : '') + '/> <input type="date" data-fieldtype="Qtn_MaxDateValue" value="' + ((min != '' && min != 'Today') ? min : '') + '"/> </div></div>' +
                            '       </div>' +
                            '   </div>';
                    }
                }
                else if (this.quizLanguage == 3) {
                    //IsRequired
                    if (ValidationCtlId == 1) {
                        let checked = (QtnValidationSpecs.isRequired ? "checked" : "");
                        return '<div class="row">' +
                            '       <div class="col-sm-6 _EN"></div>' +
                            '       <div class="col-sm-6 _AR">' +
                            '           <div><span class="QtnLabel"> Is Required : </span><input type="checkbox" data-fieldType="QtnIsRequired" ' + checked + '/></div>' +
                            '       </div>' +
                            '   </div>';
                    }
                    //MaxChars
                    else if (ValidationCtlId == 2) {
                        let maxChars = (QtnValidationSpecs.maxChars);
                        return '<div class="row">' +
                            '       <div class="col-sm-6 _EN"></div>' +
                            '       <div class="col-sm-6 _AR">' +
                            '           <div><span class="QtnLabel"> Max Characters: </span><input type="number" value="' + maxChars + '" data-fieldType="QtnMaxChars" min="0" max="200000" onkeypress="return event.charCode>=47 && event.charCode<=57" /></div>' +
                            '       </div>' +
                            '   </div>';
                    }
                    //MinDate //MaxDate
                    else if (ValidationCtlId == 3) {
                        let min = (QtnValidationSpecs.min);
                        let max = (QtnValidationSpecs.max);
                        return '<div class="row">' +
                            '       <div class="col-sm-6 _EN"></div>' +
                            '       <div class="col-sm-6 _AR">' +
                            '           <div style="border:solid 1px;width:60%;"><div class="QtnLabel">Min Date : </div><div ><input type="radio" data-fieldtype="QtnMinDate" name="QtnId' + o.ID + '_MinDate" value="0" ' + (min == '' ? 'checked' : '') + '/> None </div><div><input type="radio" data-fieldtype="QtnMinDate"  name="QtnId' + o.ID + '_MinDate" value="1" ' + (min == 'Today' ? 'checked' : '') + '/>Today</div><div><input type="radio" data-fieldtype="QtnMinDate"  name="QtnId' + o.ID + '_MinDate" value="2" ' + (min != '' && min != 'Today' ? 'checked' : '') + '/> <input type="date" data-fieldtype="Qtn_MinDateValue" value="' + ((min != '' && min != 'Today') ? min : '') + '"/> </div></div>' +
                            '           <div style="border:solid 1px;width:60%;"><div class="QtnLabel">Max Date : </div><div ><input type="radio" data-fieldtype="QtnMaxDate" name="QtnId' + o.ID + '_MaxDate" value="0" ' + (max == '' ? 'checked' : '') + '/> None </div><div><input type="radio" data-fieldtype="QtnMaxDate"  name="QtnId' + o.ID + '_MaxDate" value="1" ' + (max == 'Today' ? 'checked' : '') + '/>Today</div><div><input type="radio" data-fieldtype="QtnMaxDate"  name="QtnId' + o.ID + '_MaxDate" value="2" ' + (max != '' && max != 'Today' ? 'checked' : '') + '/> <input type="date" data-fieldtype="Qtn_MaxDateValue" value="' + ((min != '' && min != 'Today') ? min : '') + '"/> </div></div>' +
                            '       </div>' +
                            '   </div>';
                    }
                }

                return "";
            },
            renderSpecDetailsControl: function (QtnIdcntr) {
                ENTQuiz.Manage.renderSpecsControl(QtnIdcntr);
                ENTQuiz.Manage.renderValidationSpecsControl(QtnIdcntr);
            },
            renderSpecsControl: function (QtnIdcntr) {
                let specsControls = '';
                let entCreateQuizQtn = $('[data-QtnId="' + (QtnIdcntr) + '"]');
                if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                    let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtndataType"]');
                    let specsPlaceHolder = $(entCreateQuizQtn).find('.specsPlaceHolder');

                    let QtnDataTypeValue = parseInt($(QtnDataType).val());
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

                    //Dropdown Options //$('[data-fieldtype="QtnOptions_AR"]').val().split('\n').filter(str=>str)
                    if (QtnDataTypeValue == 5 || //Dropdown
                        QtnDataTypeValue == 6 || //RadioButtons
                        QtnDataTypeValue == 7 || //MultiCheckboxes
                        QtnDataTypeValue == 12) //Ranking
                    {
                        let ctlHTML_AR = '<div class="QtnLabel"> Options </div><div><textarea data-fieldtype="QtnOptions_AR" rows="5" ></textarea></div>';
                        let ctlHTML_EN = '<div class="QtnLabel"> Options </div><div><textarea data-fieldtype="QtnOptions_EN" rows="5" ></textarea></div>';

                        //Arabic
                        if (this.quizLanguage == 1) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _EN"> ' +
                                ctlHTML_EN +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-6 _EN"> ' +
                                ctlHTML_EN +
                                '   </div>' +
                                '   <div class="col-sm-6 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                    }
                    //RatingByNumbers //Slider
                    else if (QtnDataTypeValue == 8 || //RatingByNumbers
                        QtnDataTypeValue == 10) //Slider
                    {
                        let ctlHTML_AR =
                            '<div style="float:right;"><span class="QtnLabel"> Min : </span><input value="1" placeholder="Min" type="number" data-fieldType="QtnMinRank" min="0" max="200" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '<div style="float:right;margin: 0 2%;"><span class="QtnLabel"> Max : </span><input value="10" placeholder="Max" type="number" data-fieldType="QtnMaxRank" min="0" max="200" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '<div style="float:right;margin: 0 2%;"><span class="QtnLabel"> Step : </span><input value="10" placeholder="Step" type="number" data-fieldType="QtnStepRank" min="0" max="200" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>';
                        let ctlHTML_EN =
                            '<div style="float:left;"><span class="QtnLabel"> Min : </span><input value="1" placeholder="Min" type="number" data-fieldType="QtnMinRank" min="0" max="200" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '<div style="float:left;margin: 0 2%;"><span class="QtnLabel"> Max : </span><input value="10" placeholder="Max" type="number" data-fieldType="QtnMaxRank" min="0" max="200" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '<div style="float:left;margin: 0 2%;"><span class="QtnLabel"> Step : </span><input value="10" placeholder="Step" type="number" data-fieldType="QtnStepRank" min="0" max="200" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>';

                        //Arabic
                        if (this.quizLanguage == 1) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _EN"> ' +
                                ctlHTML_EN +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-6 _EN"> </div>' +
                                '   <div class="col-sm-6 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                    }
                    //Matrix Options 
                    else if (QtnDataTypeValue == 9) {
                        let ctlHTML_AR =
                            '<div class="QtnLabel"> Columns : </div><div><textarea data-fieldType="qtnMatrixCols_AR" rows="5" ></textarea></div>' +
                            '<div class="QtnLabel"> Rows : </div><div><textarea data-fieldType="qtnMatrixRows_AR" rows="5" style="width:100%" ></textarea></div>';
                        let ctlHTML_EN =
                            '<div class="QtnLabel"> Columns : </div><div><textarea data-fieldType="qtnMatrixCols_EN" rows="5" ></textarea></div>' +
                            '<div class="QtnLabel"> Rows : </div><div><textarea data-fieldType="qtnMatrixRows_EN" rows="5" style="width:100%" ></textarea></div>';

                        //Arabic
                        if (this.quizLanguage == 1) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _EN"> ' +
                                ctlHTML_EN +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-6 _EN"> ' +
                                ctlHTML_EN +
                                '   </div>' +
                                '   <div class="col-sm-6 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                    }
                    //ImageChoices
                    else if (QtnDataTypeValue == 15) {
                        let ctlHTML_AR =
                            '<div style="float:right;"><span class="QtnLabel"> Size : </span><select data-fieldType="QtnImageSize"><option value="0">Small</option><option value="1">Medium</option><option value="2">Large</option></select></div>';
                        let ctlHTML_EN =
                            '<div style="float:left;"><span class="QtnLabel"> Size : </span><select data-fieldType="QtnImageSize"><option value="0">Small</option><option value="1">Medium</option><option value="2">Large</option></select></div>';

                        //Arabic
                        if (this.quizLanguage == 1) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _EN"> ' +
                                ctlHTML_EN +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-6 _EN"> </div>' +
                                '   <div class="col-sm-6 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                    }

                    //Branching 
                    else if (QtnDataTypeValue == 13) {
                        let ctlHTML_AR =
                            '<div class="QtnLabel"> Options : </div><div><textarea data-fieldType="qtnOptions_AR" rows="5" ></textarea></div>';
                        let ctlHTML_EN =
                            '<div class="QtnLabel"> Columns : </div><div><textarea data-fieldType="qtnOptions_EN" rows="5" ></textarea></div>';

                        //Arabic
                        if (this.quizLanguage == 1) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-12 _EN"> ' +
                                ctlHTML_EN +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {
                            specControls +=
                                '<div class="row"> ' +
                                '   <div class="col-sm-6 _EN"> ' +
                                ctlHTML_EN +
                                '   </div>' +
                                '   <div class="col-sm-6 _AR"> ' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                    }

                    $(specsPlaceHolder).html(specsControls);

                }
            },


            renderValidationControl: function (ValidationCtlId, QtnIdcntr) {

                //Arabic
                if (this.quizLanguage == 1) {
                    //IsRequired
                    if (ValidationCtlId == 1) {
                        return '<div class="row"> ' +
                            '           <div class="col-sm-12 _AR"> ' +
                            '               <div><span class="QtnLabel"> Is Required : </span><input type="checkbox" data-FieldType="QtnIsRequired" /></div>' +
                            '           </div>' +
                            '       </div>';
                    }
                    //MaxChars
                    else if (ValidationCtlId == 2) {
                        return '<div class="row"> ' +
                            '           <div class="col-sm-12 _AR"> ' +
                            '               <div><span class="QtnLabel"> Max Characters : </span><input type="number" data-FieldType="QtnMaxChars" min="0" max="200000" onkeypress="return event.charCode>=48 && event.charCode<=57" value="2000" /></div>' +
                            '           </div>' +
                            '       </div>';
                    }

                    //MinDate //MaxDate
                    else if (ValidationCtlId == 3) {
                        return '<div class="row"> ' +
                            '           <div class="col-sm-12 _AR"> ' +
                            '               <div style="border:solid 1px;width:60%">' +
                            '                   <div class="QtnLabel"> Min Date : </div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMinDate" name="QtnId' + QtnIdcntr + '_MinDate value="0"checked />None</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMinDate" name="QtnId' + QtnIdcntr + '_MinDate value="1"checked />Today</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMinDate" name="QtnId' + QtnIdcntr + '_MinDate value="2"checked />' +
                            '                        <input type="date" data-fieldType="QtnId_MinDateValue" /> ' +
                            '                   </div>' +
                            '               </div>' +
                            '               <div style="border:solid 1px;width:60%">' +
                            '                   <div class="QtnLabel"> Max Date : </div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMaxDate" name="QtnId' + QtnIdcntr + '_MaxDate value="0"checked />None</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMaxDate" name="QtnId' + QtnIdcntr + '_MaxDate value="1"checked />Today</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMaxDate" name="QtnId' + QtnIdcntr + '_MaxDate value="2"checked />' +
                            '                        <input type="date" data-fieldType="QtnId_MaxDateValue" /> ' +
                            '                   </div>' +
                            '               </div>' +
                            '           </div>' +
                            '  </div>';
                    }
                }
                //English
                else if (this.quizLanguage == 2) {
                    //IsRequired
                    if (ValidationCtlId == 1) {
                        return '<div class="row"> ' +
                            '           <div class="col-sm-12 _EN"> ' +
                            '               <div><span class="QtnLabel"> Is Required : </span><input type="checkbox" data-FieldType="QtnIsRequired" /></div>' +
                            '           </div>' +
                            '       </div>';
                    }
                    //MaxChars
                    else if (ValidationCtlId == 2) {
                        return '<div class="row"> ' +
                            '           <div class="col-sm-12 _EN"> ' +
                            '               <div><span class="QtnLabel"> Max Characters : </span><input type="number" data-FieldType="QtnMaxChars" min="0" max="200000" onkeypress="return event.charCode>=48 && event.charCode<=57" value="2000" /></div>' +
                            '           </div>' +
                            '       </div>';
                    }

                    //MinDate //MaxDate
                    else if (ValidationCtlId == 3) {
                        return '<div class="row"> ' +
                            '           <div class="col-sm-12 _EN"> ' +
                            '               <div style="border:solid 1px;width:60%">' +
                            '                   <div class="QtnLabel"> Min Date : </div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMinDate" name="QtnId' + QtnIdcntr + '_MinDate value="0"checked />None</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMinDate" name="QtnId' + QtnIdcntr + '_MinDate value="1"checked />Today</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMinDate" name="QtnId' + QtnIdcntr + '_MinDate value="2"checked />' +
                            '                        <input type="date" data-fieldType="QtnId_MinDateValue" /> ' +
                            '                   </div>' +
                            '               </div>' +
                            '               <div style="border:solid 1px;width:60%">' +
                            '                   <div class="QtnLabel"> Max Date : </div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMaxDate" name="QtnId' + QtnIdcntr + '_MaxDate value="0"checked />None</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMaxDate" name="QtnId' + QtnIdcntr + '_MaxDate value="1"checked />Today</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMaxDate" name="QtnId' + QtnIdcntr + '_MaxDate value="2"checked />' +
                            '                        <input type="date" data-fieldType="QtnId_MaxDateValue" /> ' +
                            '                   </div>' +
                            '               </div>' +
                            '           </div>' +
                            '  </div>';
                    }

                }
                //Both
                else if (this.quizLanguage == 3) {

                    //IsRequired
                    if (ValidationCtlId == 1) {
                        return '<div class="row"> ' +
                            '           <div class="col-sm-6 _EN"></div> ' +
                            '           <div class="col-sm-6 _AR"> ' +
                            '               <div><span class="QtnLabel"> Is Required : </span><input type="checkbox" data-FieldType="QtnIsRequired" /></div>' +
                            '           </div>' +
                            '       </div>';
                    }
                    //MaxChars
                    else if (ValidationCtlId == 2) {
                        return '<div class="row"> ' +
                            '           <div class="col-sm-6 _EN"></div> ' +
                            '           <div class="col-sm-6 _AR"> ' +
                            '               <div><span class="QtnLabel"> Max Characters : </span><input type="number" data-FieldType="QtnMaxChars" min="0" max="200000" onkeypress="return event.charCode>=48 && event.charCode<=57" value="2000" /></div>' +
                            '           </div>' +
                            '       </div>';
                    }

                    //MinDate //MaxDate
                    else if (ValidationCtlId == 3) {
                        return '<div class="row"> ' +
                            '           <div class="col-sm-6 _EN"></div> ' +
                            '           <div class="col-sm-6 _AR"> ' +
                            '               <div style="border:solid 1px;width:60%">' +
                            '                   <div class="QtnLabel"> Min Date : </div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMinDate" name="QtnId' + QtnIdcntr + '_MinDate value="0"checked />None</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMinDate" name="QtnId' + QtnIdcntr + '_MinDate value="1"checked />Today</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMinDate" name="QtnId' + QtnIdcntr + '_MinDate value="2"checked />' +
                            '                        <input type="date" data-fieldType="QtnId_MinDateValue" /> ' +
                            '                   </div>' +
                            '               </div>' +
                            '               <div style="border:solid 1px;width:60%">' +
                            '                   <div class="QtnLabel"> Max Date : </div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMaxDate" name="QtnId' + QtnIdcntr + '_MaxDate value="0"checked />None</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMaxDate" name="QtnId' + QtnIdcntr + '_MaxDate value="1"checked />Today</div>' +
                            '                   <div><input type="radio" data-FieldType="QtnMaxDate" name="QtnId' + QtnIdcntr + '_MaxDate value="2"checked />' +
                            '                        <input type="date" data-fieldType="QtnId_MaxDateValue" /> ' +
                            '                   </div>' +
                            '               </div>' +
                            '           </div>' +
                            '  </div>';
                    }

                }

                return "";

            },

            renderValidationSpecsControl: function (QtnIdcntr) {

                let specsControls = '';
                let entCreateQuizQtn = $('[data-QtnId="' + (QtnIdcntr) + '"]');
                if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                    let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                    let specsPlaceHolder = $(entCreateQuizQtn).find('.specPlaceHolder');

                    let QtnDataTypeValue = parseInt($(QtnDataType).val());
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

                    //if not Slider and Ranking and Dropdown
                    if (QtnDataTypeValue != 0 && QtnDataTypeValue != 10 && QtnDataTypeValue != 12) {
                        specsControls += this.renderValidationControl(1); //IsRequired
                    }

                    //Text // MultilineText
                    if (QtnDataTypeValue == 1 || QtnDataTypeValue == 2) {
                        specsControls += this.renderValidationControl(2); //MaxChars
                    }
                    //Min Date // Max Date
                    else if (QtnDataTypeValue == 1 || QtnDataTypeValue == 2) {
                        specsControls += this.renderValidationControl(3, QtnIdcntr); //Min Date // Max Date
                    }
                }
                $(specPlaceHolder).html(specsControls);

            },

            removeQuestion: function (qtnHandle) {
                $(qtnHandle).parent()[0].outerHTML = '';
            },

            AddQtnPlaceHolder: function () {

                let qtnPlaceHolder = '';
                (++this.QtnIdcntr);
                //Arabic
                if (this.quizLanguage == 1) {
                    qtnPlaceHolder =
                        '<div class="entCreateQuizQtn" data-QtnId="' + (-(this.QtnIdcntr)) + '"> ' +
                        '<div class="fa fa-times-circle" style="color:coral;float:right;margin:1% 1%;cursor:pointer;z-index:100;" onclick="ENTQuiz.Manage.removeQuestion(this);"></div>' +
                        '   <div class="row" style="clear:both"> ' +
                        '       <div class="col-sm-12 _AR"> ' +
                        '           <div class="QtnLabel"> Question </div> ' +
                        '           <div> <input type="text" data-fieldType="QtnText_AR" /> </div> ' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="row" > ' +
                        '       <div class="col-sm-12 _AR"> ' +
                        '           <div class="QtnLabel"> Order </div> ' +
                        '           <div> <input type="text" data-fieldType="QtnOrder" value="' + this.QtnIdcntr + '"/> </div> ' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="row" > ' +
                        '       <div class="col-sm-12 _AR"> ' +
                        '           <div class="QtnLabel"> DataType </div> ' +
                        '           <div> ' +
                        '               <select data=fieldType="QtnDataType" onchange="ENTQuiz.Manage.renderSpecDetailsControl(' + (-(this.QtnIdcntr)) + ')" >' +
                        '               ' + ENTQuiz.Manage.getQuestionDataTypeOptions() +
                        '               </select>' +
                        '           </div> ' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="specsPlaceHolder" > ' +
                        '   </div>' +
                        '   <div class="validationSpecsPlaceHolder" > ' +
                        '   </div>' +
                        '</div>';


                }
                //English
                else if (this.quizLanguage == 2) {
                    qtnPlaceHolder =
                        '<div class="entCreateQuizQtn" data-QtnId="' + (-(this.QtnIdcntr)) + '"> ' +
                        '<div class="fa fa-times-circle" style="color:coral;float:right;margin:1% 1%;cursor:pointer;z-index:100;" onclick="ENTQuiz.Manage.removeQuestion(this);"></div>' +
                        '   <div class="row" style="clear:both"> ' +
                        '       <div class="col-sm-12 _EN"> ' +
                        '           <div class="QtnLabel"> Question </div> ' +
                        '           <div> <input type="text" data-fieldType="QtnText_EN" /> </div> ' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="row" > ' +
                        '       <div class="col-sm-12 _EN"> ' +
                        '           <div class="QtnLabel"> Order </div> ' +
                        '           <div> <input type="text" data-fieldType="QtnOrder" value="' + this.QtnIdcntr + '"/> </div> ' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="row" > ' +
                        '       <div class="col-sm-12 _EN"> ' +
                        '           <div class="QtnLabel"> DataType </div> ' +
                        '           <div> ' +
                        '               <select data=fieldType="QtnDataType" onchange="ENTQuiz.Manage.renderSpecDetailsControl(' + (-(this.QtnIdcntr)) + ')" >' +
                        '               ' + ENTQuiz.Manage.getQuestionDataTypeOptions() +
                        '               </select>' +
                        '           </div> ' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="specsPlaceHolder" > ' +
                        '   </div>' +
                        '   <div class="validationSpecsPlaceHolder" > ' +
                        '   </div>' +
                        '</div>';

                }
                //Both
                else if (this.quizLanguage == 3) {
                    qtnPlaceHolder =
                        '<div class="entCreateQuizQtn" data-QtnId="' + (-(this.QtnIdcntr)) + '"> ' +
                        '<div class="fa fa-times-circle" style="color:coral;float:right;margin:1% 1%;cursor:pointer;z-index:100;" onclick="ENTQuiz.Manage.removeQuestion(this);"></div>' +
                        '   <div class="row" style="clear:both"> ' +
                        '       <div class="col-sm-6 _EN"> ' +
                        '           <div class="QtnLabel"> Question </div> ' +
                        '           <div> <input type="text" data-fieldType="QtnText_EN" /> </div> ' +
                        '       </div>' +
                        '       <div class="col-sm-6 _AR"> ' +
                        '           <div class="QtnLabel"> Question </div> ' +
                        '           <div> <input type="text" data-fieldType="QtnText_AR" /> </div> ' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="row" > ' +
                        '       <div class="col-sm-6 _EN"> </div>' +
                        '       <div class="col-sm-6 _AR"> ' +
                        '           <div class="QtnLabel"> Order </div> ' +
                        '           <div> <input type="text" data-fieldType="QtnOrder" value="' + this.QtnIdcntr + '"/> </div> ' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="row" > ' +
                        '       <div class="col-sm-6 _EN"> </div>' +
                        '       <div class="col-sm-6 _AR"> ' +
                        '           <div class="QtnLabel"> DataType </div> ' +
                        '           <div> ' +
                        '               <select data=fieldType="QtnDataType" onchange="ENTQuiz.Manage.renderSpecDetailsControl(' + (-(this.QtnIdcntr)) + ')" >' +
                        '               ' + ENTQuiz.Manage.getQuestionDataTypeOptions() +
                        '               </select>' +
                        '           </div> ' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="specsPlaceHolder" > ' +
                        '   </div>' +
                        '   <div class="validationSpecsPlaceHolder" > ' +
                        '   </div>' +
                        '</div>';

                }

                $(".entCreateQuizQtnsContainer").append(qtnPlaceHolder);
                $("#btnAddQuestion").blur();
                return false;
            },
            getQuestionDataTypeOptions: function () {
                return '' +
                    '<option value="0">-Select-</option>' +
                    '<option value="1">Text</option>' +
                    '<option value="2">MultiLineText</option>' +
                    '<option value="3">Date</option>' +
                    '<option value="4">Checkbox</option>' +
                    '<option value="5">DropDown</option>' +
                    '<option value="6">RadioButtons</option>' +
                    '<option value="7">MultiCheckboxes</option>' +
                    '<option value="8">RatingByNumbers</option>' +
                    '<option value="9">MatrixQuestion</option>' +
                    '<option value="10">Slider</option>' +
                    '<option value="11">FileAttachment</option>' +
                    '<option value="12">Ranking</option>' +
                    '<option value="13">Branching</option>' +
                    '<option value="14">5 - Emojis</option>' +
                    '<option value="15">Image choices</option>';
            },

            getQuestionDataTypeWithValue: function (o) {
                let modQtn = "data-QtnId='" + o.ID + "'";
                return '' +
                    '<select data-fieldType="QtnDataType" onchange="ENTQuiz.Manage.renderSpecDetailsControl(' + o.ID + ')" name="QtnDataType' + o.ID + '" >' +
                    '<option value="0">-Select-</option>' +
                    '<option value="1">Text</option>' +
                    '<option value="2">MultiLineText</option>' +
                    '<option value="3">Date</option>' +
                    '<option value="4">Checkbox</option>' +
                    '<option value="5">DropDown</option>' +
                    '<option value="6">RadioButtons</option>' +
                    '<option value="7">MultiCheckboxes</option>' +
                    '<option value="8">RatingByNumbers</option>' +
                    '<option value="9">MatrixQuestion</option>' +
                    '<option value="10">Slider</option>' +
                    '<option value="11">FileAttachment</option>' +
                    '<option value="12">Ranking</option>' +
                    '<option value="13">Branching</option>' +
                    '<option value="14">5 - Emojis</option>' +
                    '<option value="15">Image choices</option>' +
                    '</select>' +
                    '<script>' +
                    '   $("[' + modQtn + ']").find("["data-fieldType=\'QtnDataType\'"]").val("' + o.DataTypeID + '");' +
                    '   ENTQuiz.Manage.renderSpecDetailsControlWithValue(' + o.ID + ');' +
                    '</script>';
            },
            createQuiz: function (creationStatus) {
                let quiz = ENTQuiz.Manage.getQuizInfoFromForm(creationStatus);
                let apiPath_item = this.apiPath + '/createQuiz?absolutePath=' + location.pathname;
                if (this.isValidData) {
                    $.ajax({
                        type: 'POST',
                        url: apiPath_item,
                        data: quiz,
                        headers: {
                            Accept: "application/json;odata=verbose"
                        },
                        async: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data_items) {
                            alert("Quiz saved successfully");
                            window.location = "ManageQuizs.aspx";
                        },
                        error: function (errordata) {
                            console.log("Error while submitting response");
                            console.log(errordata);
                            if (errordata.responseJSON.ExceptionType == "System.UnauthorizedAccessException") {
                                $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! You do not have access to the requested resource <br /> Please contact IT Helpdesk if need access</div>")
                            }
                        }
                    });
                }
            },


            getQuizInfoFromForm: function (creationStatus) {
                let quiz = {
                    ID: 0,
                    Title: '',
                    Title_En: '',
                    Description: '',
                    Description_En: '',
                    RequestingDirectorate: 0,
                    AllowCancel: true,
                    AllowMultipleResponse: false,
                    Language: 0,
                    StartDate: new Date(),
                    EndDate: new Date(),

                    Questions: [],
                    //ImageFiles: [],

                    Status: 0,
                    MessageId: 0,
                    HasWelcomeMessage: false,
                    HasThankyouMessage: false,
                    HasHelpMessage: false,
                };

                ENTQuiz.Manage.isValidData = true;

                quiz.ID = parseInt($("#ent_modId").val());
                quiz.Title = $("#txtModTitle_AR").val();
                quiz.Title_En = $("#txtModTitle_EN").val();
                quiz.Description = $("#txtModDescription_AR").val();
                quiz.Description_En = $("#txtModDescription_EN").val();
                quiz.RequestingDirectorate = $("#ddlModDirectorate").val();
                quiz.Language = this.quizLanguage;
                quiz.DepartmentId = 0;
                quiz.StartDate = (new Date()).format("dd/MM/yyyy HH:mm:ss"); //TODO : remove if not used
                quiz.EndDate = (new Date()).format("dd/MM/yyyy HH:mm:ss"); //TODO : remove if not used

                quiz.MessageId = ($("#txtModMessageId").val() != "" ? parseInt($("#txtModMessageId").val()) : 0);
                quiz.AllowCancel = $("#chkModAllowCancel").is(":checked");
                quiz.AllowMultipleResponse = $("#chkModAllowMultipleResponse").is(":checked");
                quiz.HasWelcomeMessage = $("#chkModHasWelcomeMessage").is(":checked");
                quiz.HasThankyouMessage = $("#chkModHasThankyouMessage").is(":checked");


                $(".entCreateQuizQtn").each(function (idx, qtnItem) {
                    let qtnInfo = ENTQuiz.Manage.getQuestionInfoOf(qtnItem);
                    quiz.Questions.push(qtnInfo);
                });

                return quiz;

            },
            isValidData: true,
            getQuestionInfoOf: function (qtnItem) {
                let qtnID = 0;
                let qtnText = '';
                let qtnText_En = '';
                let qtnDataTypeID = 0;
                let qtnOrder = 0;
                let qtnSpecs = '';
                let qtnValidationSpecs = '';
                let qtnParentBranchID = 0;
                let qtnParentBranchValueID = 0;

                qtnID = parseInt($(qtnItem).data("qtnid"));

                if (this.quizLanguage == 1) {
                    qtnText = $(qtnItem).find('[data-fieldType="QtnText_AR"]').val();
                }
                else if (this.quizLanguage == 1) {
                    qtnText_En = $(qtnItem).find('[data-fieldType="QtnText_EN"]').val();
                }
                else if (this.quizLanguage == 3) {
                    qtnText = $(qtnItem).find('[data-fieldType="QtnText_AR"]').val();
                    qtnText_En = $(qtnItem).find('[data-fieldType="QtnText_EN"]').val();
                }
                qtnDataTypeID = parseInt($(qtnItem).find('[data-fieldType="QtnDataType"]').val());
                qtnOrder = parseInt($(qtnItem).find('[data-fieldType="QtnOrder"]').val());

                qtnSpecs = ENTQuiz.Manage.getSpecsInfoOf(qtnItem);
                qtnValidationSpecs = ENTQuiz.Manage.getValidationSpecsInfoOf(qtnItem);
                return {
                    ID: qtnID,
                    Question: qtnText,
                    Question_En: qtnText_En,
                    DataTypeID: qtnDataTypeID,
                    Specs: qtnSpecs,
                    ValidationSpecs: qtnValidationSpecs,
                    Order: qtnOrder,
                    ParentBranchID: qtnParentBranchID,
                    ParentBranchValueID: qtnParentBranchValueID,
                };
            },
            getSpecsInfoOf: function (qtnItem) {
                let specsPlaceHolder = $(qtnItem).find(".specsPlaceHolder");
                let QtnDataTypeValue = parseInt($(qtnItem).find('[data-fieldType="QtnDataType"]').val());
                let strSpecs = '';

                if (QtnDataTypeValue == 5 || //Dropdown
                    QtnDataTypeValue == 6 || //RadioButtons
                    QtnDataTypeValue == 7 || //MultiCheckboxes
                    QtnDataTypeValue == 12 || //Ranking
                    QtnDataTypeValue == 13)  //Branching
                {
                    if (this.quizLanguage == 1) {
                        let qtnOptions_AR = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_AR"]').val().split('\n').filter(str => str);
                        if (qtnOptions_AR != undefined && qtnOptions_AR.length > 0) {
                            strSpecs += '"ar":' + JSON.stringify(qtnOptions_AR, null);
                        } else {
                            this.isValidData = false;
                            console.log("Options Missing");
                            alert("Options Missing");
                        }
                    }
                    else if (this.quizLanguage == 2) {
                        let qtnOptions_EN = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_EN"]').val().split('\n').filter(str => str);
                        if (qtnOptions_EN != undefined && qtnOptions_EN.length > 0) {
                            strSpecs += '"en":' + JSON.stringify(qtnOptions_EN, null);
                        } else {
                            this.isValidData = false;
                            console.log("Options Missing");
                            alert("Options Missing");
                        }
                    }
                    else if (this.quizLanguage == 3) {
                        let qtnOptions_AR = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_AR"]').val().split('\n').filter(str => str);
                        let qtnOptions_EN = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_EN"]').val().split('\n').filter(str => str);
                        if (qtnOptions_AR != undefined && qtnOptions_AR.length > 0 &&
                            qtnOptions_EN != undefined && qtnOptions_EN.length > 0 &&
                            qtnOptions_AR.length == qtnOptions_EN.length) {
                            strSpecs += '"ar":' + JSON.stringify(qtnOptions_AR, null);
                            strSpecs += ',';
                            strSpecs += '"en":' + JSON.stringify(qtnOptions_EN, null);
                        } else {
                            this.isValidData = false;
                            console.log("Options Missing / Number of options not matching in both languages");
                            alert("Options Missing / Number of options not matching in both languages");

                        }
                    }
                }
                else if (QtnDataTypeValue == 8 || //RatingByNumbers
                    QtnDataTypeValue == 10)  //Slider
                {
                    let qtnMinRankCtl = $(specsPlaceHolder).find('[data-fieldtype="QtnMinRank"]');
                    let qtnMaxRankCtl = $(specsPlaceHolder).find('[data-fieldtype="QtnMaxRank"]');
                    let qtnStepRankCtl = $(specsPlaceHolder).find('[data-fieldtype="QtnStepRank"]');

                    if (qtnStepRankCtl != undefined && qtnStepRankCtl.length > 0 &&
                        qtnMinRankCtl != undefined && qtnMinRankCtl.length > 0 &&
                        qtnMaxRankCtl != undefined && qtnMaxRankCtl.length > 0) {
                        try {
                            strSpecs += '"min":' + parseInt($(qtnMinRankCtl).val()) + ',' +
                                '"max":' + parseInt($(qtnMaxRankCtl).val()) + ',' +
                                '"step":' + parseInt($(qtnStepRankCtl).val());
                        }
                        catch (ex) {
                            this.isValidData = false;
                            console.log("Min/Max Values missing");
                            alert("Min/Max Values missing");

                        }
                    }
                    else {
                        this.isValidData = false;
                        console.log("Min/Max Values missing");
                        alert("Min/Max Values missing");

                    }
                }
                //MatrixQuestion
                else if (QtnDataTypeValue == 9) {
                    if (this.quizLanguage == 1) {
                        let qtnMatrixCols_AR = $(specsPlaceHolder).find('[data-fieldType="QtnMatrixCols_AR"]').val().split('\n').filter(str => str);

                        if (qtnMatrixCols_AR != undefined && qtnMatrixCols_AR.length > 0) {
                            strSpecs += '"Cols":{"ar":' + JSON.stringify(qtnMatrixCols_AR, null) + '},';
                        } else {
                            this.isValidData = false;
                            console.log("Columns info missing");
                            alert("Columns info missing");
                        }
                        let qtnMatrixRows_AR = $(specsPlaceHolder).find('[data-fieldType="QtnMatrixRows_AR"]').val().split('\n').filter(str => str);

                        if (qtnMatrixRows_AR != undefined && qtnMatrixRows_AR.length > 0) {
                            strSpecs += '"Rows":{"ar":' + JSON.stringify(qtnMatrixRows_AR, null) + '},';
                        } else {
                            this.isValidData = false;
                            console.log("Rows info missing");
                            alert("Rows info missing");
                        }
                    }
                    else if (this.quizLanguage == 2) {
                        let qtnMatrixCols_EN = $(specsPlaceHolder).find('[data-fieldType="QtnMatrixCols_EN"]').val().split('\n').filter(str => str);

                        if (qtnMatrixCols_EN != undefined && qtnMatrixCols_EN.length > 0) {
                            strSpecs += '"Cols":{"en":' + JSON.stringify(qtnMatrixCols_EN, null) + '},';
                        } else {
                            this.isValidData = false;
                            console.log("Columns info missing");
                            alert("Columns info missing");
                        }
                        let qtnMatrixRows_EN = $(specsPlaceHolder).find('[data-fieldType="QtnMatrixRows_EN"]').val().split('\n').filter(str => str);

                        if (qtnMatrixRows_EN != undefined && qtnMatrixRows_EN.length > 0) {
                            strSpecs += '"Rows":{"en":' + JSON.stringify(qtnMatrixRows_EN, null) + '},';
                        } else {
                            this.isValidData = false;
                            console.log("Rows info missing");
                            alert("Rows info missing");
                        }
                    }
                    else if (this.quizLanguage == 3) {
                        let qtnMatrixCols_AR = $(specsPlaceHolder).find('[data-fieldType="QtnMatrixCols_AR"]').val().split('\n').filter(str => str);
                        let qtnMatrixCols_EN = $(specsPlaceHolder).find('[data-fieldType="QtnMatrixCols_EN"]').val().split('\n').filter(str => str);

                        if (qtnMatrixCols_AR != undefined && qtnMatrixCols_AR.length > 0 &&
                            qtnMatrixCols_EN != undefined && qtnMatrixCols_EN.length > 0 &&
                            qtnMatrixCols_AR.length == qtnMatrixCols_EN.length) {
                            strSpecs += '"Cols":{' +
                                '"ar":' + JSON.stringify(qtnMatrixCols_AR, null) +
                                ',"en":' + JSON.stringify(qtnMatrixCols_EN, null) +
                                '},';
                        } else {
                            this.isValidData = false;
                            console.log("Columns info missing / Number of Matrix columns not matching in both languages");
                            alert("Columns info missing / Number of Matrix columns not matching in both languages");

                        }
                        let qtnMatrixRows_AR = $(specsPlaceHolder).find('[data-fieldType="QtnMatrixRows_AR"]').val().split('\n').filter(str => str);
                        let qtnMatrixRows_EN = $(specsPlaceHolder).find('[data-fieldType="QtnMatrixRows_EN"]').val().split('\n').filter(str => str);

                        if (qtnMatrixRows_AR != undefined && qtnMatrixRows_AR.length > 0 &&
                            qtnMatrixRows_EN != undefined && qtnMatrixRows_EN.length > 0 &&
                            qtnMatrixRows_AR.length == qtnMatrixRows_EN.length) {
                            strSpecs += '"Rows":{' +
                                '"ar":' + JSON.stringify(qtnMatrixRows_AR, null) +
                                ',"en":' + JSON.stringify(qtnMatrixRows_EN, null) +
                                '},';
                        } else {
                            this.isValidData = false;
                            console.log("Rows info missing / Number of Matrix rows not matching in both languages");
                            alert("Rows info missing / Number of Matrix rows not matching in both languages");

                        }
                    }
                }
                //Imagechoices
                else if (QtnDataTypeValue == 15) {
                    let qtnImageSizeCtl = $(specsPlaceHolder).find('[data-fieldtype="QtnImageSize"]');
                    if (qtnImageSizeCtl != undefined && qtnImageSizeCtl.length > 0) {
                        try {
                            strSpecs += '"size":' + parseInt($(qtnImageSizeCtl).val());
                        }
                        catch (ex) {
                            this.isValidData = false;
                            console.log("Image size Value missing");
                            alert("Image size Value missing");
                        }
                    } else {
                        this.isValidData = false;
                        console.log("Image size Value missing");
                        alert("Image size Value missing");
                    }
                }

                return '{' + strSpecs + '}';
            },

            getValidationSpecsInfoOf: function (qtnItem) {
                let validationSpecsPlaceHolder = $(qtnItem).find(".validationSpecsPlaceHolder");
                let QtnDataTypeValue = parseInt($(qtnItem).find('[data-fieldType="QtnDataType"]').val());
                let strValidationSpecs = '"isRequired":false';

                //if not checkbox and Slider and Ranking
                if (QtnDataTypeValue != 10) {
                    let qtnIsRequiredCtl = $(validationSpecsPlaceHolder).find('[data-fieldtype="QtnIsRequired"]');
                    if (qtnIsRequiredCtl != undefined && qtnIsRequiredCtl.length > 0) {
                        strValidationSpecs = '"isRequired":' + $(qtnIsRequiredCtl).is(":checked");
                    }
                }

                if (QtnDataTypeValue == 1 || //Text
                    QtnDataTypeValue == 2)//MultiLineText
                {
                    let qtnMaxchars = $(validationSpecsPlaceHolder).find('[data-fieldtype="QtnMaxChars"]');
                    if (qtnMaxchars != undefined && qtnMaxchars.length > 0) {
                        strValidationSpecs = ',"maxChars":' + ($(qtnMaxchars).val() != '' ? $(qtnMaxchars).val() : 2000);
                    }
                    else {
                        this.isValidData = false;
                        console.log("Max chars missing");
                        alert("Max chars missing");
                    }

                }
                //Date
                else if (QtnDataTypeValue == 3) //MultiLineText
                {
                    let QtnId_MinDateOption = $(validationSpecsPlaceHolder).find('[data-fieldtype="QtnMinDate"]:checked').val();
                    let QtnId_MaxDateOption = $(validationSpecsPlaceHolder).find('[data-fieldtype="QtnMaxDate"]:checked').val();

                    if (QtnId_MinDateOption != undefined) {
                        if (QtnId_MinDateOption == 0)
                            strValidationSpecs = ',"min":""';
                        else if (QtnId_MinDateOption == 1)
                            strValidationSpecs = ',"min":"Today"';
                        else if (QtnId_MinDateOption == 2) {
                            strValidationSpecs = ',"min":"' + $(validationSpecsPlaceHolder).find('[data-fieldtype="QtnId_MinDateValue"]').val() + '"';
                        }
                    }
                    else {
                        this.isValidData = false;
                        console.log("Min date validation missing");
                    }

                    if (QtnId_MaxDateOption != undefined) {
                        if (QtnId_MaxDateOption == 0)
                            strValidationSpecs = ',"max":""';
                        else if (QtnId_MaxDateOption == 1)
                            strValidationSpecs = ',"max":"Today"';
                        else if (QtnId_MaxDateOption == 2) {
                            strValidationSpecs = ',"max":"' + $(validationSpecsPlaceHolder).find('[data-fieldtype="QtnId_MaxDateValue"]').val() + '"';
                        }
                    }
                    else {
                        this.isValidData = false;
                        console.log("Max date validation missing");
                    }

                }

                return '{' + strValidationSpecs + '}';

            },

            cancelQuiz: function () {
                window.location = 'Managequizs.aspx';
            }



        };
    })();


$(function () {

    let inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
    if (inDesignMode == "1") {
        $(".entQuizContainer").hide();
    }
    else {
        $(".entQuizContainer").show();
        $(".entQuizLanguage").show();
        ENTQuiz.Manage.apiPath = ENTQuiz.Common.webapiBaseUrl + '/Quiz';
        ENTQuiz.Manage.initializePage();

    }

    $(':input').on('focus', function () {
        $(this).attr('autocomplete', 'off');

    });
});