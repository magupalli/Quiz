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
                let optDirectorates = ENTQuiz.Common.Directorates.map(function (o, idx) {
                    return '<option value=' + idx + '>' + o + '</option>';
                }).join('');

                return '<select id="ddlModDirectorate">' +
                    optDirectorates +
                    '       </select>' +
                    '       <script>$("#ddlModDirectorate").val("' + this.quiz.RequestingDirectorate + '")</script>';
            },
            getClassificationListControlWithValue: function () {
                let optClassifications = ENTQuiz.Common.Classifications.map(function (o, idx) {
                    return '<option value=' + idx + '>' + o + '</option>';
                }).join('');

                return '<select id="ddlModClassification">' +
                    optClassifications +
                    '       </select>' +
                    '       <script>$("#ddlModClassification").val("' + this.quiz.Classification + '")</script>';
            },
            renderQuizCreator: function () {

                if (this.quiz != undefined) {
                    let quizId = this.quiz.ID;
                    $("#ent_modId").val(quizId);
                    let htmlQuizHeader = '';
                    if (this.quizLanguage == 1) {
                        htmlQuizHeader =
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModTitle _AR">' +
                            '       <div class="QtnLabel"> Title </div>' +
                            '       <div > <input type="text" id="txtModTitle_AR" value="' + this.quiz.Title + '"/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDescription _AR">' +
                            '       <div class="QtnLabel"> Description </div>' +
                            '       <div > <textarea  id="txtModDescription_AR" >' + this.quiz.Description + '</textarea></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Directorate </div>' +
                            '       <div > ' + ENTQuiz.Manage.getDirectorateListControlWithValue() + '</div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModClassification _AR">' +
                            '       <div class="QtnLabel"> Classification </div>' +
                            '       <div > ' + ENTQuiz.Manage.getClassificationListControlWithValue() + '</div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Passing Score </div>' +
                            '       <div> <input value="' + (this.quiz.PassScore) + '" class="entModQtnCtl" type="number" id="txtPassScore" min="1" placeholder="Pass Score" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Show Response after submission </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModAllowViewResponse" ' + (this.quiz.AllowViewResponse ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Show Answers after submission </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModAllowViewAnswers" ' + (this.quiz.AllowViewAnswers ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Enable Random Order Questions </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkRandomOrderQuestions" ' + (this.quiz.RandomOrderQuestions ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Has Welcome Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasWelcomeMessage" ' + (this.quiz.HasWelcomeMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Has Thankyou Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasThankyouMessage" ' + (this.quiz.HasThankyouMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Message ID </div>' +
                            '       <div> <input id="txtModMessageId" value="' + (this.quiz.MessageId) + '" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="validationErrorPlaceHolderMain validationErrorPlaceHolder"> </div>' +
                            '   </div>' +
                            '</div>' +
                            '';
                    }
                    else if (this.quizLanguage == 2) {
                        htmlQuizHeader =
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModTitle _EN">' +
                            '       <div class="QtnLabel"> Title </div>' +
                            '       <div > <input type="text" id="txtModTitle_EN" value="' + this.quiz.Title_En + '"/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDescription _EN">' +
                            '       <div class="QtnLabel"> Description </div>' +
                            '       <div > <textarea  id="txtModDescription_EN" >' + this.quiz.Description_En + '</textarea></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN">' +
                            '       <div class="QtnLabel"> Directorate </div>' +
                            '       <div > ' + ENTQuiz.Manage.getDirectorateListControlWithValue() + '</div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModClassification _EN">' +
                            '       <div class="QtnLabel"> Classification </div>' +
                            '       <div > ' + ENTQuiz.Manage.getClassificationListControlWithValue() + '</div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN">' +
                            '       <div class="QtnLabel"> Passing Score </div>' +
                            '       <div> <input value="' + (this.quiz.PassScore) + '" class="entModQtnCtl" type="number" id="txtPassScore" min="1" placeholder="Pass Score" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN">' +
                            '       <div class="QtnLabel"> Show Response after submission </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModAllowViewResponse" ' + (this.quiz.AllowViewResponse ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN">' +
                            '       <div class="QtnLabel"> Show Answers after submission </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModAllowViewAnswers" ' + (this.quiz.AllowViewAnswers ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN">' +
                            '       <div class="QtnLabel"> Enable Random Order Questions </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkRandomOrderQuestions" ' + (this.quiz.RandomOrderQuestions ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN">' +
                            '       <div class="QtnLabel"> Has Welcome Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasWelcomeMessage" ' + (this.quiz.HasWelcomeMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN">' +
                            '       <div class="QtnLabel"> Has Thankyou Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasThankyouMessage" ' + (this.quiz.HasThankyouMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _EN">' +
                            '       <div class="QtnLabel"> Message ID </div>' +
                            '       <div> <input id="txtModMessageId" value="' + (this.quiz.MessageId) + '" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="validationErrorPlaceHolderMain validationErrorPlaceHolder"> </div>' +
                            '   </div>' +
                            '</div>' +
                            '';
                    }
                    else if (this.quizLanguage == 3) {
                        htmlQuizHeader =
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModTitle _EN">' +
                            '       <div class="QtnLabel"> Title </div>' +
                            '       <div > <input type="text" id="txtModTitle_EN" value="' + this.quiz.Title_En + '"/></div>' +
                            '   </div>' +
                            '   <div class="col-sm-6 entModTitle _AR">' +
                            '       <div class="QtnLabel"> Title </div>' +
                            '       <div > <input type="text" id="txtModTitle_AR" value="' + this.quiz.Title + '"/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDescription _EN">' +
                            '       <div class="QtnLabel"> Description </div>' +
                            '       <div > <textarea  id="txtModDescription_EN" >' + this.quiz.Description_En + '</textarea></div>' +
                            '   </div>' +
                            '   <div class="col-sm-6 entModDescription _AR">' +
                            '       <div class="QtnLabel"> Description </div>' +
                            '       <div > <textarea  id="txtModDescription_AR" >' + this.quiz.Description + '</textarea></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN"></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Directorate </div>' +
                            '       <div > ' + ENTQuiz.Manage.getDirectorateListControlWithValue() + '</div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN"></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Classification </div>' +
                            '       <div > ' + ENTQuiz.Manage.getClassificationListControlWithValue() + '</div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN"></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Passing Score </div>' +
                            '       <div> <input value="' + (this.quiz.PassScore) + '" class="entModQtnCtl" type="number" id="txtPassScore" min="1" placeholder="Pass Score" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN"></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Show Response after submission </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModAllowViewResponse" ' + (this.quiz.AllowViewResponse ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN"></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Show Answers after submission </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModAllowViewAnswers" ' + (this.quiz.AllowViewAnswers ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN"></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Enable Random Order Questions </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkRandomOrderQuestions" ' + (this.quiz.RandomOrderQuestions ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN"></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Has Welcome Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasWelcomeMessage" ' + (this.quiz.HasWelcomeMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN"></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Has Thankyou Message </div>' +
                            '       <div> <input class="entModQtnCtl" type="checkbox" id="chkModHasThankyouMessage" ' + (this.quiz.HasThankyouMessage ? ' checked="true" ' : '') + '/></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-6 entModDirectorate _EN"></div>' +
                            '   <div class="col-sm-6 entModDirectorate _AR">' +
                            '       <div class="QtnLabel"> Message ID </div>' +
                            '       <div> <input id="txtModMessageId" value="' + (this.quiz.MessageId) + '" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="row">' +
                            '   <div class="col-sm-12 entModDirectorate _AR">' +
                            '       <div class="validationErrorPlaceHolderMain validationErrorPlaceHolder"> </div>' +
                            '   </div>' +
                            '</div>' +
                            '';
                    }
                    $(".entCreateQuizHeaderContainer").html(htmlQuizHeader);

                    if (this.quiz.Questions != undefined && this.quiz.Questions.length > 0) {

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
                                    '           <div><input type="text" data-fieldtType="QtnOrder" value="' + o.Order + '"/></div>' +
                                    '       </div>' +
                                    '   </div>' +
                                    '   <div class="row">' +
                                    '       <div class="col-sm-12 _AR">' +
                                    '           <div class="QtnLabel"> DataType: </div>' +
                                    '           <div>' +
                                    '               ' + ENTQuiz.Manage.getQuestionDataTypeWithValue(o);
                                '               </div>' +
                                    '       </div>' +
                                    '   </div>' +
                                    '   <div class="specsPlaceHolder"></div>' +
                                    '   <div class="answerSpecsPlaceHolder"></div>' +
                                    '   <div class="validationSpecsPlaceHolder"></div>' +
                                    '   <div class="validationErrorPlaceHolder _AR"></div>' +
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
                                    '           <div><input type="text" data-fieldtType="QtnOrder" value="' + o.Order + '"/></div>' +
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
                                    '   <div class="answerSpecsPlaceHolder"></div>' +
                                    '   <div class="validationSpecsPlaceHolder"></div>' +
                                    '   <div class="validationErrorPlaceHolder _AR"></div>' +
                                    '</div>';
                            }
                            else if (ENTQuiz.Manage.quizLanguage == 3) {
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
                                    '           <div><input type="text" data-fieldtType="QtnOrder" value="' + o.Order + '"/></div>' +
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
                                    '   <div class="answerSpecsPlaceHolder"></div>' +
                                    '   <div class="validationSpecsPlaceHolder"></div>' +
                                    '   <div class="validationErrorPlaceHolder _AR"></div>' +
                                    '</div>';
                            }
                            return qtnPlaceHolder;
                        }).join('');
                        $(".entCreateQuizQtnsContainer").html(htmlQuizQuestions);
                        this.QtnIdcntr = this.quiz.Questions[this.quiz.Questions.length - 1].Order;
                    }
                    $(".entCreateQuizContainer").show();
                }
            },
            apiPath: "",
            initializePage: function () {
                this.fetched = false;
                if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    let apiPath_item = this.apiPath + '/getQuiz_Edit?quizId=' + quizId + '&absolutePath=' + location.pathname;

                    this.getQuizFromDB(apiPath_item);
                }
                else {
                    console.log("Quiz not selected ");
                    if (ENTQuiz.Common.getUrlParams("quizId") == undefined)
                        $(".entQuizContainer").html("<div class='ErrorDiv'>Quiz not selected <br/> For additional info, please contact IT helpdesk </div>");

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
                ENTQuiz.Manage.renderAnswerSpecsControlWithValue(o[0]);
                //ENTQuiz.Manage.renderValidationSpecsControlWithValue(o[0]);
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
                        1 - RadioButtons
                        2 - Images
                        3 - Date
                        4 - Dropdown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                    */
                    //Dropdown Options //$('[data-fieldtype="QtnOptions_AR"]').val().split('\n').filter(str=>str)
                    if (QtnDataTypeValue == 4 || //DropDown
                        QtnDataTypeValue == 1 || //RadioButtons
                        QtnDataTypeValue == 5) //MultiCheckboxes
                    {
                        //Arabic
                        if (this.quizLanguage == 1) {
                            let htmlChoices = '';
                            $(QtnSpecs.ar).map(function (idx, choice) {
                                htmlChoices += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
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
                                '   <div class="col-sm-12 _EN">' +
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
                                '   <div class="col-sm-6" _EN">' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_EN" rows="5">' + htmlChoices_en + '</textarea></div>' +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_AR" rows="5">' + htmlChoices_ar + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }

                    }
                    //ImageChoices
                    else if (QtnDataTypeValue == 2) {
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

                    //Ranking
                    else if (QtnDataTypeValue == 6) //Ranking
                    {
                        //Arabic
                        if (this.quizLanguage == 1) {
                            let htmlChoices = '';
                            $(QtnSpecs.ar).map(function (idx, choice) {
                                htmlChoices += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            let ctlHTML_AR = '<div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_AR" rows="5" onkeyup="SIAQuiz.Manage.renderRankingAnswerSpecsControl(' + o.ID + ')">' + htmlChoices + '</textarea></div>';

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            let htmlChoices = '';
                            $(QtnSpecs.en).map(function (idx, choice) {
                                htmlChoices += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            let ctlHTML_EN = '<div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_EN" rows="5" onkeyup="SIAQuiz.Manage.renderRankingAnswerSpecsControl(' + o.ID + ')">' + htmlChoices + '</textarea></div>';

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                ctlHTML_EN +
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
                            let ctlHTML_AR = '<div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_AR" rows="5" onkeyup="SIAQuiz.Manage.renderRankingAnswerSpecsControl(' + o.ID + ')">' + htmlChoices + '</textarea></div>';
                            let ctlHTML_EN = '<div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_EN" rows="5" onkeyup="SIAQuiz.Manage.renderRankingAnswerSpecsControl(' + o.ID + ')">' + htmlChoices + '</textarea></div>';

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN">' +
                                ctlHTML_EN +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
                                ctlHTML_AR +
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
                        1 - RadioButtons
                        2 - Images
                        3 - Date
                        4 - Dropdown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                    */
                    //if not Radiobutton and Dropdown
                    if (QtnDataTypeValue != 0 && QtnDataTypeValue != 4) {
                        specsControls += this.renderValidationControlWithValue(1, o); //IsRequired
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
                }

                return "";
            },


            renderAnswerSpecsControlWithValue: function (o) {
                let specsControls = '';
                let entCreateQuizQtn = $('[data-QtnId="' + (o.ID) + '"]');
                if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                    let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                    let specsPlaceHolder = $(entCreateQuizQtn).find(".answerSpecsPlaceHolder");
                    let QtnDataTypeValue = parseInt($(QtnDataType).val());
                    //let QtnSpecs = $.parseJSON(o.Specs);
                    let QtnAnswer = '';
                    if (o.Answer != '')
                        QtnAnswer = $.parseJSON(o.Answer);
                    /*
                        1 - RadioButtons
                        2 - Images
                        3 - Date
                        4 - Dropdown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                    */
                    //Dropdown Options //$('[data-fieldtype="QtnOptions_AR"]').val().split('\n').filter(str=>str)
                    //RadioButtons  //Dropdown
                    if (QtnDataTypeValue == 4 || //DropDown
                        QtnDataTypeValue == 1) //RadioButtons
                    {
                        //Arabic
                        if (this.quizLanguage == 1) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <input type="text" data-fieldType="QtnAnswer_AR" value="' + (QtnAnswer != undefined && QtnAnswer != "" ? QtnAnswer.ar : "") + '" /></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <input type="text" data-fieldType="QtnAnswer_EN" value="' + (QtnAnswer != undefined && QtnAnswer != "" ? QtnAnswer.en : "") + '" /></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <input type="text" data-fieldType="QtnAnswer_EN" value="' + (QtnAnswer != undefined && QtnAnswer != "" ? QtnAnswer.en : "") + '" /></div>' +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <input type="text" data-fieldType="QtnAnswer_AR" value="' + (QtnAnswer != undefined && QtnAnswer != "" ? QtnAnswer.ar : "") + '" /></div>' +
                                '   </div>' +
                                '</div>';
                        }

                    }
                    //ImageChoices
                    else if (QtnDataTypeValue == 2) {
                        let selected = " selected='selected' ";
                        let imagesCount = o.ImagesCount;
                        let ctlHTML_AR = '';
                        let ctlHTML_EN = '';

                        if (imagesCount != undefined && imagesCount > 0) {
                            let ddlAnswerChoices = '';
                            ddlAnswerChoices = '<option value="0">-Select-</option>';
                            for (let imgCntr = 0; imgCntr < imagesCount; imgCntr++) {
                                ddlAnswerChoices += '<option value="' + (imgCntr + 1) + '" ' + (parseInt(QtnAnswer.ans) == (imgCntr + 1) ? selected : '') + '>' + (imgCntr + 1) + '</option>';
                            }
                            ddlAnswerChoices = '<select data-fieldType="QtnAnswer">' + ddlAnswerChoices + '</select>';
                            ctlHTML_AR = '<div style="float:right;"><span class="QtnLabel">Answer: </span>' + ddlAnswerChoices + '</div>';
                            ctlHTML_EN = '<div style="float:left;"><span class="QtnLabel">Answer: </span>' + ddlAnswerChoices + '</div>';
                        }
                        else {
                            ctlHTML_AR = '<div style="float:right"><div style="color:#coral;background-color:yellow;padding:10px;">Pending Images Upload</div><div><button class="quizBtnStyle" onclick="SIAQuiz.Manage.AddImageFiles();return false;">Add Image Files</button></div></div>';
                            ctlHTML_EN = '<div style="float:left"><div style="color:#coral;background-color:yellow;padding:10px;">Pending Images Upload</div><div><button class="quizBtnStyle" onclick="SIAQuiz.Manage.AddImageFiles();return false;">Add Image Files</button></div></div>';
                        }

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

                    //Date
                    else if (QtnDataTypeValue == 3) //Date
                    {
                        let ctlHTML = '<div class="QtnLabel"> Answer : </div>' +
                            '       <div > <input type="date" data-fieldType="QtnAnswer" value="' + QtnAnswer.ans + '" /></div>';

                        //Arabic
                        if (this.quizLanguage == 1) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                ctlHTML +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                ctlHTML +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN">' +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
                                ctlHTML +
                                '   </div>' +
                                '</div>';
                        }

                    }
                    //MultiCheckBoxes
                    if (QtnDataTypeValue == 5) {
                        //Arabic
                        if (this.quizLanguage == 1) {
                            let htmlChoices = '';
                            $(QtnAnswer.ar).map(function (idx, choice) {
                                htmlChoices += ((idx > 0) ? '\r\n' : '') + choice;
                            });

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <textarea data-fieldType="QtnAnswer_AR"  rows="5" >' + htmlChoices + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            let htmlChoices = '';
                            $(QtnAnswer.en).map(function (idx, choice) {
                                htmlChoices += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <textarea data-fieldType="QtnAnswer_EN"  rows="5" >' + htmlChoices + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {
                            let htmlChoices_ar = '';
                            $(QtnAnswer.en).map(function (idx, choice) {
                                htmlChoices_ar += ((idx > 0) ? '\r\n' : '') + choice;
                            });
                            let htmlChoices_en = '';
                            $(QtnAnswer.en).map(function (idx, choice) {
                                htmlChoices_en += ((idx > 0) ? '\r\n' : '') + choice;
                            });

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <textarea data-fieldType="QtnAnswer_EN"  rows="5" >' + htmlChoices + '</textarea></div>' +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <textarea data-fieldType="QtnAnswer_AR"  rows="5" >' + htmlChoices + '</textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }

                    }

                    //Ranking
                    else if (QtnDataTypeValue == 6) //Ranking
                    {
                        let optionSpecsPlaceHolder = $(siaCreateQuizQtn).find(".specsPlaceHolder");
                        let qtnAnswer_Ranks = QtnAnswer.ans;
                        //Arabic
                        if (this.quizLanguage == 1) {

                            let qtnOptions_AR = $(optionSpecsPlaceHolder).find('[data-fieldType="QtnOptions_AR"]').val().split('\n').filter(str => str);

                            if (qtnOptions_AR != undefined && qtnOptions_AR.length > 0) {
                                specsControls +=
                                    '<div class="row">' +
                                    '   <div class="col-sm-12 _AR">' +
                                    '       <div class="QtnLabel">Answer : </div>';
                                for (let i = 0; i < qtnOptions_AR.length; i++) {
                                    specsControls +=
                                        '           <div class="row">' +
                                        '               <div class="col-sm-12 _AR">' +
                                        '                   <span><input type="text" data-fieldType="QtnAnswer_AR_Value_' + i + '" value="' + qtnOptions_AR[i] + '" readonly></span>' +
                                        '                   <select data-fieldType="QtnAnswer_AR_Rank_' + i + '" class="QtnAnswerRank">';
                                    for (let j = 0; j < qtnOptions_AR.length; j++) {
                                        specsControls += '   <option value="' + (j + 1) + '"  ' + ((parseInt(qtnAnswer_Ranks[i]) - 1) == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                                    }

                                    specsControls += '</select>' +
                                        '   </div>' +
                                        '</div>';

                                }
                                specsControls +=
                                    '   </div>' +
                                    '</div>';
                            }
                        }
                        //English
                        else if (this.quizLanguage == 2) {

                            let qtnOptions_EN = $(optionSpecsPlaceHolder).find('[data-fieldType="QtnOptions_EN"]').val().split('\n').filter(str => str);

                            if (qtnOptions_EN != undefined && qtnOptions_EN.length > 0) {
                                specsControls +=
                                    '<div class="row">' +
                                    '   <div class="col-sm-12 _EN">' +
                                    '       <div class="QtnLabel">Answer : </div>';
                                for (let i = 0; i < qtnOptions_EN.length; i++) {
                                    specsControls +=
                                        '           <div class="row">' +
                                        '               <div class="col-sm-12 _EN">' +
                                        '                   <span><input type="text" data-fieldType="QtnAnswer_EN_Value_' + i + '" value="' + qtnOptions_EN[i] + '" readonly></span>' +
                                        '                   <select data-fieldType="QtnAnswer_EN_Rank_' + i + '" class="QtnAnswerRank">';
                                    for (let j = 0; j < qtnOptions_EN.length; j++) {
                                        specsControls += '   <option value="' + (j + 1) + '"  ' + ((parseInt(qtnAnswer_Ranks[i]) - 1) == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                                    }

                                    specsControls += '</select>' +
                                        '   </div>' +
                                        '</div>';

                                }
                                specsControls +=
                                    '   </div>' +
                                    '</div>';
                            }
                        }
                        //Both
                        else if (this.quizLanguage == 3) {
                            let qtnOptions_AR = $(optionSpecsPlaceHolder).find('[data-fieldType="QtnOptions_AR"]').val().split('\n').filter(str => str);
                            let qtnOptions_EN = $(optionSpecsPlaceHolder).find('[data-fieldType="QtnOptions_EN"]').val().split('\n').filter(str => str);

                            if (qtnOptions_AR != undefined && qtnOptions_AR.length > 0 &&
                                qtnOptions_EN != undefined && qtnOptions_EN.length > 0) {
                                specsControls +=
                                    '<div class="row">' +
                                    '   <div class="col-sm-6 _EN">' +
                                    '       <div class="QtnLabel">Answer : </div>';
                                for (let i = 0; i < qtnOptions_EN.length; i++) {
                                    specsControls +=
                                        '           <div class="row">' +
                                        '               <div class="col-sm-12 _EN">' +
                                        '                   <span><input type="text" data-fieldType="QtnAnswer_EN_Value_' + i + '" value="' + qtnOptions_EN[i] + '" readonly></span>' +

                                        '               </div>' +
                                        '           </div>';

                                }


                                specsControls +=
                                    '  </div>' +
                                    '  <div class="col-sm-6 _AR">' +
                                    '       <div class="QtnLabel">Answer : </div>';
                                for (let i = 0; i < qtnOptions_AR.length; i++) {
                                    specsControls +=
                                        '           <div class="row">' +
                                        '               <div class="col-sm-12 _AR">' +
                                        '                   <span><input type="text" data-fieldType="QtnAnswer_AR_Value_' + i + '" value="' + qtnOptions_AR[i] + '" readonly></span>' +
                                        '                   <select data-fieldType="QtnAnswer_AR_Rank_' + i + '" class="QtnAnswerRank">';
                                    for (let j = 0; j < qtnOptions_AR.length; j++) {
                                        specsControls += '   <option value="' + (j + 1) + '"  ' + ((parseInt(qtnAnswer_Ranks[i]) - 1) == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                                    }

                                    specsControls += '      </select>' +
                                        '               </div>' +
                                        '           </div>';

                                }
                                specsControls +=
                                    '  </div>' +
                                    '</div>';

                            }
                        }
                    }

                    $(specsPlaceHolder).html(specsControls);
                }
            },

            renderSpecDetailsControl: function (QtnIdcntr) {
                ENTQuiz.Manage.renderSpecsControl(QtnIdcntr);
                //ENTQuiz.Manage.renderValidationSpecsControl(QtnIdcntr);
                ENTQuiz.Manage.renderAnswerSpecsControl(QtnIdcntr);
            },

            renderSpecsControlWithValue: function (o) {
                let specsControls = '';
                let entCreateQuizQtn = $('[data-QtnId="' + (QtnIdcntr) + '"]');
                if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                    let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                    let specsPlaceHolder = $(entCreateQuizQtn).find(".specsPlaceHolder");

                    let QtnDataTypeValue = parseInt($(QtnDataType).val());

                    /*
                        1 - RadioButtons
                        2 - Images
                        3 - Date
                        4 - Dropdown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                    */
                    //Dropdown Options //$('[data-fieldtype="QtnOptions_AR"]').val().split('\n').filter(str=>str)
                    if (QtnDataTypeValue == 4 || //DropDown
                        QtnDataTypeValue == 1 || //RadioButtons
                        QtnDataTypeValue == 5) //MultiCheckboxes
                    {
                        //Arabic
                        if (this.quizLanguage == 1) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_AR" rows="5"></textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_EN" rows="5"></textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN">' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_EN" rows="5"></textarea></div>' +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
                                '       <div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_AR" rows="5"></textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }

                    }
                    //ImageChoices
                    else if (QtnDataTypeValue == 2) {
                        let ctlHTML_AR = '<div style="float:right;"><span class="QtnLabel">Size: </span><select data-fieldType="QtnImageSize"><option value="0" >Small</option><option value="1" >Medium</option><option value="2" >Large</option></select></div>';
                        let ctlHTML_EN = '<div style="float:left;"><span class="QtnLabel">Size: </span><select data-fieldType="QtnImageSize"><option value="0" >Small</option><option value="1" >Medium</option><option value="2" >Large</option></select></div>';

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

                    //Ranking
                    else if (QtnDataTypeValue == 6) //Ranking
                    {
                        //Arabic
                        if (this.quizLanguage == 1) {

                            let ctlHTML_AR = '<div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_AR" rows="5" onkeyup="SIAQuiz.Manage.renderRankingAnswerSpecsControl(' + QtnIdcntr + ')"></textarea></div>';

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                ctlHTML_AR +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {

                            let ctlHTML_EN = '<div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_EN" rows="5" onkeyup="SIAQuiz.Manage.renderRankingAnswerSpecsControl(' + QtnIdcntr + ')"></textarea></div>';

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                ctlHTML_EN +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {

                            let ctlHTML_AR = '<div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_AR" rows="5" onkeyup="SIAQuiz.Manage.renderRankingAnswerSpecsControl(' + QtnIdcntr + ')"></textarea></div>';
                            let ctlHTML_EN = '<div class="QtnLabel"> Options : </div>' +
                                '       <div > <textarea data-fieldType="QtnOptions_EN" rows="5" onkeyup="SIAQuiz.Manage.renderRankingAnswerSpecsControl(' + QtnIdcntr + ')"></textarea></div>';

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN">' +
                                ctlHTML_EN +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
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

                    //if not Slider and Ranking and Dropdown
                    if (QtnDataTypeValue != 0 && QtnDataTypeValue != 4) {
                        specsControls += this.renderValidationControl(1); //IsRequired
                    }

                    $(specsPlaceHolder).html(specsControls);
                }

            },


            renderRankingAnswerSpecsControl: function (QtnIdcntr) {

                let answerSpecsControls = '';
                let entCreateQuizQtn = $('[data-QtnId="' + QtnIdcntr + '"]');
                let specsPlaceHolder = $(entCreateQuizQtn).find(".specsPlaceHolder");

                if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                    let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                    let answerSpecsPlaceHolder = $(entCreateQuizQtn).find(".answerSpecsPlaceHolder");

                    let QtnDataTypeValue = parseInt($(QtnDataType).val());

                    /*
                        1 - RadioButtons
                        2 - Images
                        3 - Date
                        4 - Dropdown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                    */

                    //Ranking
                    if (QtnDataTypeValue == 6) //Ranking
                    {

                        //Arabic
                        if (this.quizLanguage == 1) {

                            let qtnOptions_AR = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_AR"]').val().split('\n').filter(str => str);

                            if (qtnOptions_AR != undefined && qtnOptions_AR.length > 0) {
                                answerSpecsControls +=
                                    '<div class="row">' +
                                    '   <div class="col-sm-12 _AR">' +
                                    '       <div class="QtnLabel">Answer : </div>';
                                for (let i = 0; i < qtnOptions_AR.length; i++) {
                                    answerSpecsControls +=
                                        '           <div class="row">' +
                                        '               <div class="col-sm-12 _AR">' +
                                        '                   <span><input type="text" data-fieldType="QtnAnswer_AR_Value_' + i + '" value="' + qtnOptions_AR[i] + '" readonly></span>' +
                                        '                   <select data-fieldType="QtnAnswer_AR_Rank_' + i + '" class="QtnAnswerRank">';
                                    for (let j = 0; j < qtnOptions_AR.length; j++) {
                                        answerSpecsControls += '   <option value="' + (j + 1) + '"  ' + (i == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                                    }

                                    answerSpecsControls += '</select>' +
                                        '   </div>' +
                                        '</div>';

                                }
                                answerSpecsControls +=
                                    '   </div>' +
                                    '</div>';
                            }
                        }
                        //English
                        else if (this.quizLanguage == 2) {

                            let qtnOptions_EN = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_EN"]').val().split('\n').filter(str => str);

                            if (qtnOptions_EN != undefined && qtnOptions_EN.length > 0) {
                                answerSpecsControls +=
                                    '<div class="row">' +
                                    '   <div class="col-sm-12 _EN">' +
                                    '       <div class="QtnLabel">Answer : </div>';
                                for (let i = 0; i < qtnOptions_EN.length; i++) {
                                    answerSpecsControls +=
                                        '           <div class="row">' +
                                        '               <div class="col-sm-12 _EN">' +
                                        '                   <span><input type="text" data-fieldType="QtnAnswer_EN_Value_' + i + '" value="' + qtnOptions_EN[i] + '" readonly></span>' +
                                        '                   <select data-fieldType="QtnAnswer_EN_Rank_' + i + '" class="QtnAnswerRank">';
                                    for (let j = 0; j < qtnOptions_EN.length; j++) {
                                        answerSpecsControls += '   <option value="' + (j + 1) + '"  ' + (i == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                                    }

                                    answerSpecsControls += '</select>' +
                                        '   </div>' +
                                        '</div>';

                                }
                                answerSpecsControls +=
                                    '   </div>' +
                                    '</div>';
                            }
                        }
                        //Both
                        else if (this.quizLanguage == 3) {
                            let qtnOptions_AR = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_AR"]').val().split('\n').filter(str => str);
                            let qtnOptions_EN = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_EN"]').val().split('\n').filter(str => str);

                            if (qtnOptions_AR != undefined && qtnOptions_AR.length > 0 &&
                                qtnOptions_EN != undefined && qtnOptions_EN.length > 0) {
                                answerSpecsControls +=
                                    '<div class="row">' +
                                    '   <div class="col-sm-6 _EN">' +
                                    '       <div class="QtnLabel"> Answer : </div>';
                                for (let i = 0; i < qtnOptions_EN.length; i++) {
                                    answerSpecsControls +=
                                        '           <div class="row">' +
                                        '               <div class="col-sm-12 _EN">' +
                                        '                   <span><input type="text" data-fieldType="QtnAnswer_EN_Value_' + i + '" value="' + qtnOptions_EN[i] + '" readonly></span>' +

                                        '               </div>' +
                                        '           </div>';

                                }


                                answerSpecsControls +=
                                    '  </div>' +
                                    '  <div class="col-sm-6 _AR">' +
                                    '       <div class="QtnLabel">Answer : </div>';
                                for (let i = 0; i < qtnOptions_AR.length; i++) {
                                    answerSpecsControls +=
                                        '           <div class="row">' +
                                        '               <div class="col-sm-12 _AR">' +
                                        '                   <span><input type="text" data-fieldType="QtnAnswer_AR_Value_' + i + '" value="' + qtnOptions_AR[i] + '" readonly></span>' +
                                        '                   <select data-fieldType="QtnAnswer_AR_Rank_' + i + '" class="QtnAnswerRank">';
                                    for (let j = 0; j < qtnOptions_AR.length; j++) {
                                        answerSpecsControls += '   <option value="' + (j + 1) + '"  ' + (i == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                                    }

                                    answerSpecsControls += '      </select>' +
                                        '               </div>' +
                                        '           </div>';

                                }
                                answerSpecsControls +=
                                    '  </div>' +
                                    '</div>';

                            }
                        }
                    }

                    $(answerSpecsPlaceHolder).html(answerSpecsControls);
                }
            },

            renderAnswerSpecsControl: function (QtnIdcntr) {
                let specsControls = '';
                let entCreateQuizQtn = $('[data-QtnId="' + QtnIdcntr + '"]');
                if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                    let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                    let specsPlaceHolder = $(entCreateQuizQtn).find(".answerSpecsPlaceHolder");

                    let QtnDataTypeValue = parseInt($(QtnDataType).val());
                    //let QtnSpecs = $.parseJSON(o.Specs);

                    /*
                        1 - RadioButtons
                        2 - Images
                        3 - Date
                        4 - Dropdown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                    */
                    //Dropdown Options //$('[data-fieldtype="QtnOptions_AR"]').val().split('\n').filter(str=>str)
                    //RadioButtons  //Dropdown
                    if (QtnDataTypeValue == 4 || //DropDown
                        QtnDataTypeValue == 1) //RadioButtons
                    {
                        //Arabic
                        if (this.quizLanguage == 1) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <input type="text" data-fieldType="QtnAnswer_AR" value="" /></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <input type="text" data-fieldType="QtnAnswer_EN" value="" /></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <input type="text" data-fieldType="QtnAnswer_EN" value="" /></div>' +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <input type="text" data-fieldType="QtnAnswer_AR" value="" /></div>' +
                                '   </div>' +
                                '</div>';
                        }

                    }
                    //ImageChoices
                    else if (QtnDataTypeValue == 2) {
                        let ctlHTML_AR = '';
                        let ctlHTML_EN = '';

                        ctlHTML_AR = '<div style="float:right"><div style="color:#coral;background-color:yellow;padding:10px;">Pending Images Upload</div><div></div></div>';
                        ctlHTML_EN = '<div style="float:left"><div style="color:#coral;background-color:yellow;padding:10px;">Pending Images Upload</div><div></div></div>';

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

                    //Date
                    else if (QtnDataTypeValue == 3) //Date
                    {
                        let ctlHTML = '<div class="QtnLabel"> Answer : </div>' +
                            '       <div > <input type="date" data-fieldType="QtnAnswer" value="" /></div>';

                        //Arabic
                        if (this.quizLanguage == 1) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                ctlHTML +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {
                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                ctlHTML +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN">' +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
                                ctlHTML +
                                '   </div>' +
                                '</div>';
                        }

                    }
                    //MultiCheckBoxes
                    if (QtnDataTypeValue == 5) {
                        //Arabic
                        if (this.quizLanguage == 1) {


                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <textarea data-fieldType="QtnAnswer_AR"  rows="5" ></textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //English
                        else if (this.quizLanguage == 2) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <textarea data-fieldType="QtnAnswer_EN"  rows="5" ></textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }
                        //Both
                        else if (this.quizLanguage == 3) {

                            specsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-6" _EN">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <textarea data-fieldType="QtnAnswer_EN"  rows="5" ></textarea></div>' +
                                '   </div>' +
                                '   <div class="col-sm-6" _AR">' +
                                '       <div class="QtnLabel"> Answer : </div>' +
                                '       <div > <textarea data-fieldType="QtnAnswer_AR"  rows="5" ></textarea></div>' +
                                '   </div>' +
                                '</div>';
                        }

                    }

                    $(specsPlaceHolder).html(specsControls);
                }
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
                        '   <div class="answerSpecsPlaceHolder" > ' +
                        '   </div>' +
                        '   <div class="validationSpecsPlaceHolder" > ' +
                        '   </div>' +
                        '   <div class="validationerrorPlaceHolder _AR" > ' +
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
                        '   <div class="answerSpecsPlaceHolder" > ' +
                        '   </div>' +
                        '   <div class="validationSpecsPlaceHolder" > ' +
                        '   </div>' +
                        '   <div class="validationerrorPlaceHolder" > ' +
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
                        '   <div class="answerSpecsPlaceHolder" > ' +
                        '   </div>' +
                        '   <div class="validationSpecsPlaceHolder" > ' +
                        '   </div>' +
                        '   <div class="validationerrorPlaceHolder _AR" > ' +
                        '   </div>' +
                        '</div>';

                }

                $(".entCreateQuizQtnsContainer").append(qtnPlaceHolder);
                $("#btnAddQuestion").blur();
                return false;
            },
            AddQtnPlaceHolder5: function () {
                for (let i = 0; i < 5; i++) {
                    ENTQuiz.Manage.AddQtnPlaceHolder();
                }
                $("#btnAddQuestion5").blur();
                return false;
            },
            getQuestionDataTypeOptions: function () {
                /*
                        1 - RadioButtons
                        2 - Images
                        3 - Date
                        4 - Dropdown
                        5 - MultiCheckboxes
                        6 - Ranking
                        
                    */

                return '' +
                    '<option value="0">-Select-</option>' +
                    '<option value="1">RadioButtons</option>' +
                    '<option value="2">Image choices</option>' +
                    '<option value="3">Date</option>' +
                    '<option value="4">DropDown</option>' +
                    '<option value="5">MultiCheckboxes</option>' +
                    '<option value="6">Ranking</option>';
            },

            getQuestionDataTypeWithValue: function (o) {
                let quizQtn = "data-QtnId='" + o.ID + "'";
                return '' +
                    '<select data-fieldType="QtnDataType" onchange="ENTQuiz.Manage.renderSpecDetailsControl(' + o.ID + ')" name="QtnDataType' + o.ID + '" >' +
                    '<option value="0">-Select-</option>' +
                    '<option value="1">RadioButtons</option>' +
                    '<option value="2">Image choices</option>' +
                    '<option value="3">Date</option>' +
                    '<option value="4">DropDown</option>' +
                    '<option value="5">MultiCheckboxes</option>' +
                    '<option value="6">Ranking</option>' +
                    '</select>' +
                    '<script>' +
                    '   $("[' + quizQtn + ']").find("["data-fieldType=\'QtnDataType\'"]").val("' + o.DataTypeID + '");' +
                    '   ENTQuiz.Manage.renderSpecDetailsControlWithValue(' + o.ID + ');' +
                    '</script>';
            },
            createQuiz: function (creationStatus) {
                let quiz = ENTQuiz.Manage.getQuizInfoFromForm(creationStatus);
                if (ENTQuiz.Manage.hasEmptyPlaceHolders) return false;

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
                    Classification: 0,
                    PassScore: 1,
                    AllowViewResponse: false,
                    AllowViewAnswers: true,
                    Language: 0,

                    Questions: [],
                    ImageFiles: [],

                    Status: 0,
                    MessageId: 0,
                    HasWelcomeMessage: false,
                    HasThankyouMessage: false,
                    RandomOrderQuestions: false,
                };

                ENTQuiz.Manage.isValidData = true;


                quiz.Title = $("#txtModTitle_AR").val();
                quiz.Title_En = $("#txtModTitle_EN").val();
                quiz.Description = $("#txtModDescription_AR").val();
                quiz.Description_En = $("#txtModDescription_EN").val();
                quiz.RequestingDirectorate = parseInt($("#ddlModDirectorate").val());
                quiz.Classification = parseInt($("#ddlModClassification").val());
                quiz.PassScore = parseInt($("#txtPassScore").val());
                quiz.Language = this.quizLanguage;
                quiz.MessageId = ($("#txtModMessageId").val() != "" ? parseInt($("#txtModMessageId").val()) : 0);
                quiz.AllowViewResponse = $("#chkModAllowViewResponse").is(":checked");
                quiz.AllowViewAnswers = $("#chkModAllowViewAnswers").is(":checked");
                quiz.RandomOrderQuestions = $("#chkRandomOrderQuestions").is(":checked");
                quiz.HasWelcomeMessage = $("#chkModHasWelcomeMessage").is(":checked");
                quiz.HasThankyouMessage = $("#chkModHasThankyouMessage").is(":checked");

                $(".entCreateQuizQtn").each(function (idx, qtnItem) {
                    let qtnInfo = ENTQuiz.Manage.getQuestionInfoOf(qtnItem);
                    quiz.Questions.push(qtnInfo);
                });

                if (this.quizLanguage == 1) {
                    if (quiz.Title == '') {
                        ENTQuiz.Manage.isValidData = false;
                        $(".validationErrorPlaceHolderMain").html("Please provide Quiz Title");
                    }
                    if (quiz.Description == '') {
                        ENTQuiz.Manage.isValidData = false;
                        $(".validationErrorPlaceHolderMain").html("Please provide Quiz Description");
                    }

                }

                else if (this.quizLanguage == 2) {
                    if (quiz.Title_En == '') {
                        ENTQuiz.Manage.isValidData = false;
                        $(".validationErrorPlaceHolderMain").html("Please provide Quiz Title");
                    }
                    if (quiz.Description_En == '') {
                        ENTQuiz.Manage.isValidData = false;
                        $(".validationErrorPlaceHolderMain").html("Please provide Quiz Description");
                    }

                }

                else if (this.quizLanguage == 2) {
                    if (quiz.Title == '' || quiz.Title_En == '') {
                        ENTQuiz.Manage.isValidData = false;
                        $(".validationErrorPlaceHolderMain").html("Please provide Quiz Title");
                    }
                    if (quiz.Description == '' || quiz.Description_En == '') {
                        ENTQuiz.Manage.isValidData = false;
                        $(".validationErrorPlaceHolderMain").html("Please provide Quiz Description");
                    }

                }
                if (quiz.MessageId == 0) {
                    ENTQuiz.Manage.isValidData = false;
                    $(".validationErrorPlaceHolderMain").html("Please provide Message Id");

                }

                if (quiz.Questions.length == 0) {
                    ENTQuiz.Manage.isValidData = false;
                    $(".validationErrorPlaceHolderMain").html("Please add questions before saving the quiz");

                }

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
                let qtnAnswerSpecs = '';

                qtnID = parseInt($(qtnItem).data("qtnid"));

                if (this.quizLanguage == 1) {
                    qtnText = $(qtnItem).find('[data-fieldType="QtnText_AR"]').val();

                    if (qtnText.trim() == '') {
                        ENTQuiz.Manage.isValidData = false;
                        $(qtnItem).find(".validationErrorPlaceHolder").html("Please provide question text");

                    }
                }
                else if (this.quizLanguage == 2) {
                    qtnText_En = $(qtnItem).find('[data-fieldType="QtnText_EN"]').val();

                    if (qtnText_En.trim() == '') {
                        ENTQuiz.Manage.isValidData = false;
                        $(qtnItem).find(".validationErrorPlaceHolder").html("Please provide question text");

                    }
                }
                else if (this.quizLanguage == 3) {
                    qtnText = $(qtnItem).find('[data-fieldType="QtnText_AR"]').val();
                    qtnText_En = $(qtnItem).find('[data-fieldType="QtnText_EN"]').val();

                    if (qtnText.trim() == '' || qtnText_En.trim() == '') {
                        ENTQuiz.Manage.isValidData = false;
                        $(qtnItem).find(".validationErrorPlaceHolder").html("Please provide question text");

                    }
                }
                qtnDataTypeID = parseInt($(qtnItem).find('[data-fieldType="QtnDataType"]').val());


                if (qtnText.trim() == '' && qtnText_En.trim() == '') {
                    ENTQuiz.Manage.isValidData = false;
                    $(qtnItem).find(".validationErrorPlaceHolder").html("Please remove empty question place holders");

                }
                else if (qtnDataTypeID == 0) {
                    ENTQuiz.Manage.isValidData = false;
                    $(qtnItem).find(".validationErrorPlaceHolder").html("Datatype not selected");

                }
                qtnOrder = parseInt($(qtnItem).find('[data-fieldType="QtnOrder"]').val());

                qtnSpecs = ENTQuiz.Manage.getSpecsInfoOf(qtnItem);
                qtnValidationSpecs = '{"isRequired": true}';
                qtnAnswerSpecs = ENTQuiz.Manage.getAnswerSpecsInfoOf(qtnItem);
                return {
                    ID: qtnID,
                    Question: qtnText,
                    Question_En: qtnText_En,
                    DataTypeID: qtnDataTypeID,
                    Specs: qtnSpecs,
                    Answer: qtnAnswerSpecs,
                    ValidationSpecs: qtnValidationSpecs,
                    Order: qtnOrder,
                };
            },
            getSpecsInfoOf: function (qtnItem) {
                let specsPlaceHolder = $(qtnItem).find(".specsPlaceHolder");
                let QtnDataTypeValue = parseInt($(qtnItem).find('[data-fieldType="QtnDataType"]').val());
                let strSpecs = '';

                /*
                   1 - RadioButtons
                   2 - ImageChoices
                   3 - Date
                   4 - DropDown
                   5 - MultiCheckboxes
                   6 - Ranking
                   
                   */

                if (QtnDataTypeValue == 4 || //Dropdown
                    QtnDataTypeValue == 1 || //RadioButtons
                    QtnDataTypeValue == 5 || //MultiCheckboxes
                    QtnDataTypeValue == 6)  //Ranking
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
                //Imagechoices
                else if (QtnDataTypeValue == 2) {
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
                //if (QtnDataTypeValue != 8 && QtnDataTypeValue != 9) {
                let qtnIsRequiredCtl = $(validationSpecsPlaceHolder).find('[data-fieldtype="QtnIsRequired"]');
                if (qtnIsRequiredCtl != undefined && qtnIsRequiredCtl.length > 0) {
                    strValidationSpecs = '"isRequired":' + $(qtnIsRequiredCtl).is(":checked");
                }
                //}

                return '{' + strValidationSpecs + '}';

            },


            getAnswerSpecsInfoOf: function (qtnItem) {
                let specsPlaceHolder = $(qtnItem).find(".answerSpecsPlaceHolder");
                let QtnDataTypeValue = parseInt($(qtnItem).find('[data-fieldType="QtnDataType"]').val());
                let strSpecs = '';

                /*
                   1 - RadioButtons
                   2 - ImageChoices
                   3 - Date
                   4 - DropDown
                   5 - MultiCheckboxes
                   6 - Ranking
                   
                   */

                if (QtnDataTypeValue == 4 || //Dropdown
                    QtnDataTypeValue == 1) //RadioButtons
                {
                    if (this.quizLanguage == 1) {
                        let qtnAnswer_AR = $(qtnItem).find('[data-fieldType="QtnAnswer_AR"]').val();
                        if (qtnAnswer_AR != undefined && qtnAnswer_AR != "") {
                            strSpecs += '"ar":' + JSON.stringify(qtnAnswer_AR, null);
                        } else {
                            this.isValidData = false;
                            console.log("Answer Missing");
                            $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing");
                        }
                    }

                    else if (this.quizLanguage == 2) {
                        let qtnAnswer_EN = $(qtnItem).find('[data-fieldType="QtnAnswer_EN"]').val();
                        if (qtnAnswer_EN != undefined && qtnAnswer_EN != "") {
                            strSpecs += '"en":' + JSON.stringify(qtnAnswer_EN, null);
                        } else {
                            this.isValidData = false;
                            console.log("Answer Missing");
                            $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing");
                        }
                    }
                    else if (this.quizLanguage == 3) {
                        let qtnAnswer_AR = $(qtnItem).find('[data-fieldType="QtnAnswer_AR"]').val();
                        let qtnAnswer_EN = $(qtnItem).find('[data-fieldType="QtnAnswer_EN"]').val();
                        if (qtnAnswer_AR != undefined && qtnAnswer_AR != "" &&
                            qtnAnswer_EN != undefined && qtnAnswer_EN != "") {
                            strSpecs += '"ar":' + JSON.stringify(qtnAnswer_AR, null);
                            strSpecs += ',';
                            strSpecs += '"en":' + JSON.stringify(qtnAnswer_EN, null);
                        } else {
                            this.isValidData = false;
                            console.log("Answer Missing / Number of options not matching in both languages");
                            $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing/ Number of options not matching in both languages");
                        }
                    }
                }
                //Imagechoices
                else if (QtnDataTypeValue == 2) {
                    let qtnAnswerCtl = $(specsPlaceHolder).find('[data-fieldtype="QtnAnswer"]');
                    if (qtnAnswerCtl != undefined && qtnAnswerCtl.length > 0) {
                        try {
                            strSpecs += '"ans":' + parseInt($(qtnAnswerCtl).val());
                        }
                        catch (ex) {
                            this.isValidData = false;
                            console.log("Answer Value missing");
                            $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing");

                        }
                    } else {
                        this.isValidData = false;
                        console.log("Answer Value missing");
                        $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing");

                    }
                }

                //Date
                else if (QtnDataTypeValue == 3) {
                    let qtnAnswerCtl = $(specsPlaceHolder).find('[data-fieldtype="QtnAnswer"]');
                    if (qtnAnswerCtl != undefined && qtnAnswerCtl.length > 0) {
                        try {
                            strSpecs += '"ans":"' + $(qtnAnswerCtl).val() + '"';
                        }
                        catch (ex) {
                            this.isValidData = false;
                            console.log("Answer Value missing");
                            $(qtnItem).find(".validationErrorPlaceHolder").html("Answer Missing");

                        }
                    } else {
                        this.isValidData = false;
                        console.log("Answer Value missing");
                        $(qtnItem).find(".validationErrorPlaceHolder").html("Answer Missing");

                    }
                }

                //MultiCheckboxes
                else if (QtnDataTypeValue == 5) {
                    if (this.quizLanguage == 1) {
                        let qtnAnswer_AR = $(specsPlaceHolder).find('[data-fieldType="QtnAnswer_AR"]').val().split('\n').filter(str => str);
                        if (qtnAnswer_AR != undefined && qtnAnswer_AR.length > 0) {
                            strSpecs += '"ar":' + JSON.stringify(qtnAnswer_AR, null);
                        } else {
                            this.isValidData = false;
                            console.log("Answer Missing");
                            $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing");
                        }
                    }
                    else if (this.quizLanguage == 2) {
                        let qtnAnswer_EN = $(specsPlaceHolder).find('[data-fieldType="QtnAnswer_EN"]').val().split('\n').filter(str => str);
                        if (qtnAnswer_EN != undefined && qtnAnswer_EN.length > 0) {
                            strSpecs += '"en":' + JSON.stringify(qtnAnswer_EN, null);
                        } else {
                            this.isValidData = false;
                            console.log("Answer Missing");
                            $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing");
                        }
                    }
                    else if (this.quizLanguage == 3) {
                        let qtnAnswer_AR = $(specsPlaceHolder).find('[data-fieldType="QtnAnswer_AR"]').val().split('\n').filter(str => str);
                        let qtnAnswer_EN = $(specsPlaceHolder).find('[data-fieldType="QtnAnswer_EN"]').val().split('\n').filter(str => str);
                        if (qtnAnswer_AR != undefined && qtnAnswer_AR.length > 0 &&
                            qtnAnswer_EN != undefined && qtnAnswer_EN.length > 0 &&
                            qtnAnswer_AR.length == qtnAnswer_EN.length) {
                            strSpecs += '"ar":' + JSON.stringify(qtnAnswer_AR, null);
                            strSpecs += ',';
                            strSpecs += '"en":' + JSON.stringify(qtnAnswer_EN, null);
                        } else {
                            this.isValidData = false;
                            console.log("Answer Missing / Number of Answer not matching in both languages");
                            $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing/ Number of Answer not matching in both languages");
                        }
                    }
                }

                //Ranking
                else if (QtnDataTypeValue == 6) {
                    if (this.quizLanguage == 1 || this.quizLanguage == 3) {
                        let qtnAnswer_AR_Rank_Ctls = $(specsPlaceHolder).find('[data-fieldType^="QtnAnswer_AR_Rank"]');
                        let qtnAnswer_AR_Ranks = [];
                        for (let i = 0; i < qtnAnswer_AR_Rank_Ctls.length; i++) {
                            qtnAnswer_AR_Ranks.push($(qtnAnswer_AR_Rank_Ctls[i]).val());
                        }
                        if (qtnAnswer_AR_Rank_Ctls != undefined && qtnAnswer_AR_Rank_Ctls.length > 0) {
                            strSpecs += '"ans":' + JSON.stringify(qtnAnswer_AR_Ranks, null);
                        } else {
                            this.isValidData = false;
                            console.log("Answer Missing");
                            $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing");
                        }
                    }
                    else if (this.quizLanguage == 2) {
                        let qtnAnswer_EN_Rank_Ctls = $(specsPlaceHolder).find('[data-fieldType^="QtnAnswer_EN_Rank"]');
                        let qtnAnswer_EN_Ranks = [];
                        for (let i = 0; i < qtnAnswer_EN_Rank_Ctls.length; i++) {
                            qtnAnswer_EN_Ranks.push($(qtnAnswer_EN_Rank_Ctls[i]).val());
                        }
                        if (qtnAnswer_EN_Rank_Ctls != undefined && qtnAnswer_EN_Rank_Ctls.length > 0) {
                            strSpecs += '"ans":' + JSON.stringify(qtnAnswer_EN_Ranks, null);
                        } else {
                            this.isValidData = false;
                            console.log("Answer Missing");
                            $(qtnItem).find(".validationErrorPlaceHolder")("Answer Missing");
                        }
                    }
                    console.log(strSpecs);
                }
                return '{' + strSpecs + '}';
            },

            cancelQuiz: function () {
                window.location = 'Managequizs.aspx';
            },
            AddImageFiles: function(){
                if(ENTQuiz.Common.getUrlParams("quizId") != undefined ){
                    let quizId = ENTQuiz.Common.getUrlParams("quizId");
                    window.location = 'AddImageFiles.aspx?quizId='+ quizId;
                    return false;
                }
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