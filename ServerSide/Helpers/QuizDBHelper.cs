public static class ProcedureNames
{
    public const string QueryForCloseQuiz = "[dbo].usp_CloseQuiz";
    public const string QueryForReOpenQuiz = "[dbo].usp_ReOpenQuiz";
    public const string QueryForChangeAdminStatus = "[dbo].usp_ChangeAdminStatus";
    public const string QueryForCreateAdmin = "[dbo].usp_CreateAdmin";
    public const string QueryForGetAdmins = "[dbo].usp_GetAdmins";
    public const string QueryForGetAdmin = "[dbo].usp_GetAdmin";
    public const string QueryForGetQuizs = "[dbo].usp_GetQuizs";
    public const string QueryForGetAllQuizs = "[dbo].usp_GetAllQuizs";
    public const string QueryForGetMyResponses = "[dbo].usp_GetMyResponses";
    public const string QueryForGetQuizResponses = "[dbo].usp_GetQuizResponses";
    public const string QueryForGetQuizResponse = "[dbo].usp_GetQuizResponse";
    public const string QueryForGetQuizResponseOnly = "[dbo].usp_GetQuizResponseOnly";
    public const string QueryForCreateQuiz = "[dbo].usp_CreateQuiz";
    public const string QueryForDeleteQuiz = "[dbo].usp_DeleteQuiz";
    public const string QueryForPublishQuiz = "[dbo].usp_PublishQuiz";

    public const string QueryForUpdateQuizImageChoices = "[dbo].usp_UpdateQuizImageChoices";
    public const string QueryForSubmitQuizResponse = "[dbo].usp_SubmitQuizResponse";
    public const string QueryForActiveQuiz = "[dbo].usp_GetActiveQuiz";
    public const string QueryForActiveQuizForDialog = "[dbo].usp_AGetctiveQuizActiveQuizForDialog";
    public const string QueryForActiveQuizForPreview = "[dbo].usp_GetActiveQuizPreview";
    public const string QueryForGetQuiz = "[dbo].usp_GetQuiz";
    public const string QueryForGetResponseFile = "[dbo].usp_GetResponseFile";
}

public class QuizDBHelper
{

    public static bool ChangeAdminStatus(Admin admin)
    {
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForChangeAdminStatus;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@adminId", admin.ID);
                    cmd.Parameters.AddWithValue("@status", admin.IsActive);
                    cmd.Parameters.AddWithValue("@modifiedBy", UserHelper.CurrentUserName);
                    cmd.ExecuteNonQuery();

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException)
                {
                    if ((ex as SqlException).Number == 50001)
                        throw new UnauthorizedAccessException();
                    else if ((ex as SqlException).Number == 50002)
                        throw new CustomException("User already added as Admin for given department");

                    else if ((ex as SqlException).Number == 50003)
                        throw new CustomException("Invalid admin info provided");
                }
                throw ex;

            }
        }
        return true;
    }

    public static bool CreateAdmin(Admin admin)
    {
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForCreateAdmin;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@username", admin.ID);
                    cmd.Parameters.AddWithValue("@email", admin.Email);
                    cmd.Parameters.AddWithValue("@displayname", admin.DisplayName);
                    cmd.Parameters.AddWithValue("@deptId", admin.DeptId);
                    cmd.Parameters.AddWithValue("@createdBy", UserHelper.CurrentUserName);

                    cmd.ExecuteNonQuery();

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException)
                {
                    if ((ex as SqlException).Number == 50001)
                        throw new UnauthorizedAccessException();
                    else if ((ex as SqlException).Number == 50002)
                        throw new CustomException("User already added as Admin for given department");

                }
                throw ex;

            }
        }
        return true;
    }

    public static List<Admin> GetAdmins()
    {
        var lstItems = new List<Admin>();
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetAdmins;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                lstItems.Add(new Admin
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    IDText = (rdrItems["Id"] != DBNull.Value) ? rdrItems["Id"].ToString() : "",
                                    DeptId = (rdrItems["DeptId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DeptId"].ToString()) : 0,
                                    DeptText = (rdrItems["DeptText"] != DBNull.Value) ? rdrItems["DeptText"].ToString() : "",
                                    DisplayName = (rdrItems["DisplayName"] != DBNull.Value) ? rdrItems["DisplayName"].ToString() : "",
                                    Email = (rdrItems["Email"] != DBNull.Value) ? rdrItems["Email"].ToString() : "",
                                    LoginName = (rdrItems["LoginName"] != DBNull.Value) ? rdrItems["LoginName"].ToString() : "",
                                    IsActive = (rdrItems["IsActive"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["IsActive"].ToString()) : false,

                                });
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException && (ex as SqlException).Number == 50001)
                {
                    throw new UnauthorizedAccessException();
                }
                throw ex;

            }
        }
        return lstItems;
    }

    public static Admin GetAdmin(int adminId)
    {
        Admin admin = null;
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetAdmin;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@adminId", adminId);
                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                admin = new Admin
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    IDText = (rdrItems["Id"] != DBNull.Value) ? rdrItems["Id"].ToString() : "",
                                    DeptId = (rdrItems["DeptId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DeptId"].ToString()) : 0,
                                    DeptText = (rdrItems["DeptText"] != DBNull.Value) ? rdrItems["DeptText"].ToString() : "",
                                    DisplayName = (rdrItems["DisplayName"] != DBNull.Value) ? rdrItems["DisplayName"].ToString() : "",
                                    Email = (rdrItems["Email"] != DBNull.Value) ? rdrItems["Email"].ToString() : "",
                                    LoginName = (rdrItems["LoginName"] != DBNull.Value) ? rdrItems["LoginName"].ToString() : "",
                                    IsActive = (rdrItems["IsActive"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["IsActive"].ToString()) : false,

                                };
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException)
                {
                    if ((ex as SqlException).Number == 50001)
                        throw new UnauthorizedAccessException();
                }
                throw ex;

            }
        }
        return admin;
    }


    public static bool CloseQuiz(int quizId, string absolutePath)
    {
        try
        {
            return QuizAction(ProcedureNames.QueryForCloseQuiz, quizId, absolutePath)
        }
        catch (Exception ex)
        {

            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }
            if (ex is SqlException)
            {
                if ((ex as SqlException).Number == 50005)
                    throw new CustomException("Invalid quiz selected");
                if ((ex as SqlException).Number == 50001)
                    throw new UnauthorizedAccessException();
            }
            throw ex;

        }
    }
    public static bool ReOpenQuiz(int quizId, string absolutePath)
    {
        try
        {
            return QuizAction(ProcedureNames.QueryForReOpenQuiz, quizId, absolutePath)
        }
        catch (Exception ex)
        {

            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }
            if (ex is SqlException)
            {
                if ((ex as SqlException).Number == 50005)
                    throw new CustomException("Invalid quiz selected");
                if ((ex as SqlException).Number == 50001)
                    throw new UnauthorizedAccessException();
            }
            throw ex;

        }
    }

    public static List<Quiz> GetAllQuizs()
    {
        var lstItems = new List<Quiz>();
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetAllQuizs;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                lstItems.Add(new Quiz
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    IDText = (rdrItems["Id"] != DBNull.Value) ? rdrItems["Id"].ToString() : " - ",
                                    Title = (rdrItems["Title"] != DBNull.Value) ? rdrItems["Title"].ToString() : "",
                                    Description = (rdrItems["Description"] != DBNull.Value) ? rdrItems["Description"].ToString() : "",
                                    Title_En = (rdrItems["Title_En"] != DBNull.Value) ? rdrItems["Title_En"].ToString() : "",
                                    Description_En = (rdrItems["Description_En"] != DBNull.Value) ? rdrItems["Description_En"].ToString() : "",
                                    Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : -1,
                                    Status = (rdrItems["Status"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Status"].ToString()) : -1,
                                    RequestingDirectorate = (rdrItems["ReqDirectorateID"] != DBNull.Value) ? Convert.ToInt32(rdrItems["ReqDirectorateID"].ToString()) : 0,
                                    Classification = (rdrItems["ClassificationID"] != DBNull.Value) ? Convert.ToInt32(rdrItems["ClassificationID"].ToString()) : 0,

                                    ModifiedBy = (rdrItems["ModifiedBy"] != DBNull.Value) ? rdrItems["ModifiedBy"].ToString() : "",
                                    ModifiedDate = Convert.ToDateTime(rdrItems["ModifiedDate"].ToString()) : 0,

                                    IsActive = (rdrItems["IsActive"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["IsActive"].ToString()) : false,

                                });
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException)
                {
                    if ((ex as SqlException).Number == 50001)
                        throw new UnauthorizedAccessException();
                }
                throw ex;

            }
        }
        return lstItems;
    }

    public static List<Quiz> GetQuizs(string absolutePath)
    {
        var lstItems = new List<Quiz>();
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetQuizs;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                lstItems.Add(new Quiz
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    IDText = (rdrItems["Id"] != DBNull.Value) ? rdrItems["Id"].ToString() : " - ",
                                    Title = (rdrItems["Title"] != DBNull.Value) ? rdrItems["Title"].ToString() : "",
                                    Description = (rdrItems["Description"] != DBNull.Value) ? rdrItems["Description"].ToString() : "",
                                    Title_En = (rdrItems["Title_En"] != DBNull.Value) ? rdrItems["Title_En"].ToString() : "",
                                    Description_En = (rdrItems["Description_En"] != DBNull.Value) ? rdrItems["Description_En"].ToString() : "",
                                    Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : -1,
                                    Status = (rdrItems["Status"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Status"].ToString()) : -1,
                                    RequestingDirectorate = (rdrItems["ReqDirectorateID"] != DBNull.Value) ? Convert.ToInt32(rdrItems["ReqDirectorateID"].ToString()) : 0,
                                    Classification = (rdrItems["ClassificationID"] != DBNull.Value) ? Convert.ToInt32(rdrItems["ClassificationID"].ToString()) : 0,

                                    ModifiedBy = (rdrItems["ModifiedBy"] != DBNull.Value) ? rdrItems["ModifiedBy"].ToString() : "",
                                    ModifiedDate = Convert.ToDateTime(rdrItems["ModifiedDate"].ToString()) : 0,

                                    IsActive = (rdrItems["IsActive"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["IsActive"].ToString()) : false,

                                });
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException)
                {
                    if ((ex as SqlException).Number == 50001)
                        throw new UnauthorizedAccessException();
                }
                throw ex;

            }
        }
        return lstItems;
    }

    public static QuizResult GetQuizResponse(int quizId, int responseId, bool edit, string loginname, string absolutePath)
    {
        QuizResult quizResult = new QuizResult();
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetQuizResponse;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@responseId", responseId);
                    cmd.Parameters.AddWithValue("@edit", edit);
                    cmd.Parameters.AddWithValue("@username", loginname);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                quizResult.quiz = new Quiz
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    Title = (rdrItems["Title"] != DBNull.Value) ? rdrItems["Title"].ToString() : " - ",
                                    Description = (rdrItems["Description"] != DBNull.Value) ? rdrItems["Description"].ToString() : " - ",
                                    Title_En = (rdrItems["Title_En"] != DBNull.Value) ? rdrItems["Title_En"].ToString() : " - ",
                                    Description_En = (rdrItems["Description_En"] != DBNull.Value) ? rdrItems["Description_En"].ToString() : " - ",
                                    Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : 0,
                                    PassScore = (rdrItems["PassScore"] != DBNull.Value) ? Convert.ToInt32(rdrItems["PassScore"].ToString()) : 0,
                                    AllowViewResponse = (rdrItems["AllowViewResponse"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["AllowViewResponse"].ToString()) : false,
                                    AllowViewAnswers = (rdrItems["AllowViewAnswers"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["AllowViewAnswers"].ToString()) : false,

                                };
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }

                        if (quizResult.quiz != null)
                        {
                            quizResult.quiz.Questions = new List<QuizQuestion>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quizResult.quiz.Questions.Add(new QuizQuestion
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        DataTypeID = (rdrItems["DataType"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DataType"].ToString()) : 0,
                                        Question = (rdrItems["Question"] != DBNull.Value) ? rdrItems["Question"].ToString() : " - ",
                                        Question_En = (rdrItems["Question_En"] != DBNull.Value) ? rdrItems["Question_En"].ToString() : " - ",
                                        Specs = (rdrItems["Specs"] != DBNull.Value) ? rdrItems["Specs"].ToString() : "",
                                        ValidationSpecs = (rdrItems["ValidationSpecs"] != DBNull.Value) ? rdrItems["ValidationSpecs"].ToString() : "",
                                        Answer = (rdrItems["Answer"] != DBNull.Value) ? rdrItems["Answer"].ToString() : "",
                                        Order = (rdrItems["Order"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Order"].ToString()) : 0,

                                    });
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }

                            quizResult.quiz.ImageChoices = new List<FileInfoViewModel>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quizResult.quiz.ImageChoices.Add(new FileInfoViewModel
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        QuestionId = (rdrItems["QuestionId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuestionId"].ToString()) : 0,
                                        FileContentAsBytes = (byte[])(rdrItems["Contents"]),
                                        FileName = (rdrItems["FileName"] != DBNull.Value) ? rdrItems["FileName"].ToString() : " - ",
                                        FileIdx = (rdrItems["FileIdx"] != DBNull.Value) ? Convert.ToInt32(rdrItems["FileIdx"].ToString()) : 0,

                                    });
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }

                            quizResult.quizResponses = new List<QuizResponse>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    var quizResponse = new QuizResponse
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        QuizID = (rdrItems["QuizId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuizId"].ToString()) : 0,
                                        Response = (rdrItems["Response"] != DBNull.Value) ? rdrItems["Response"].ToString() : "",
                                        Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : (byte)0,

                                    };
                                    quizResponse.DeserializeResponse();
                                    quizResult.quizResponse.Add(quizResponse);
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }


                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }

                throw ex;

            }
        }
        return quizResult;
    }


    public static QuizResult GetQuizResponseOnly(int quizId, string loginname, string absolutePath)
    {
        QuizResult quizResult = new QuizResult();
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetQuizResponseOnly;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@username", loginname);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    using (var rdrItems = cmd.ExecuteReader())
                    {

                        quizResult.quizResponses = new List<QuizResponse>();
                        rdrItems.NextResult();

                        while (rdrItems.Read())
                        {
                            try
                            {
                                var quizResponse = new QuizResponse
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    QuizID = (rdrItems["QuizId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuizId"].ToString()) : 0,
                                    Response = (rdrItems["Response"] != DBNull.Value) ? rdrItems["Response"].ToString() : "",
                                    Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : (byte)0,

                                };
                                quizResponse.DeserializeResponse();
                                quizResult.quizResponse.Add(quizResponse);
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }

                throw ex;

            }
        }
        return quizResult;
    }


    public static FileInfoViewModel GetResponseFile(int fileId, int quizId, int responseId, string loginname, string absolutePath)
    {
        FileInfoViewModel fileInfo = null;
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetResponseFile;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@fileId", fileId);
                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@responseId", responseId);
                    cmd.Parameters.AddWithValue("@username", loginname);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                fileInfo = new FileInfoViewModel
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    QuestionId = (rdrItems["QuestionId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuestionId"].ToString()) : 0,
                                    FileContentAsBytes = (byte[])(rdrItems["Contents"]),
                                    ResponseId = (rdrItems["ResponseId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["ResponseId"].ToString()) : 0,
                                    FileName = (rdrItems["FileName"] != DBNull.Value) ? rdrItems["FileName"].ToString() : "",

                                };
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }

                throw ex;

            }
        }
        return fileInfo;
    }

    public static bool UpdateQuizImageChoices(Quiz quiz, string absolutePath)
    {
        var tblImageChoices = GetImageChoicesTable(quiz);
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForUpdateQuizImageChoices;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    cmd.Parameters.AddWithValue("@ImageChoices_Table", tblImageChoices);

                    cmd.ExecuteNonQuery()

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException)
                {
                    if ((ex as SqlException).Number == 50001)
                        throw new UnauthorizedAccessException();
                }
                throw ex;

            }
        }
        return true;
    }


    public static bool SubmitQuizResponse(QuizResponse quizResponse)
    {
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                var tblFiles = GetResponseFilesTable(quizResponse);

                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForSubmitQuizResponse;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@responseId", quizResponse.ID);
                    cmd.Parameters.AddWithValue("@quizId", quizResponse.QuizID);
                    cmd.Parameters.AddWithValue("@DepartmentID", quizResponse.DepartmentId);
                    cmd.Parameters.AddWithValue("@username", quizResponse.Username);
                    cmd.Parameters.AddWithValue("@language", quizResponse.Language);
                    cmd.Parameters.AddWithValue("@response", quizResponse.Response);
                    //cmd.Parameters.AddWithValue("@Files_Table", tblFiles);
                    cmd.Parameters.AddWithValue("@responseStatus", quizResponse.ResponseStatus);

                    cmd.ExecuteNonQuery()

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException)
                {
                    if ((ex as SqlException).Number == 50004)
                        throw new CustomException("Response already submitted. Multiple responses not allowed on this quiz");
                }
                throw ex;

            }
        }
        return true;
    }

    public static bool CreateQuiz(Quiz quiz, string absolutePath)
    {
        var tblQuestions = GetQuestionsTable(quiz);

        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {

                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForCreateQuiz;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quiz.ID);
                    cmd.Parameters.AddWithValue("@Title", (quiz.Language == 1 || quiz.Language == 3 ? quiz.Title : ""));
                    cmd.Parameters.AddWithValue("@Title_En", (quiz.Language == 2 || quiz.Language == 3 ? quiz.Title_En : ""));
                    cmd.Parameters.AddWithValue("@Description", (quiz.Language == 1 || quiz.Language == 3 ? quiz.Description : ""));
                    cmd.Parameters.AddWithValue("@Description_En", (quiz.Language == 1 || quiz.Language == 3 ? quiz.Description_En : ""));
                    cmd.Parameters.AddWithValue("@RequestingDirectorate", quiz.RequestingDirectorate);
                    cmd.Parameters.AddWithValue("@Classification", quiz.Classification);
                    cmd.Parameters.AddWithValue("@PassScore", quiz.PassScore);
                    cmd.Parameters.AddWithValue("@AllowViewResponse", quiz.AllowViewResponse);
                    cmd.Parameters.AddWithValue("@AllowViewAnswers", quiz.AllowViewAnswers);
                    cmd.Parameters.AddWithValue("@MessageId", quiz.MessageId);
                    cmd.Parameters.AddWithValue("@HasWelcomeMessage", quiz.HasWelcomeMessage);
                    cmd.Parameters.AddWithValue("@HasThankyouMessage", quiz.HasThankyouMessage);
                    cmd.Parameters.AddWithValue("@RandomOrderQuestions", quiz.RandomOrderQuestions);
                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    cmd.Parameters.AddWithValue("@language", quiz.Language);
                    cmd.Parameters.AddWithValue("@quizStatus", quiz.Status);
                    cmd.Parameters.AddWithValue("@Questions_Table", tblQuestions);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);

                    cmd.ExecuteNonQuery()

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException)
                {
                    if ((ex as SqlException).Number == 50001)
                        throw new UnauthorizedAccessException();
                }
                throw ex;

            }
        }
        return true;
    }

    public static bool DeleteQuiz(int quizId, string absolutePath)
    {
        try
        {
            return QuizAction(ProcedureNames.QueryForDeleteQuiz, quizId, absolutePath)
        }
        catch (Exception ex)
        {

            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }
            if (ex is SqlException)
            {
                if ((ex as SqlException).Number == 50005)
                    throw new CustomException("Invalid quiz selected");
                if ((ex as SqlException).Number == 50001)
                    throw new UnauthorizedAccessException();
            }
            throw ex;

        }
    }
    public static bool PublishQuiz(int quizId, string absolutePath)
    {
        try
        {
            return QuizAction(ProcedureNames.QueryForPublishQuiz, quizId, absolutePath)
        }
        catch (Exception ex)
        {

            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }
            if (ex is SqlException)
            {
                if ((ex as SqlException).Number == 50005)
                    throw new CustomException("Invalid quiz selected");
                if ((ex as SqlException).Number == 50001)
                    throw new UnauthorizedAccessException();
            }
            throw ex;

        }
    }
    public static bool QuizAction(string storedProcName, int quizId, string absolutePath)
    {
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {

                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = storedProcName;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);

                    cmd.ExecuteNonQuery()

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException)
                {
                    if ((ex as SqlException).Number == 50001)
                        throw new UnauthorizedAccessException();
                }
                throw ex;

            }
        }
        return true;
    }

    public static DataTable GetImageChoicesTable(Quiz quiz)
    {
        var dtFiles = new DataTable();
        dtFiles.Columns.Add("Id", typeof(int));
        dtFiles.Columns.Add("FileName", typeof(string));
        dtFiles.Columns.Add("Contents", typeof(byte[]));
        dtFiles.Columns.Add("Size", typeof(int));
        dtFiles.Columns.Add("QuestionId", typeof(int));
        dtFiles.Columns.Add("FileIdx", typeof(int));
        if (quiz.ImageChoices != null && quiz.ImageChoices.Count > 0)
        {
            foreach (var fileInfo in quiz.ImageChoices)
            {
                var fileContentAsBase64 = fileInfo.FileContentAsString.Substring(fileInfo.FileContentAsString.IndexOf(",") + 1);
                var bytes = Convert.FromBase64String(fileContentAsBase64);

                var drFileInfo = dtFiles.NewRow();
                drFileInfo["Id"] = 0;
                drFileInfo["FileName"] = fileInfo.FileName;
                drFileInfo["Contents"] = bytes;
                drFileInfo["Size"] = fileInfo.Size;
                drFileInfo["QuestionId"] = fileInfo.QuestionId;
                drFileInfo["FileIdx"] = fileInfo.FileIdx;
                dtFiles.Rows.Add(drFileInfo);
            }
        }
        return dtFiles;
    }

    public static Quiz GetQuiz(int quizId, string absolutePath, bool edit)
    {
        Quiz quiz = null;
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetQuiz;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@edit", edit);
                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                quiz = new Quiz
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    Title = (rdrItems["Title"] != DBNull.Value) ? rdrItems["Title"].ToString() : " - ",
                                    Title_En = (rdrItems["Title_En"] != DBNull.Value) ? rdrItems["Title_En"].ToString() : " - ",
                                    Description = (rdrItems["Description"] != DBNull.Value) ? rdrItems["Description"].ToString() : " - ",
                                    Description_En = (rdrItems["Description_En"] != DBNull.Value) ? rdrItems["Description_En"].ToString() : " - ",
                                    Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : 0,
                                    RequestingDirectorate = (rdrItems["ReqDirectorateID"] != DBNull.Value) ? Convert.ToInt32(rdrItems["ReqDirectorateID"].ToString()) : 0,
                                    Classification = (rdrItems["ClassificationID"] != DBNull.Value) ? Convert.ToInt32(rdrItems["ClassificationID"].ToString()) : 0,
                                    PassScore = (rdrItems["PassScore"] != DBNull.Value) ? Convert.ToInt32(rdrItems["PassScore"].ToString()) : 0,
                                    AllowViewResponse = (rdrItems["AllowViewResponse"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["AllowViewResponse"].ToString()) : true,
                                    AllowViewAnswers = (rdrItems["AllowViewAnswers"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["AllowViewAnswers"].ToString()) : false,
                                    MessageId = (rdrItems["MessageId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["MessageId"].ToString()) : 0,
                                    HasWelcomeMessage = (rdrItems["HasWelcomeMessage"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["HasWelcomeMessage"].ToString()) : false,
                                    HasThankyouMessage = (rdrItems["HasThankyouMessage"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["HasThankyouMessage"].ToString()) : false,
                                    RandomOrderQuestions = (rdrItems["RandomOrderQuestions"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["RandomOrderQuestions"].ToString()) : false,

                                };
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }

                        if (quiz != null)
                        {
                            quiz.Questions = new List<QuizQuestion>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quiz.Questions.Add(new QuizQuestion
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        DataTypeID = (rdrItems["DataType"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DataType"].ToString()) : 0,
                                        Question = (rdrItems["Question"] != DBNull.Value) ? rdrItems["Question"].ToString() : " - ",
                                        Question_En = (rdrItems["Question_En"] != DBNull.Value) ? rdrItems["Question_En"].ToString() : " - ",
                                        Specs = (rdrItems["Specs"] != DBNull.Value) ? rdrItems["Specs"].ToString() : "",
                                        ValidationSpecs = (rdrItems["ValidationSpecs"] != DBNull.Value) ? rdrItems["ValidationSpecs"].ToString() : "",
                                        Answer = (rdrItems["Answer"] != DBNull.Value) ? rdrItems["Answer"].ToString() : "",
                                        ImagesCount = (rdrItems["ImagesCount"] != DBNull.Value) ? Convert.ToInt32(rdrItems["ImagesCount"].ToString()) : 0,
                                        Order = (rdrItems["Order"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Order"].ToString()) : 0,

                                    });
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }
                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException && (ex as SqlException).Number == 50001)
                {
                    throw new UnauthorizedAccessException();
                }

                throw ex;

            }
        }
        return quiz;
    }

    public static DataTable GetQuestionsTable(Quiz quiz)
    {
        var dtQuestions = new DataTable();
        dtQuestions.Columns.Add("Id", typeof(int));
        dtQuestions.Columns.Add("QuizId", typeof(int));
        dtQuestions.Columns.Add("Question", typeof(string));
        dtQuestions.Columns.Add("Question_En", typeof(string));
        dtQuestions.Columns.Add("DataType", typeof(int));
        dtQuestions.Columns.Add("Specs", typeof(string));
        dtQuestions.Columns.Add("ValidationSpecs", typeof(string));
        dtQuestions.Columns.Add("Answer", typeof(string));
        dtQuestions.Columns.Add("Order", typeof(int));

        foreach (var qtn in quiz.Questions)
        {
            var drQuestion = dtQuestions.NewRow();
            drQuestion["Id"] = qtn.ID;
            drQuestion["QuizId"] = quiz.ID;
            drQuestion["Question"] = qtn.Question;
            drQuestion["Question_En"] = qtn.Question_En;
            drQuestion["DataType"] = qtn.DataTypeID;
            drQuestion["Specs"] = qtn.Specs;
            drQuestion["ValidationSpecs"] = qtn.ValidationSpecs;
            drQuestion["Answer"] = qtn.Answer;
            drQuestion["Order"] = qtn.Order;
            dtQuestions.Rows.Add(drQuestion);
        }

        return dtQuestions;
    }

    public static Quiz GetActiveQuiz(int quizId, string absolutePath)
    {
        Quiz quiz = null;
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetActiveQuiz;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                quiz = new Quiz
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    Title = (rdrItems["Title"] != DBNull.Value) ? rdrItems["Title"].ToString() : " - ",
                                    Title_En = (rdrItems["Title_En"] != DBNull.Value) ? rdrItems["Title_En"].ToString() : " - ",
                                    Description = (rdrItems["Description"] != DBNull.Value) ? rdrItems["Description"].ToString() : " - ",
                                    Description_En = (rdrItems["Description_En"] != DBNull.Value) ? rdrItems["Description_En"].ToString() : " - ",
                                    Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : 0,
                                    DepartmentId = (rdrItems["DepartmentId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DepartmentId"].ToString()) : 0,
                                    PassScore = (rdrItems["PassScore"] != DBNull.Value) ? Convert.ToInt32(rdrItems["PassScore"].ToString()) : 0,
                                    AllowViewResponse = (rdrItems["AllowViewResponse"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["AllowViewResponse"].ToString()) : false,
                                    AllowViewAnswers = (rdrItems["AllowViewAnswers"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["AllowViewAnswers"].ToString()) : true,
                                    MessageId = (rdrItems["MessageId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["MessageId"].ToString()) : 0,
                                    HasWelcomeMessage = (rdrItems["HasWelcomeMessage"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["HasWelcomeMessage"].ToString()) : false,
                                    HasThankyouMessage = (rdrItems["HasThankyouMessage"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["HasThankyouMessage"].ToString()) : false,
                                    RandomOrderQuestions = (rdrItems["RandomOrderQuestions"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["RandomOrderQuestions"].ToString()) : false,

                                };
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }

                        if (quiz != null)
                        {
                            quiz.Questions = new List<QuizQuestion>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quiz.Questions.Add(new QuizQuestion
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        DataTypeID = (rdrItems["DataType"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DataType"].ToString()) : 0,
                                        Question = (rdrItems["Question"] != DBNull.Value) ? rdrItems["Question"].ToString() : " - ",
                                        Question_En = (rdrItems["Question_En"] != DBNull.Value) ? rdrItems["Question_En"].ToString() : " - ",
                                        Specs = (rdrItems["Specs"] != DBNull.Value) ? rdrItems["Specs"].ToString() : "",
                                        ValidationSpecs = (rdrItems["ValidationSpecs"] != DBNull.Value) ? rdrItems["ValidationSpecs"].ToString() : "",
                                        Answer = (rdrItems["Answer"] != DBNull.Value) ? rdrItems["Answer"].ToString() : "",
                                        Order = (rdrItems["Order"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Order"].ToString()) : 0,

                                    });
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }

                            quiz.ImageChoices = new List<FileInfoViewModel>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quiz.ImageChoices.Add(new FileInfoViewModel
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        QuestionId = (rdrItems["QuestionId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuestionId"].ToString()) : 0,
                                        FileContentAsBytes = (byte[])(rdrItems["Contents"]),
                                        FileName = (rdrItems["FileName"] != DBNull.Value) ? rdrItems["FileName"].ToString() : "",
                                        FileIdx = (rdrItems["FileIdx"] != DBNull.Value) ? Convert.ToInt32(rdrItems["FileIdx"].ToString()) : 0,

                                    });
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }

                            rdrItems.NextResult();
                            //Fetch User has already Submitted
                            while (rdrItems.Read())
                            {
                                quiz.HasUserAlreadySubmitted = true;
                                quiz.ResponseId= (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                            }
                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }


                throw ex;

            }
        }
        return quiz;
    }

    public static Quiz GetActiveQuizForDialog(int quizId)
    {
        Quiz quiz = null;
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetActiveQuizForDialog;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                quiz = new Quiz
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    
                                };
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }

                        if (quiz != null)
                        {
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                quiz.HasUserAlreadySubmitted = true;
                            }
                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }

                throw ex;

            }
        }
        return quiz;
    }

    public static Quiz GetActiveQuizPreview(int quizId, string absolutePath)
    {
        Quiz quiz = null;
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetActiveQuizPreview;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                quiz = new Quiz
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    Title = (rdrItems["Title"] != DBNull.Value) ? rdrItems["Title"].ToString() : " - ",
                                    Title_En = (rdrItems["Title_En"] != DBNull.Value) ? rdrItems["Title_En"].ToString() : " - ",
                                    Description = (rdrItems["Description"] != DBNull.Value) ? rdrItems["Description"].ToString() : " - ",
                                    Description_En = (rdrItems["Description_En"] != DBNull.Value) ? rdrItems["Description_En"].ToString() : " - ",
                                    Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : 0,
                                    DepartmentId = (rdrItems["DepartmentId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DepartmentId"].ToString()) : 0,
                                    PassScore = (rdrItems["PassScore"] != DBNull.Value) ? Convert.ToInt32(rdrItems["PassScore"].ToString()) : 0,
                                    AllowViewResponse = (rdrItems["AllowViewResponse"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["AllowViewResponse"].ToString()) : false,
                                    AllowViewAnswers = (rdrItems["AllowViewAnswers"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["AllowViewAnswers"].ToString()) : true,
                                    MessageId = (rdrItems["MessageId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["MessageId"].ToString()) : 0,
                                    HasWelcomeMessage = (rdrItems["HasWelcomeMessage"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["HasWelcomeMessage"].ToString()) : false,
                                    HasThankyouMessage = (rdrItems["HasThankyouMessage"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["HasThankyouMessage"].ToString()) : false,
                                    RandomOrderQuestions = (rdrItems["RandomOrderQuestions"] != DBNull.Value) ? Convert.ToBoolean(rdrItems["RandomOrderQuestions"].ToString()) : false,
                                    Status = (rdrItems["Status"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Status"].ToString()) : -1,

                                };
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }

                        if (quiz != null)
                        {
                            quiz.Questions = new List<QuizQuestion>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quiz.Questions.Add(new QuizQuestion
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        DataTypeID = (rdrItems["DataType"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DataType"].ToString()) : 0,
                                        Question = (rdrItems["Question"] != DBNull.Value) ? rdrItems["Question"].ToString() : " - ",
                                        Question_En = (rdrItems["Question_En"] != DBNull.Value) ? rdrItems["Question_En"].ToString() : " - ",
                                        Specs = (rdrItems["Specs"] != DBNull.Value) ? rdrItems["Specs"].ToString() : "",
                                        ValidationSpecs = (rdrItems["ValidationSpecs"] != DBNull.Value) ? rdrItems["ValidationSpecs"].ToString() : "",
                                        Answer = (rdrItems["Answer"] != DBNull.Value) ? rdrItems["Answer"].ToString() : "",
                                        Order = (rdrItems["Order"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Order"].ToString()) : 0,

                                    });
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }

                            quiz.ImageChoices = new List<FileInfoViewModel>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quiz.ImageChoices.Add(new FileInfoViewModel
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        QuestionId = (rdrItems["QuestionId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuestionId"].ToString()) : 0,
                                        FileContentAsBytes = (byte[])(rdrItems["Contents"]),
                                        FileName = (rdrItems["FileName"] != DBNull.Value) ? rdrItems["FileName"].ToString() : "",
                                        FileIdx = (rdrItems["FileIdx"] != DBNull.Value) ? Convert.ToInt32(rdrItems["FileIdx"].ToString()) : 0,

                                    });
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }

                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }


                throw ex;

            }
        }
        return quiz;
    }

    public static QuizResult GetQuizResponses(int quizId, string absolutePath)
    {
        QuizResult quizResult = new QuizResult();
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetQuizResponses;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                quizResult.quiz = new Quiz
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    Title = (rdrItems["Title"] != DBNull.Value) ? rdrItems["Title"].ToString() : " - ",
                                    Description = (rdrItems["Description"] != DBNull.Value) ? rdrItems["Description"].ToString() : " - ",
                                    Title_En = (rdrItems["Title_En"] != DBNull.Value) ? rdrItems["Title_En"].ToString() : " - ",
                                    Description_En = (rdrItems["Description_En"] != DBNull.Value) ? rdrItems["Description_En"].ToString() : " - ",
                                    Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : 0,
                                    PassScore = (rdrItems["PassScore"] != DBNull.Value) ? Convert.ToInt32(rdrItems["PassScore"].ToString()) : 0,

                                };
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }

                        if (quizResult.quiz != null)
                        {
                            quizResult.quiz.Questions = new List<QuizQuestion>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quizResult.quiz.Questions.Add(new QuizQuestion
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        DataTypeID = (rdrItems["DataType"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DataType"].ToString()) : 0,
                                        Question = (rdrItems["Question"] != DBNull.Value) ? rdrItems["Question"].ToString() : " - ",
                                        Question_En = (rdrItems["Question_En"] != DBNull.Value) ? rdrItems["Question_En"].ToString() : " - ",
                                        Specs = (rdrItems["Specs"] != DBNull.Value) ? rdrItems["Specs"].ToString() : "",
                                        ValidationSpecs = (rdrItems["ValidationSpecs"] != DBNull.Value) ? rdrItems["ValidationSpecs"].ToString() : "",
                                        Answer = (rdrItems["Answer"] != DBNull.Value) ? rdrItems["Answer"].ToString() : "",
                                        Order = (rdrItems["Order"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Order"].ToString()) : 0,

                                    });
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }

                            quizResult.quiz.ImageChoices = new List<FileInfoViewModel>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quizResult.quiz.ImageChoices.Add(new FileInfoViewModel
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        QuestionId = (rdrItems["QuestionId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuestionId"].ToString()) : 0,
                                        FileContentAsBytes = (byte[])(rdrItems["Contents"]),
                                        FileName = (rdrItems["FileName"] != DBNull.Value) ? rdrItems["FileName"].ToString() : " - ",
                                        FileIdx = (rdrItems["FileIdx"] != DBNull.Value) ? Convert.ToInt32(rdrItems["FileIdx"].ToString()) : 0,

                                    });
                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }

                            quizResult.quizResponses = new List<QuizResponse>();
                            rdrItems.NextResult();

                            while (rdrItems.Read())
                            {
                                try
                                {
                                    quizResult.quizResponses.Add(new QuizResponse
                                    {
                                        ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                        QuizID = (rdrItems["QuizId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuizId"].ToString()) : 0,
                                        Username = (rdrItems["Username"] != DBNull.Value) ? rdrItems["Username"].ToString() : "",
                                        Response = (rdrItems["Response"] != DBNull.Value) ? rdrItems["Response"].ToString() : "",
                                        ModifiedDate = Convert.ToDateTime(rdrItems["Modified"].ToString()),
                                    });

                                }
                                catch (Exception ex)
                                {
                                    //log.Error(ex.Message + " -- " + ex.StackTrace);
                                    throw ex;
                                }
                            }

                        }
                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
                if (ex is SqlException && (ex as SqlException).Number == 50001)
                {
                    throw new UnauthorizedAccessException();
                }

                throw ex;

            }
        }
        return quizResult;
    }

    public static List<MyResponse> GetMyResponses(string username)
    {
        var lstItems = new List<MyResponse>();
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForGetMyResponses;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@username", username);

                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {
                                lstItems.Add(new MyResponse
                                {
                                    ID = (rdrItems["Id"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Id"].ToString()) : 0,
                                    QuizID = (rdrItems["QuizId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuizId"].ToString()) : 0,
                                    Title = (rdrItems["Title"] != DBNull.Value) ? rdrItems["Title"].ToString() : " - ",
                                    Title_En = (rdrItems["Title_En"] != DBNull.Value) ? rdrItems["Title_En"].ToString() : " - ",
                                    Description = (rdrItems["Description"] != DBNull.Value) ? rdrItems["Description"].ToString() : " - ",
                                    Description_En = (rdrItems["Description_En"] != DBNull.Value) ? rdrItems["Description_En"].ToString() : " - ",
                                    Language = (rdrItems["Language"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Language"].ToString()) : 0,
                                    QuizLanguage = (rdrItems["QuizLang"] != DBNull.Value) ? Convert.ToInt32(rdrItems["QuizLang"].ToString()) : 0,
                                    Status = (rdrItems["Status"] != DBNull.Value) ? Convert.ToInt32(rdrItems["Status"].ToString()) : 0,
                                    DeptID = (rdrItems["DepartmentId"] != DBNull.Value) ? Convert.ToInt32(rdrItems["DepartmentId"].ToString()) : 0,
                                    DeptName = (rdrItems["DeptName"] != DBNull.Value) ? rdrItems["DeptName"].ToString() : " - ",
                                    DeptSiteUrl = (rdrItems["DeptSiteUrl"] != DBNull.Value) ? rdrItems["DeptSiteUrl"].ToString() : " - ",
                                    ModifiedDate = Convert.ToDateTime(rdrItems["Modified"].ToString()),
                                });
                            }
                            catch (Exception ex)
                            {
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }

                    }

                    connection.Close();
                }

            }
            catch (Exception ex)
            {

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }

                throw ex;

            }
        }
        return lstItems;
    }

    public static string GetDebugInfo(int quizId, string absolutePath)
    {
        var debugInfo = "";
        debugInfo = "entering debug info";
        using (var connection = DBConnection.QuizDBConnection())
        {
            try
            {
                using (var cmd = new SqlCommand())
                {
                    connection.Open();
                    cmd.Connection = connection;

                    cmd.CommandText = ProcedureNames.QueryForActiveQuiz;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@quizId", quizId);
                    cmd.Parameters.AddWithValue("@absolutePath", absolutePath);
                    cmd.Parameters.AddWithValue("@username", UserHelper.CurrentUserName);

                    debugInfo += " -- " + cmd.CommandText + " -- ";
                    var count = 0;

                    using (var rdrItems = cmd.ExecuteReader())
                    {
                        while (rdrItems.Read())
                        {
                            try
                            {

                                count++;
                            }
                            catch (Exception ex)
                            {
                                debugInfo += " -- Error in reading : " + ex.Message;
                                //log.Error(ex.Message + " -- " + ex.StackTrace);
                                throw ex;
                            }
                        }

                    }

                    connection.Close();
                    debugInfo += " -- Records Found : " + count;
                }

            }
            catch (Exception ex)
            {
                debugInfo += " -- Error in Connection block : " + ex.Message;

                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }

                throw ex;

            }
        }

        debugInfo += " -- exiting out of debuginfo ";
        return debugInfo;
    }


}