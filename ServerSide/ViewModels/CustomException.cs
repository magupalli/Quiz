[Serializable]
public class CustomException:Exception{
    public CustomException(){}
    public CustomException(string message):base(message){}
    public CustomException(string message, Exception inner):base(message,inner){}
    public CustomException(
        System.Runtime.Serialization.SerializationInfo info,
     System.Runtime.Serialization.StreamingContext context):base(info,context){}
}