(function () {

    'use strict';
    ENTQuiz.Manage = {

        fetched: false,
        items_all: [],
        items: [],
        quizLanguage: 1,

        apiPath: "",
        quiz: {},
        SetQuizLanguage: function (langID) {
            this.quizLanguage = langID;
            $(".entQuizLanguage").hide();
            this.ShowQuizCreator();
            return false;
        },

        getDirectorateListControl: function () {
            let optDirectorates = ENTQuiz.Common.Directorates.map(function (o, idx) {
                return '<option value="' + idx + '">' + o + '</option>';
            }).join('');

            return '<select id="ddlModDirectorate" > ' +
                optDirectorates +
                '   </select>';
        },

        getClassificationListControl: function () {
            let optClassifications = ENTQuiz.Common.Classifications.map(function (o, idx) {
                return '<option value="' + idx + '">' + o + '</option>';
            }).join('');

            return '<select id="ddlModClassification" > ' +
                optClassifications +
                '   </select>';
        },
        ShowQuizCreator: function () {
            let modPlaceHolder_TitleDescription = '';
            if (this.quizLanguage == 1) {
                modPlaceHolder_TitleDescription =
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModTitle _AR"> ' +
                    '       <div class="QtnLabel">Title : </div>' +
                    '       <div><input type="text" id="txtModTitle_AR" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDescription _AR"> ' +
                    '       <div class="QtnLabel">Description : </div>' +
                    '       <div><textarea id="txtModDescription_AR" rows="5" ></textarea></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Directorate : </div>' +
                    '       <div>' + ENTQuiz.Manage.getDirectorateListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModClassification _AR"> ' +
                    '       <div class="QtnLabel"> Classification : </div>' +
                    '       <div>' + ENTQuiz.Manage.getClassificationListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Passing score : </div>' +
                    '       <div><input class="entModQtnCtl" type="number" id="txtPassScore" value="1" min="1" placeholder="Pass score" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Show response after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewResponse" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Show Answers after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewAnswers" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Enable Random Order Questions : </div>' +
                    '       <div><input type="checkbox" id="chkRandomOrderQuestions" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Has Welcome Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasWelcomeMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Has Thankyou Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasThankyouMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Message ID : </div>' +
                    '       <div><input id="txtModMessageId"value="0" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode >=48 && event.charCode<=57"  /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="validationErrorPlaceHolderMain validationErrorPlaceHolder"></div>' +
                    '   </div>' +
                    '</div>';
            }
            else if (this.quizLanguage == 2) {
                modPlaceHolder_TitleDescription =
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModTitle _EN"> ' +
                    '       <div class="QtnLabel">Title : </div>' +
                    '       <div><input type="text" id="txtModTitle_EN" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDescription _EN"> ' +
                    '       <div class="QtnLabel">Description : </div>' +
                    '       <div><textarea id="txtModDescription_EN" rows="5" ></textarea></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN"> ' +
                    '       <div class="QtnLabel">Directorate : </div>' +
                    '       <div>' + ENTQuiz.Manage.getDirectorateListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModClassification _EN"> ' +
                    '       <div class="QtnLabel"> Classification : </div>' +
                    '       <div>' + ENTQuiz.Manage.getClassificationListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN"> ' +
                    '       <div class="QtnLabel">Passing score : </div>' +
                    '       <div><input class="entModQtnCtl" type="number" id="txtPassScore" value="1" min="1" placeholder="Pass score" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN"> ' +
                    '       <div class="QtnLabel">Show response after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewResponse" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN"> ' +
                    '       <div class="QtnLabel">Show Answers after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewAnswers" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN"> ' +
                    '       <div class="QtnLabel">Enable Random Order Questions : </div>' +
                    '       <div><input type="checkbox" id="chkRandomOrderQuestions" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN"> ' +
                    '       <div class="QtnLabel">Has Welcome Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasWelcomeMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN"> ' +
                    '       <div class="QtnLabel">Has Thankyou Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasThankyouMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN"> ' +
                    '       <div class="QtnLabel">Message ID : </div>' +
                    '       <div><input id="txtModMessageId"value="0" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode >=48 && event.charCode<=57"  /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="validationErrorPlaceHolderMain validationErrorPlaceHolder"></div>' +
                    '   </div>' +
                    '</div>';
            }
            else if (this.quizLanguage == 3) {
                modPlaceHolder_TitleDescription =
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModTitle _EN"> ' +
                    '       <div class="QtnLabel">Title : </div>' +
                    '       <div><input type="text" id="txtModTitle_EN" /></div>' +
                    '   </div>' +
                    '   <div class="col-sm-6 entModTitle _AR"> ' +
                    '       <div class="QtnLabel">Title : </div>' +
                    '       <div><input type="text" id="txtModTitle_AR" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDescription _EN"> ' +
                    '       <div class="QtnLabel">Description : </div>' +
                    '       <div><textarea id="txtModDescription_EN" rows="5" ></textarea></div>' +
                    '   </div>' +
                    '   <div class="col-sm-6 entModDescription _AR"> ' +
                    '       <div class="QtnLabel">Description : </div>' +
                    '       <div><textarea id="txtModDescription_AR" rows="5" ></textarea></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN"></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Directorate : </div>' +
                    '       <div>' + ENTQuiz.Manage.getDirectorateListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModClassification _EN"></div> ' +
                    '   <div class="col-sm-6 entModClassification _AR"> ' +
                    '       <div class="QtnLabel"> Classification : </div>' +
                    '       <div>' + ENTQuiz.Manage.getClassificationListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN"></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Passing score : </div>' +
                    '       <div><input class="entModQtnCtl" type="number" id="txtPassScore" value="1" min="1" placeholder="Pass score" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN"></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Show response after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewResponse" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN"></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Show Answers after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewAnswers" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN"></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Enable Random Order Questions : </div>' +
                    '       <div><input type="checkbox" id="chkRandomOrderQuestions" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN"></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Has Welcome Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasWelcomeMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN"></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Has Thankyou Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasThankyouMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN"></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR"> ' +
                    '       <div class="QtnLabel">Message ID : </div>' +
                    '       <div><input id="txtModMessageId"value="0" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode >=48 && event.charCode<=57"  /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR"> ' +
                    '       <div class="validationErrorPlaceHolderMain validationErrorPlaceHolder"></div>' +
                    '   </div>' +
                    '</div>';
            }

            $(".entCreateQuizHeaderContainer").html(modPlaceHolder_TitleDescription);
            $(".entCreateQuizContainer").show();
        },

        QtnIdcntr: 0,

        renderSpecDetailsControl: function (QtnIdcntr) {
            ENTQuiz.Manage.renderSpecsControl(QtnIdcntr);
            //ENTQuiz.Manage.renderValidationSpecsControl(QtnIdcntr);
            ENTQuiz.Manage.renderAnswerSpecsControl(QtnIdcntr);
        },
        renderSpecsControl: function (QtnIdcntr) {
            let specsControls = '';
            let entCreateQuizQtn = $('[data-QtnId="' + (QtnIdcntr) + '"]');
            if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                let specsPlaceHolder = $(entCreateQuizQtn).find('.specsPlaceHolder');

                let QtnDataTypeValue = parseInt($(QtnDataType).val());
                /*
                1 - RadioButtons
                2 - ImageChoices
                3 - Date
                4 - DropDown
                5 - MultiCheckboxes
                6 - Ranking
                
                */

                //Options //$('[data-fieldtype="QtnOptions_AR"]').val().split('\n').filter(str=>str)
                if (QtnDataTypeValue == 4 || //Dropdown
                    QtnDataTypeValue == 1 || //RadioButtons
                    QtnDataTypeValue == 5)  //MultiCheckboxes
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

                //ImageChoices
                else if (QtnDataTypeValue == 2) {
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
                //Ranking
                else if (QtnDataTypeValue == 6)  //Ranking
                {
                    let ctlHTML_AR = '<div class="QtnLabel"> Options </div><div><textarea data-fieldtype="QtnOptions_AR" rows="5" onkeyup="ENTQuiz.Manage.renderRankingAnswerSpecsControl(' + QtnIdcntr + ')" ></textarea></div>';
                    let ctlHTML_EN = '<div class="QtnLabel"> Options </div><div><textarea data-fieldtype="QtnOptions_EN" rows="5" onkeyup="ENTQuiz.Manage.renderRankingAnswerSpecsControl(' + QtnIdcntr + ')" ></textarea></div>';

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
                        '               <div><span class="QtnLabel"> Is Required : </span><input type="checkbox" data-fieldType="QtnIsRequired" /></div>' +
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
                        '               <div><span class="QtnLabel"> Is Required : </span><input type="checkbox" data-fieldType="QtnIsRequired" /></div>' +
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
                        '               <div><span class="QtnLabel"> Is Required : </span><input type="checkbox" data-fieldType="QtnIsRequired" /></div>' +
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
                var specsPlaceHolder = $(entCreateQuizQtn).find('.validationSpecsPlaceHolder');

                let QtnDataTypeValue = parseInt($(QtnDataType).val());
                /*
                1 - RadioButtons
                2 - ImageChoices
                3 - Date
                4 - DropDown
                5 - MultiCheckboxes
                6 - Ranking
                
                */
                $(specsPlaceHolder).html(specsControls);
            }

        },

        renderRankingAnswerSpecsControl: function (QtnIdcntr) {

            let strSpecs = '';
            let answerSpecsControls = '';
            let entCreateQuizQtn = $('[data-QtnId="' + (QtnIdcntr) + '"]');
            var specsPlaceHolder = $(entCreateQuizQtn).find('.specsPlaceHolder');
            if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                var answerSpecsPlaceHolder = $(entCreateQuizQtn).find('.answerSpecsPlaceHolder');


                let QtnDataTypeValue = parseInt($(QtnDataType).val());

                if (QtnDataTypeValue == 6) {
                    if (this.quizLanguage == 1) {
                        let qtnOptions_AR = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_AR"]').val().split('\n').filter(str => str);
                        if (qtnOptions_AR != undefined && qtnOptions_AR.length > 0) {
                            answerSpecsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                '       <div class="QtnLabel"> Answer : </div>';
                            for (let i = 0; i < qtnOptions_AR.length; i++) {
                                answerSpecsControls +=
                                    '<div class="row">' +
                                    '   <div class="col-sm-12 _AR">' +
                                    '       <span><input type="text" data-fieldType="QtnAnswer_AR_Value_' + i + '" value="' + qtnOptions_AR[i] + '" readonly></span>' +
                                    '               <select data-fieldType="QtnAnswer_AR_Rank_' + i + '" class="QtnAnswerRank">';
                                for (let j = 0; j < qtnOptions_AR.length; j++) {
                                    answerSpecsControls += '<option value=' + (j + 1) + '' + (i == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                                }
                                answerSpecsControls += '</select> ' +
                                    '   </div>' +
                                    '</div>';

                            }

                            answerSpecsControls +=
                                '   </div>' +
                                '</div>';
                        }
                    }
                    else if (this.quizLanguage == 2) {
                        let qtnOptions_EN = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_EN"]').val().split('\n').filter(str => str);
                        if (qtnOptions_EN != undefined && qtnOptions_EN.length > 0) {
                            answerSpecsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                '       <div class="QtnLabel"> Answer : </div>';
                            for (let i = 0; i < qtnOptions_EN.length; i++) {
                                answerSpecsControls +=
                                    '<div class="row">' +
                                    '   <div class="col-sm-12 _EN">' +
                                    '       <span><input type="text" data-fieldType="QtnAnswer_EN_Value_' + i + '" value="' + qtnOptions_EN[i] + '" readonly></span>' +
                                    '               <select data-fieldType="QtnAnswer_EN_Rank_' + i + '" class="QtnAnswerRank">';
                                for (let j = 0; j < qtnOptions_EN.length; j++) {
                                    answerSpecsControls += '<option value=' + (j + 1) + '' + (i == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                                }
                                answerSpecsControls += '</select> ' +
                                    '   </div>' +
                                    '</div>';

                            }

                            answerSpecsControls +=
                                '   </div>' +
                                '</div>';
                        }
                    }
                    else if (this.quizLanguage == 3) {
                        let qtnOptions_AR = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_AR"]').val().split('\n').filter(str => str);
                        let qtnOptions_EN = $(specsPlaceHolder).find('[data-fieldType="QtnOptions_EN"]').val().split('\n').filter(str => str);

                        answerSpecsControls +=
                            '<div class="row">' +
                            '   <div class="col-sm-6 _EN">' +
                            '       <div class="QtnLabel"> Answer : </div>';
                        for (let i = 0; i < qtnOptions_EN.length; i++) {
                            answerSpecsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _EN">' +
                                '       <span><input type="text" data-fieldType="QtnAnswer_EN_Value_' + i + '" value="' + qtnOptions_EN[i] + '" readonly></span>' +
                                //     '               <select data-fieldType="QtnAnswer_EN_Rank_' + i + '" class="QtnAnswerRank">';
                                // for (let j = 0; j < qtnOptions_EN.length; j++) {
                                //     answerSpecsControls += '<option value=' + (j + 1) + '' + (i == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                                // }
                                // answerSpecsControls += '</select> ' +
                                '   </div>' +
                                '</div>';

                        }

                        answerSpecsControls +=
                            '       </div>' +
                            '   <div class="col-sm-6 _AR">' +
                            '       <div class="QtnLabel"> Answer : </div>';
                        for (let i = 0; i < qtnOptions_AR.length; i++) {
                            answerSpecsControls +=
                                '<div class="row">' +
                                '   <div class="col-sm-12 _AR">' +
                                '       <span><input type="text" data-fieldType="QtnAnswer_AR_Value_' + i + '" value="' + qtnOptions_AR[i] + '" readonly></span>' +
                                '               <select data-fieldType="QtnAnswer_AR_Rank_' + i + '" class="QtnAnswerRank">';
                            for (let j = 0; j < qtnOptions_AR.length; j++) {
                                answerSpecsControls += '<option value=' + (j + 1) + '' + (i == j ? ' selected ' : '') + '>' + (j + 1) + '</option>';
                            }
                            answerSpecsControls += '</select> ' +
                                '   </div>' +
                                '</div>';

                        }

                        answerSpecsControls +=
                            '   </div>' +
                            '</div>';

                    }
                }
                //console.log(strSpecs);
                $(answerSpecsPlaceHolder).html(answerSpecsControls);
            }

        },

        renderAnswerSpecsControl: function (QtnIdcntr) {
            let specsControls = '';
            let entCreateQuizQtn = $('[data-QtnId="' + (QtnIdcntr) + '"]');
            if (entCreateQuizQtn != undefined && entCreateQuizQtn.length > 0) {
                let QtnDataType = $(entCreateQuizQtn).find('[data-fieldType="QtnDataType"]');
                let specsPlaceHolder = $(entCreateQuizQtn).find('.answerSpecsPlaceHolder');

                let QtnDataTypeValue = parseInt($(QtnDataType).val());
                /*
                1 - RadioButtons
                2 - ImageChoices
                3 - Date
                4 - DropDown
                5 - MultiCheckboxes
                6 - Ranking
                
                */

                if (QtnDataTypeValue == 1 || //RadioButtons
                    QtnDataTypeValue == 4) //Dropdown
                {
                    //Arabic
                    if (this.quizLanguage == 1) {
                        specControls +=
                            '<div class="row"> ' +
                            '   <div class="col-sm-12 _AR"> ' +
                            '       <div class="QtnLabel"> Answer : </div> ' +
                            '       <div> <input type="text" data-fieldType="QtnAnswer_AR" value="" /></div>' +
                            '   </div>' +
                            '</div>';
                    }
                    //English
                    else if (this.quizLanguage == 2) {
                        specControls +=
                            '<div class="row"> ' +
                            '   <div class="col-sm-12 _EN"> ' +
                            '       <div class="QtnLabel"> Answer : </div> ' +
                            '       <div> <input type="text" data-fieldType="QtnAnswer_EN" value="" /></div>' +
                            '   </div>' +
                            '</div>';
                    }
                    //Both
                    else if (this.quizLanguage == 3) {
                        specControls +=
                            '<div class="row"> ' +
                            '   <div class="col-sm-6 _EN"> ' +
                            '       <div class="QtnLabel"> Answer : </div> ' +
                            '       <div> <input type="text" data-fieldType="QtnAnswer_EN" value="" /></div>' +
                            '   </div>' +
                            '   <div class="col-sm-6 _AR"> ' +
                            '       <div class="QtnLabel"> Answer : </div> ' +
                            '       <div> <input type="text" data-fieldType="QtnAnswer_AR" value="" /></div>' +
                            '   </div>' +
                            '</div>';
                    }
                }

                //ImageChoices
                else if (QtnDataTypeValue == 2) {
                    let ctlHTML_AR =
                        '<div style="float:right;"><div style="color:coral;background-color:yellow;padding:10px;">Pending Images upload</div></div>';
                    let ctlHTML_EN =
                        '<div style="float:left;"><div style="color:coral;background-color:yellow;padding:10px;">Pending Images upload</div></div>';

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
                //Date
                else if (QtnDataTypeValue == 3)  //Date
                {
                    let ctlHTML = '<div class="QtnLabel"> Answer </div><div> <input type="date" data-fieldType="QtnAnswer" value="" /></div>';

                    //Arabic
                    if (this.quizLanguage == 1) {
                        specControls +=
                            '<div class="row"> ' +
                            '   <div class="col-sm-12 _AR"> ' +
                            ctlHTML +
                            '   </div>' +
                            '</div>';
                    }
                    //English
                    else if (this.quizLanguage == 2) {
                        specControls +=
                            '<div class="row"> ' +
                            '   <div class="col-sm-12 _EN"> ' +
                            ctlHTML +
                            '   </div>' +
                            '</div>';
                    }
                    //Both
                    else if (this.quizLanguage == 3) {
                        specControls +=
                            '<div class="row"> ' +
                            '   <div class="col-sm-6 _EN"> '
                        '   </div>' +
                            '   <div class="col-sm-6 _AR"> ' +
                            ctlHTML +
                            '   </div>' +
                            '</div>';
                    }
                }

                //MulticheckBoxes
                else if (QtnDataTypeValue == 5) {
                    let ctlHTML_AR = '<div class="QtnLabel"> Answer </div><div> <textarea data-fieldType="QtnAnswer_AR" rows="5"></textarea></div>';
                    let ctlHTML_EN = '<div class="QtnLabel"> Answer </div><div> <textarea data-fieldType="QtnAnswer_EN" rows="5"></textarea></div>';

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
        removeQuestion: function (qtnHandle) {
            $(qtnHandle).parent()[0].outerHTML = '';
        },

        AddQtnPlaceHolder: function () {

            let qtnPlaceHolder = '';

            //Arabic
            if (this.quizLanguage == 1) {
                qtnPlaceHolder =
                    '<div class="entCreateQuizQtn" data-QtnId="' + (++this.QtnIdcntr) + '"> ' +
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
                    '               <select data=fieldType="QtnDataType" onchange="ENTQuiz.Manage.renderSpecDetailsControl(' + this.QtnIdcntr + ')" >' +
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
                    '   <div class="validationErrorPlaceHolder _AR" > ' +
                    '   </div>' +
                    '</div>';


            }
            //English
            else if (this.quizLanguage == 2) {
                qtnPlaceHolder =
                    '<div class="entCreateQuizQtn" data-QtnId="' + (++this.QtnIdcntr) + '"> ' +
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
                    '               <select data=fieldType="QtnDataType" onchange="ENTQuiz.Manage.renderSpecDetailsControl(' + this.QtnIdcntr + ')" >' +
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
                    '   <div class="validationErrorPlaceHolder" > ' +
                    '   </div>' +
                    '</div>';

            }
            //Both
            else if (this.quizLanguage == 3) {
                qtnPlaceHolder =
                    '<div class="entCreateQuizQtn" data-QtnId="' + (++this.QtnIdcntr) + '"> ' +
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
                    '               <select data=fieldType="QtnDataType" onchange="ENTQuiz.Manage.renderSpecDetailsControl(' + this.QtnIdcntr + ')" >' +
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
                    '   <div class="validationErrorPlaceHolder _AR" > ' +
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
               2 - ImageChoices
               3 - Date
               4 - DropDown
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

        createQuiz: function (creationStatus) {
            $(".validationErrorPlaceHolder").html('');
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
                if (quiz.Title = '' || quiz.Title_En == '') {
                    ENTQuiz.Manage.isValidData = false;
                    $(".validationErrorPlaceHolderMain").html("Please provide Quiz Title");
                }
                if (quiz.Description = '' || quiz.Description_En == '') {
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
            let qtnText = '';
            let qtnText_En = '';
            let qtnDataTypeID = 0;
            let qtnOrder = 0;
            let qtnSpecs = '';
            let qtnValidationSpecs = '';
            let qtnAnswerSpecs = '';

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
            //ImageChoices
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
                    if (qtnAnswer_AR != undefined && qtnAnswer_AR.length != "") {
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
                        qtnAnswer_EN != undefined && qtnAnswer_EN != "" ) {
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
            // //ImageChoices
            // else if (QtnDataTypeValue == 2) {
            //     let qtnImageSizeCtl = $(specsPlaceHolder).find('[data-fieldtype="QtnImageSize"]');
            //     if (qtnImageSizeCtl != undefined && qtnImageSizeCtl.length > 0) {
            //         try {
            //             strSpecs += '"size":' + parseInt($(qtnImageSizeCtl).val());
            //         }
            //         catch (ex) {
            //             this.isValidData = false;
            //             console.log("Image size Value missing");
            //             alert("Image size Value missing");
            //         }
            //     } else {
            //         this.isValidData = false;
            //         console.log("Image size Value missing");
            //         alert("Image size Value missing");
            //     }
            // }

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
                    for(let i=0;i<qtnAnswer_AR_Rank_Ctls.length;i++){
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
                    for(let i=0;i<qtnAnswer_EN_Rank_Ctls.length;i++){
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

    }

    $(':input').on('focus', function () {
        $(this).attr('autocomplete', 'off');

    });
});