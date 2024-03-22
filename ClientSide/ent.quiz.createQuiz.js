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
                    '   <div class="col-sm-12 entModTitle _AR> ' +
                    '       <div class="QtnLabel">Title : </div>' +
                    '       <div><input type="text" id="txtModTitle_AR" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDescription _AR> ' +
                    '       <div class="QtnLabel">Description : </div>' +
                    '       <div><textarea id="txtModDescription_AR" rows="5" ></textarea></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Directorate : </div>' +
                    '       <div>' + ENTQuiz.Manage.getDirectorateListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModClassification _AR> ' +
                    '       <div class="QtnLabel"> Classification : </div>' +
                    '       <div>' + ENTQuiz.Manage.getClassificationListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Passing score : </div>' +
                    '       <div><input class="entModQtnCtl" type="number" id="txtPassScore" value="1" min="1" placeholder="Pass score" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Show response after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewResponse" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Show Answers after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewAnswers" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Enable Random Order Questions : </div>' +
                    '       <div><input type="checkbox" id="chkRandomOrderQuestions" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Has Welcome Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasWelcomeMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Has Thankyou Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasThankyouMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Message ID : </div>' +
                    '       <div><input id="txtModMessageId"value="0" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode >=48 && event.charCode<=57"  /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="validationErrorPlaceHolderMain validationErrorPlaceHolder"></div>' +
                    '   </div>' +
                    '</div>';
            }
            else if (this.quizLanguage == 2) {
                modPlaceHolder_TitleDescription =
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModTitle _EN> ' +
                    '       <div class="QtnLabel">Title : </div>' +
                    '       <div><input type="text" id="txtModTitle_EN" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDescription _EN> ' +
                    '       <div class="QtnLabel">Description : </div>' +
                    '       <div><textarea id="txtModDescription_EN" rows="5" ></textarea></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN> ' +
                    '       <div class="QtnLabel">Directorate : </div>' +
                    '       <div>' + ENTQuiz.Manage.getDirectorateListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModClassification _EN> ' +
                    '       <div class="QtnLabel"> Classification : </div>' +
                    '       <div>' + ENTQuiz.Manage.getClassificationListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN> ' +
                    '       <div class="QtnLabel">Passing score : </div>' +
                    '       <div><input class="entModQtnCtl" type="number" id="txtPassScore" value="1" min="1" placeholder="Pass score" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN> ' +
                    '       <div class="QtnLabel">Show response after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewResponse" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN> ' +
                    '       <div class="QtnLabel">Show Answers after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewAnswers" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN> ' +
                    '       <div class="QtnLabel">Enable Random Order Questions : </div>' +
                    '       <div><input type="checkbox" id="chkRandomOrderQuestions" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN> ' +
                    '       <div class="QtnLabel">Has Welcome Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasWelcomeMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN> ' +
                    '       <div class="QtnLabel">Has Thankyou Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasThankyouMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _EN> ' +
                    '       <div class="QtnLabel">Message ID : </div>' +
                    '       <div><input id="txtModMessageId"value="0" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode >=48 && event.charCode<=57"  /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
                    '       <div class="validationErrorPlaceHolderMain validationErrorPlaceHolder"></div>' +
                    '   </div>' +
                    '</div>';
            }
            else if (this.quizLanguage == 3) {
                modPlaceHolder_TitleDescription =
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModTitle _EN> ' +
                    '       <div class="QtnLabel">Title : </div>' +
                    '       <div><input type="text" id="txtModTitle_EN" /></div>' +
                    '   </div>' +
                    '   <div class="col-sm-6 entModTitle _AR> ' +
                    '       <div class="QtnLabel">Title : </div>' +
                    '       <div><input type="text" id="txtModTitle_AR" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDescription _EN> ' +
                    '       <div class="QtnLabel">Description : </div>' +
                    '       <div><textarea id="txtModDescription_EN" rows="5" ></textarea></div>' +
                    '   </div>' +
                    '   <div class="col-sm-6 entModDescription _AR> ' +
                    '       <div class="QtnLabel">Description : </div>' +
                    '       <div><textarea id="txtModDescription_AR" rows="5" ></textarea></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Directorate : </div>' +
                    '       <div>' + ENTQuiz.Manage.getDirectorateListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModClassification _EN></div> ' +
                    '   <div class="col-sm-6 entModClassification _AR> ' +
                    '       <div class="QtnLabel"> Classification : </div>' +
                    '       <div>' + ENTQuiz.Manage.getClassificationListControl() + '</div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Passing score : </div>' +
                    '       <div><input class="entModQtnCtl" type="number" id="txtPassScore" value="1" min="1" placeholder="Pass score" onkeypress="return event.charCode>=48 && event.charCode<=57" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Show response after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewResponse" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Show Answers after submission : </div>' +
                    '       <div><input type="checkbox" id="chkModAllowViewAnswers" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Enable Random Order Questions : </div>' +
                    '       <div><input type="checkbox" id="chkRandomOrderQuestions" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Has Welcome Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasWelcomeMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Has Thankyou Message : </div>' +
                    '       <div><input type="checkbox" id="chkModHasThankyouMessage" class="entModQtnCtl" /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-6 entModDirectorate _EN></div> ' +
                    '   <div class="col-sm-6 entModDirectorate _AR> ' +
                    '       <div class="QtnLabel">Message ID : </div>' +
                    '       <div><input id="txtModMessageId"value="0" placeholder="MessageID" type="number" min="0" onkeypress="return event.charCode >=48 && event.charCode<=57"  /></div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12 entModDirectorate _AR> ' +
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
                PassSore: 1,
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
            quiz.PassSore = parseInt($("#txtPassScore").val());
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
                if (quiz.Title || quiz.Title_En == '') {
                    ENTQuiz.Manage.isValidData = false;
                    $(".validationErrorPlaceHolderMain").html("Please provide Quiz Title");
                }
                if (quiz.Description || quiz.Description_En == '') {
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
            else if (qtnDataTypeID == 0){
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
            if (QtnDataTypeValue != 10 && QtnDataTypeValue != 12) {
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

    }

    $(':input').on('focus', function () {
        $(this).attr('autocomplete', 'off');

    });
});