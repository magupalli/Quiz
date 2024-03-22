public class QuizBase{
    public int ID {get; set;}
    public int Language {get; set;}
    public int DepartmentId {get; set;}
    public string Title {get; set;}
    public string Title_En {get; set;}
    public string Description {get; set;}
    public string Description_En {get; set;}
    public int RequestingDirectorate {get; set;}
    public int Classification {get; set;}
    public int PassScore {get; set;}
    public bool AllowViewResponse {get; set;}
    public bool AllowViewAnswers {get; set;}
    public string IDText {get; set;}
    public int MessageId {get; set;}
    public bool HasWelcomeMessage {get; set;}
    public bool HasThankyouMessage {get; set;}
    public bool RandomOrderQuestions {get; set;}
    public string ModifiedBy {get; set;}
    public DateTime ModifiedDate {get; set;}
    public List<QuizQuestion> Questions {get; set;}
    public List<FileInfoViewModel> ImageChoices {get; set;}
    public bool HasUserAlreadySubmitted {get; set;}
    
}