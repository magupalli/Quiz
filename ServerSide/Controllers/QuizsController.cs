using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace ENTHubQuiz.QuizAPI.Controllers
{

    [Authorize]
    [RoutePrefix("api/Quiz")]
    puclic class QuizsController : ApiController
    {

        [Route("getAdmins")]
        public IHttpActionResult GetAdminsList()
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var admins = new List<Admin>();
            try
            {
                admins = QuizDBHelper.GetAdmins();
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {

            }

            return Ok(admins.ToList());
        }


        [Route("getAdmin")]
        public IHttpActionResult GetAdmin(int adminId)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            Admin admin = null;
            try
            {
                admin = QuizDBHelper.GetAdmin(adminId);
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                throw ex;

            }

            return Ok(admin);
        }

        [Route("getQuizs")]
        public IHttpActionResult GetQuizsList(string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var quizs = new List<Quiz>();
            try
            {
                quizs = QuizDBHelper.GetQuizs(absolutePath);
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {

            }

            return Ok(quizs.OrderByDescending(t => t.ID).ToList());
        }

        [Route("getAllQuizs")]
        public IHttpActionResult GetAllQuizsList()
        {
            //var currentLoginName = UserHelper.CurrentUserName;
            var quizs = new List<Quiz>();
            try
            {
                quizs = QuizDBHelper.GetAllQuizs();
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {

            }

            return Ok(quizs.OrderByDescending(t => t.ID).ToList());
        }

        [Route("getActiveQuiz")]
        public IHttpActionResult GetActiveQuiz(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var quiz = new Quiz();
            try
            {
                quiz = QuizDBHelper.GetActiveQuiz(quizId, absolutePath);
            }
            catch (Exception ex)
            {

            }

            return Ok(quiz);
        }

        [Route("getActiveQuizPreview")]
        public IHttpActionResult GetActiveQuizPreview(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var quiz = new Quiz();
            try
            {
                quiz = QuizDBHelper.GetActiveQuizPreview(quizId, absolutePath);
            }
            catch (Exception ex)
            {

            }

            return Ok(quiz);
        }

        [Route("getActiveQuizForDialog")]
        public IHttpActionResult GetActiveQuizForDialog(int quizId)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var quiz = new Quiz();
            try
            {
                quiz = QuizDBHelper.GetActiveQuizForDialog(quizId);
            }
            catch (Exception ex)
            {

            }

            return Ok(quiz);
        }

        [Route("getQuizResponses")]
        public IHttpActionResult GetQuizResponses(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var quizResult = new QuizResult();
            var quizResultOnly = new QuizResult();
            try
            {
                quizResult = QuizDBHelper.GetQuizResponses(quizId, absolutePath);
                if (quizResult.quiz != null)
                {
                    quizResultOnly.quiz = quizResult.quiz;
                    quizResultOnly.QuizQuestionAllResponses = new List<QuizQuestionResponse>();
                    foreach (var item in quizResult.quizReponses)
                    {
                        item.DeserialiseResponse();
                        quizResultOnly.QuizQuestionAllResponses.AddRange(item.QuizQuestionResponses);
                    }
                }
            }

            catch (UnauthorizedAccessException ex)
            {
                throw ex;

            }
            catch (Exception ex)
            {

            }

            return Ok(quizResultOnly);
        }



        [Route("getQuizResponsesByQuestion")]
        public IHttpActionResult GetQuizResponsesByQuestion(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var quizResult = new QuizResult();
            try
            {
                quizResult = QuizDBHelper.GetQuizResponses(quizId, absolutePath);
                if (quizResult.quiz != null)
                {
                    quizResult.QuizQuestionAllResponses = new List<QuizQuestionResponse>();
                    foreach (var item in quizResult.quizReponses)
                    {
                        item.DeserialiseResponse();
                        quizResult.QuizQuestionAllResponses.AddRange(item.QuizQuestionResponses);
                    }
                }
            }

            catch (UnauthorizedAccessException ex)
            {
                throw ex;

            }
            catch (Exception ex)
            {

            }

            return Ok(quizResult);
        }


        [Route("getQuizResponsesByPerson")]
        public IHttpActionResult GetQuizResponsesByPerson(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var quizResult = new QuizResult();
            try
            {
                quizResult = QuizDBHelper.GetQuizResponses(quizId, absolutePath);
                if (quizResult.quiz != null)
                {
                    foreach (var item in quizResult.quizReponses)
                    {
                        item.DeserialiseResponse();
                    }

                    var lstEmpInfo = new List<Employee>();
                    lstEmpInfo = ERPDBHelper.GetEmpInfo_Names();
                    for(int i=0;i < quizResult.quizReponses.Count; i++){
                        var username = quizResult.quizReponses[i].Username;
                        var emp = lstEmpInfo.Where(emp=>emp.LoginName.ToLower().Trim() == username.ToLower()).FirstOrDefault();
                        if(emp!=null){
                            quizResult.quizReponses[i].DisplayName = emp.DisplayName;
                        }
                    }
                }
            }

            catch (UnauthorizedAccessException ex)
            {
                throw ex;

            }
            catch (Exception ex)
            {

            }

            return Ok(quizResult);
        }


        [Route("getQuizResponse")]
        public IHttpActionResult GetQuizResponse(int quizId, int responseId, string absolutePath, bool edit = false)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            QuizResult quizResult = = null;
            try
            {
                quizResult = QuizDBHelper.GetQuizResponse(quizId, responseId, edit, currentLoginName, absolutePath);

            }
            catch (Exception ex)
            {

            }

            return Ok(quizResult);
        }


        [Route("getQuizResponseOnly")]
        public IHttpActionResult GetQuizResponseOnly(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            QuizResult quizResult = = null;
            try
            {
                quizResult = QuizDBHelper.GetQuizResponseOnly(quizId, currentLoginName, absolutePath);

            }
            catch (Exception ex)
            {

            }

            return Ok(quizResult);
        }



        [Route("getResponseFile")]
        public IHttpActionResult GetResponseFile(int fileId, int quizId, int responseId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            FileInfoViewModel fileInfo = null;
            try
            {
                fileInfo = QuizDBHelper.GetResponseFile(fileId, quizId, responseId, currentLoginName, absolutePath);

                var result = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.OK)
                {
                    Content = new System.Net.Http.ByteArrayContent(fileInfo.FileContentAsBytes, 0, fileInfo.FileContentAsBytes.Length)
                };

                result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
                {
                    FileName = fileInfo.FileName
                };
                result.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

                IHttpActionResult response = ResponseMessage(result);

                return response;
            }
            catch (Exception ex)
            {

            }

            return null;
        }

        [Route("submitQuizResponse")]
        [HttpPost]
        public IHttpActionResult SubmitQuizResponse(QuizResponse quizResponse)
        {
            var currentLoginName = UserHelper.CurrentUserName;

            try
            {
                quizResponse.Username = currentLoginName;
                quizResponse.SerializeResponse();
                QuizDBHelper.SubmitQuizResponse(quizResponse);
                //GeneralHelper.SendMail();

            }
            catch (CustomException ex)
            {
                throw ex;
            }

            catch (Exception ex)
            {

            }

            return Ok();
        }

        [Route("createQuiz")]
        [HttpPost]
        public IHttpActionResult CreateQuiz(Quiz quiz, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;

            try
            {

                QuizDBHelper.CreateQuiz(quiz, absolutePath);
                //GeneralHelper.SendMail();

            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }

            catch (Exception ex)
            {

            }

            return Ok();
        }

        [Route("deleteQuiz")]
        [HttpPost]
        public IHttpActionResult DeleteQuiz(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;

            try
            {

                QuizDBHelper.DeleteQuiz(quizId, absolutePath);
                //GeneralHelper.SendMail();

            }
            catch (CustomException ex)
            {
                throw ex;
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                //log.Error(ex.Message + " -- " + ex.StackTrace);
            }

            return Ok();
        }

        [Route("publishQuiz")]
        [HttpPost]
        public IHttpActionResult PublishQuiz(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;

            try
            {

                QuizDBHelper.PublishQuiz(quizId, absolutePath);
                //GeneralHelper.SendMail();

            }
            catch (CustomException ex)
            {
                throw ex;
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                //log.Error(ex.Message + " -- " + ex.StackTrace);
            }

            return Ok();
        }



        [Route("updateQuizImageChoices")]
        [HttpPost]
        public IHttpActionResult UpdateQuizImageChoices(Quiz quiz, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;

            try
            {

                QuizDBHelper.UpdateQuizImageChoices(quiz, absolutePath);
                //GeneralHelper.SendMail();

            }
            catch (CustomException ex)
            {
                throw ex;
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                //log.Error(ex.Message + " -- " + ex.StackTrace);
            }

            return Ok();
        }


        [Route("getQuiz_Edit")]
        public IHttpActionResult GetQuiz_Edit(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            Quiz quiz = null;
            try
            {
                quiz = QuizDBHelper.GetQuiz(quizId, absolutePath, true);
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;

            }
            catch (Exception ex)
            {

            }

            return Ok(quiz);
        }


        [Route("getQuiz_View")]
        public IHttpActionResult GetQuiz_View(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            Quiz quiz = null;
            try
            {
                quiz = QuizDBHelper.GetQuiz(quizId, absolutePath, false);
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;

            }
            catch (Exception ex)
            {

            }

            return Ok(quiz);
        }


        [Route("getEmployees")]
        public IHttpActionResult GetEmployeesList(string searchText)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var employees = new List<Employee>();
            try
            {
                employees = UserHelper.getEmployees(searchText);
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {

            }

            return Ok(employees.ToList());
        }

        [Route("createAdmin")]
        [HttpPost]
        public IHttpActionResult CreateAdmin(Admin admin)
        {
            var currentLoginName = UserHelper.CurrentUserName;

            try
            {
                var empInfo = UserHelper.getEmployee(admin.LoginName);
                admin.DisplayName = empInfo.DisplayName;
                admin.Email = emoInfo.email;
                QuizDBHelper.CreateAdmin(admin);
                //GeneralHelper.SendMail();

            }

            catch (CustomException ex)
            {
                throw ex;
            }
            catch (System.Data.DuplicateNameException ex)
            {
                throw ex;
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }

            catch (Exception ex)
            {
                throw ex;
            }

            return Ok();
        }

        [Route("changeAdminStatus")]
        [HttpPost]
        public IHttpActionResult ChangeAdminStatus(Admin admin)
        {
            var currentLoginName = UserHelper.CurrentUserName;

            try
            {

                QuizDBHelper.ChangeAdminStatus(admin);
                //GeneralHelper.SendMail();

            }

            catch (CustomException ex)
            {
                throw ex;
            }
            catch (System.Data.DuplicateNameException ex)
            {
                throw ex;
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }

            catch (Exception ex)
            {
                throw ex;
            }

            return Ok();
        }


        [Route("getQuizResponses_Export")]
        [HttpGet]
        public IHttpActionResult GetQuizResponses_Export(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var quizResult = new QuizResult();
            try
            {
                quizResult = QuizDBHelper.GetQuizResponses(quizId, absolutePath);

            }

            catch (UnauthorizedAccessException ex)
            {
                throw ex;

            }
            catch (Exception ex)
            {

            }

            var oExcel = ExcelBuilder.GetQuizResponsesExcelPackage(quizResult);
            var memStream = new MemoryStream(oExcel.GetAsByteArray());

            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
            MediaTypeHeaderValue mediaType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            resppnse.Content = new StreamContent(memStream);
            response.Content.Headers.ContentType = mediaType;
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = "QuizResponsesExport-" + dateTime.Now.ToString("yyyy-MM-dd-HH-mm") + ".xlsx";

            return response;
        }


        [Route("closeQuiz")]
        [HttpPost]
        public IHttpActionResult CloseQuiz(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;

            try
            {

                QuizDBHelper.CloseQuiz(quizId, absolutePath);
                //GeneralHelper.SendMail();

            }
            catch (CustomException ex)
            {
                throw ex;
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                //log.Error(ex.Message + " -- " + ex.StackTrace);
            }

            return Ok();
        }

        [Route("reOpenQuiz")]
        [HttpPost]
        public IHttpActionResult ReOpenQuiz(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;

            try
            {

                QuizDBHelper.ReOpenQuiz(quizId, absolutePath);
                //GeneralHelper.SendMail();

            }
            catch (CustomException ex)
            {
                throw ex;
            }
            catch (UnauthorizedAccessException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                //log.Error(ex.Message + " -- " + ex.StackTrace);
            }

            return Ok();
        }


        [Route("getDebugInfo")]
        public IHttpActionResult GetDebugInfo(int quizId, string absolutePath)
        {
            var currentLoginName = UserHelper.CurrentUserName;
            var debugInfo = ""
            try
            {
                debugInfo = QuizDBHelper.GetDebugInfo(quizId, absolutePath);
            }
            catch (Exception ex)
            {
                debugInfo = ex.StackTrace + " -- " + ex.Message;
            }

            return Ok(debugInfo);
        }


    }
}
