(function () {

    'use strict';
    ENTQuiz.AddImageChoices = {
        apiPath: "",
        quiz: {},
        fetched: false,
        quizLanguage: 1,
        SetQuizLanguage: function (langID) {
            this.quizLanguage = langID;
            $(".entQuizLanguage").hide();
            this.renderAddImageChoices();
            return false;
        },
        initializePage: function () {
            this.fetched = true;
            if (ENTQuiz.Common.getUrlParams("quizId") != undefined) {
                let quizId = ENTQuiz.Common.getUrlParams("quizId");
                let apiPath_item = this.apiPath + '/getQuiz_Edit?quizId=' + quizId + '&absolutePath=' + location.pathname;

                this.getQuizFromDB(apiPath_item);
            } else {
                console.log("Quiz not selected");
                if (ENTQuiz.Common.getUrlParams("quizId") == undefined)
                    $(".entQuizContainer").html("<div class='ErrorDiv'>Quiz not selected</br/>For additional info, please contact IT Helpdesk</div>");

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
                    ENTQuiz.AddImageChoices.OnGetQuiz_Success(data_items);
                },
                error: function (errordata) {
                    console.log(errordata);
                    if (errordata.responseJSON.ExceptionType == "System.UnauthorizedAccessException") {
                        $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! You do not have access to the requested resource</br/>Please contact IT Helpdesk if need access</div>");
                    }
                    else {
                        $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching quiz questions. Please try again after sometime. </br/>If problem persists, contact IT Helpdesk </div>");
                    }
                }
            });
        },
        OnGetQuiz_Success: function (data_item) {
            if (data_item != undefined && data_item.ErrorCode == undefined) {
                this.quiz = data_item;
                this.fetched = true;
                $(".entQuizDataLoaderMessage").hide();
                this.SetQuizLanguage(this.quiz.Language);
            }
            else {
                if (data_item == undefined) {
                    $(".entQuizContainer").html("<div class='ErrorDiv'>No draft quiz fuond with given id</br/>Please contact IT Helpdesk </div>");
                }
                else if (data_item.ErrorCode != undefined) {
                    $(".entQuizContainer").html("<div class='ErrorDiv'>Sorry ! Error occured while fetching quiz details. Please try again after sometime. </br/>If problem persists, contact IT Helpdesk </div><div style='matgin:5%;color:coral'>" + data_item.ErrorMesssage + "</div>");

                }
            }
        },

        renderAddImageChoices: function () {
            if (this.quiz != undefined) {
                let quizId = this.quiz.ID;
                $("#ent_quizId").val(quizId);

                let htmlQuizHeader = '';
                if (this.quizLanguage == 1) {
                    htmlQuizHeader =
                        '<div class="row">' +
                        '   <div class="col-sm-12 entModTitle _AR">' +
                        '       <div> Title : </div>' +
                        '       <div> ' + this.quiz.Title + ' </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="row">' +
                        '   <div class="col-sm-12 entModDescription _AR">' +
                        '       <div> Description : </div>' +
                        '       <div> ' + this.quiz.Description + ' </div>' +
                        '   </div>' +
                        '</div>';
                }
                else if (this.quizLanguage == 2) {
                    htmlQuizHeader =
                        '<div class="row">' +
                        '   <div class="col-sm-12 entModTitle _EN">' +
                        '       <div> Title : </div>' +
                        '       <div> ' + this.quiz.Title_En + ' </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="row">' +
                        '   <div class="col-sm-12 entModDescription _EN">' +
                        '       <div> Description : </div>' +
                        '       <div> ' + this.quiz.Description_En + ' </div>' +
                        '   </div>' +
                        '</div>';
                }
                else if (this.quizLanguage == 3) {
                    htmlQuizHeader =
                        '<div class="row">' +
                        '   <div class="col-sm-6 entModTitle _AR">' +
                        '       <div> Title : </div>' +
                        '       <div> ' + this.quiz.Title + ' </div>' +
                        '   </div>' +
                        '   <div class="col-sm-6 entModTitle _EN">' +
                        '       <div> Title : </div>' +
                        '       <div> ' + this.quiz.Title_En + ' </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="row">' +
                        '   <div class="col-sm-6 entModDescription _AR">' +
                        '       <div> Description : </div>' +
                        '       <div> ' + this.quiz.Description + ' </div>' +
                        '   </div>' +
                        '   <div class="col-sm-6 entModDescription _EN">' +
                        '       <div> Description : </div>' +
                        '       <div> ' + this.quiz.Description_En + ' </div>' +
                        '   </div>' +
                        '</div>';
                }

                $(".entQuizHeaderContainer").html(htmlQuizHeader);

                let ctlHTML_AR = '<div style="float:right;"> Images : <input type="file" data-fieldType="QtnImageChoices" multiple="multiple"></div>';
                let ctlHTML_EN = '<div style="float:left;"> Images : <input type="file" data-fieldType="QtnImageChoices" multiple="multiple"></div>';

                let htmlQuizQuestions = this.quiz.Questions.map(function (o, idx) {

                    let qtnPlaceHolder = '';
                    if (o.DataTypeID == 2) {
                        //ARABIC
                        if (ENTQuiz.AddImageChoices.quizLanguage == 1) {
                            qtnPlaceHolder =
                                '<div class="entCreateQuizQtn entQuizQuestion" data-QtnId="' + o.ID + '">' +
                                '   <div class="row">' +
                                '       <div class="col-sm-12  _AR">' +
                                '           <div> Question : </div>' +
                                '           <div> ' + o.Question + ' </div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="specsPlaceHolder">' +
                                '       <div class="row">' +
                                '           <div class="col-sm-12 _AR">' +
                                ctlHTML_AR +
                                '           </div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="validationSpecsPlaceHolder">' +
                                '   </div>' +
                                '</div>';
                        }
                        //ENGLISH
                        else if (ENTQuiz.AddImageChoices.quizLanguage == 2) {
                            qtnPlaceHolder =
                                '<div class="entCreateQuizQtn entQuizQuestion" data-QtnId="' + o.ID + '">' +
                                '   <div class="row">' +
                                '       <div class="col-sm-12  _EN">' +
                                '           <div> Question : </div>' +
                                '           <div> ' + o.Question_En + ' </div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="specsPlaceHolder">' +
                                '       <div class="row">' +
                                '           <div class="col-sm-12 _EN">' +
                                ctlHTML_EN +
                                '           </div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="validationSpecsPlaceHolder">' +
                                '   </div>' +
                                '</div>';
                        }
                        //BOTH
                        else if (ENTQuiz.AddImageChoices.quizLanguage == 3) {
                            qtnPlaceHolder =
                                '<div class="entCreateQuizQtn entQuizQuestion" data-QtnId="' + o.ID + '">' +
                                '   <div class="row">' +
                                '       <div class="col-sm-6  _AR">' +
                                '           <div> Question : </div>' +
                                '           <div> ' + o.Question + ' </div>' +
                                '       </div>' +
                                '       <div class="col-sm-6  _EN">' +
                                '           <div> Question : </div>' +
                                '           <div> ' + o.Question_En + ' </div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="specsPlaceHolder">' +
                                '       <div class="row">' +
                                '           <div class="col-sm-6 _AR">' +
                                ctlHTML_AR +
                                '           </div>' +
                                '           <div class="col-sm-6 _EN"></div>' +
                                '       </div>' +
                                '   </div>' +
                                '   <div class="validationSpecsPlaceHolder">' +
                                '   </div>' +
                                '</div>';
                        }
                    }

                    return qtnPlaceHolder;
                }).join('');

                $(".entQuizQuestionsContainer").html(htmlQuizQuestions);
                $(".entCreateQuizContainer").show();
            }
        },
        cancelQuiz: function () {

            window.location = "ManageQuizs.aspx";
        },
        saveQuiz: function (creationStatus) {
            ENTQuiz.AddImageChoices.isSubmitted = false;
            let quiz = ENTQuiz.AddImageChoices.getQuizInfoFromForm();

            ENTQuiz.AddImageChoices.oQuiz = quiz;

            if (ENTQuiz.AddImageChoices.isValidData) {
                for (let i = 0; i < ENTQuiz.AddImageChoices.ImageFileReaders.length; i++) {
                    //readAsBinaryString //readAsArrayBuffer
                    ENTQuiz.AddImageChoices.ImageFileReaders[i].reader.readAsDataURL(ENTQuiz.AddImageChoices.ImageFileReaders[i].File);
                }
                ENTQuiz.AddImageChoices.saveQuizWithFiles();
            }

        },

        isSubmitted: false,
        oQuiz: {},
        saveQuizWithFiles: function () {
            if (!ENTQuiz.AddImageChoices.isSubmitted) {
                let isAllFilesLoaded = true;
                for (let i = 0; i < ENTQuiz.AddImageChoices.ImageFileReaders.length; i++) {
                    isAllFilesLoaded = ENTQuiz.AddImageChoices.ImageFileReaders[i].isLoaded;
                    if (!isAllFilesLoaded) break;
                }
                if (isAllFilesLoaded) {
                    let apiPath_item = this.apiPath + '/updateQuizImageChoices?absolutePath=' + location.pathname;
                    ENTQuiz.AddImageChoices.isSubmitted = true;
                    ENTQuiz.AddImageChoices.oQuiz.ImageChoices = ENTQuiz.AddImageChoices.ImageFiles;
                    $.ajax({
                        type: 'POST',
                        url: apiPath_item,
                        data: ENTQuiz.AddImageChoices.oQuiz,
                        headers: {
                            Accept: "application/json;odata=verbose"
                        },
                        async: true,
                        binaryStringRequestBody: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data_items) {
                            alert("Image Files saved successfully");
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
            }
        },
        getQuizInfoFromForm: function (creationStatus) {
            let quiz = {
                ID: 0,
                Questions: [],
                ImageFiles: []
            };
            ENTQuiz.AddImageChoices.ImageFiles = [];
            ENTQuiz.AddImageChoices.ImageFileReaders = [];
            ENTQuiz.AddImageChoices.isValidData = true;

            quiz.ID = parseInt($("#ent_quizId").val());

            $(".entCreateQuizQtn").each(function (idx, qtnItem) {
                let qtnInfo = ENTQuiz.AddImageChoices.getQuestionInfoOf(qtnItem);
                quiz.Questions.push(qtnInfo);
            });

            return quiz;

        },
        isValidData: true,
        getQuestionInfoOf: function (qtnItem) {
            let qtnSpecs = '';
            qtnSpecs = ENTQuiz.AddImageChoices.getSpecsInfoOf(qtnItem);
            return {
                Specs: qtnSpecs
            };
        },
        getSpecsInfoOf: function (qtnItem) {
            let specsPlaceHolder = $(qtnItem).find(".specsPlaceHolder");
            let strSpecs = '';

            //ImageChoices
            let qtnId = $(qtnItem).data("qtnid");
            let qtnImageChoices = $(specsPlaceHolder).find('[data-fieldtype]="QtnImageChoices"');
            if (qtnImageChoices != undefined && qtnImageChoices.length > 0) {
                if (qtnImageChoices[0].files != undefined && qtnImageChoices[0].files.length > 0) {
                    try {
                        strSpecs += '';
                        for (let f = 0; f < qtnImageChoices[0].files.length; f++) {
                            (function (qtnId, fileIdx, fileCtlFile) {
                                ENTQuiz.AddImageChoices.ImageFiles.push({
                                    QuestionId: qtnId,
                                    FileName: fileCtlFile.name,
                                    FileContentAsString: '',
                                    //Size: fileCtlFile.size,
                                    FileIdx: fileIdx,
                                });

                                let reader = new FileReader();
                                ENTQuiz.AddImageChoices.ImageFileReaders.push({
                                    reader: reader,
                                    isLoaded: false,
                                    File, fileCtlFile,
                                    QuestionId: qtnId,
                                    FileIdx: fileIdx,
                                });
                                reader.onload = function () {
                                    let fileItem = $.grep(ENTQuiz.AddImageChoices.ImageFiles, function (file) {
                                        return file.QuestionId == qtnId && file.FileIdx == fileIdx;
                                    });
                                    let fileReaderItem = $.grep(ENTQuiz.AddImageChoices.ImageFileReaders, function (file) {
                                        return file.QuestionId == qtnId && file.FileIdx == fileIdx;
                                    });
                                    fileItem[0].FileContentAsString = reader.result.toString();
                                    fileReaderItem[0].isLoaded = true;
                                    ENTQuiz.AddImageChoices.saveQuizWithFiles();
                                }
                            })(qtnId, f, qtnImageChoices[0].files[f]);
                        }
                    }
                    catch (ex) {
                        console.log(ex);
                        this.isValidData = false;
                        console.log("Image files missing");
                    }
                } else {
                    this.isValidData = false;
                    console.log("Image files missing");
                }
            }
            else {
                this.isValidData = false;
                console.log("Image files missing");
            }

            return '{' + strSpecs + '}';
        },
        ImageFileReaders: [],
        ImageFiles: [],

    };
})();

$(function () {

    let inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
    if (inDesignMode == "1") {
        $(".entQuizContainer").hide();
    }
    else {
        $(".entQuizContainer").show();
        ENTQuiz.AddImageChoices.apiPath = ENTQuiz.Common.webapiBaseUrl + '/Quiz';
        ENTQuiz.AddImageChoices.initializePage();
    }
});