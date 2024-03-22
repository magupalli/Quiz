public class QuizResponse
{
    public int ID { get; set; }
    public byte Language { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }
    public int QuizID { get; set; }
    public int DepartmentId { get; set; }
    public string Username { get; set; }
    public string DisplayName { get; set; }
    public string Response { get; set; }
    public byte Responsestatus { get; set; }
    public List<QuizQuestionResponse> QuizQuestionResponses { get; set; }
   
    public void DeserializeResponse
    {
        QuizQuestionResponses =JsonConvert.DeserializeObject<List<QuizQuestionResponse>>(this.Response);
    }
    public void SerializeResponse
    {
        Response =JsonConvert.SerializeObject(QuizQuestionResponses);
    }
    
}