public class FileInfoViewModel
{
    public int ID { get; set; }
    public string FileName { get; set; }
    public string FileContentAsString { get; set; }
    public byte[] FileContentAsBytes { get; set; }
    public int Size { get; set; }
    public int QuestionId { get; set; }
    public int ResponseId { get; set; }
    public int FileIdx { get; set; }

}