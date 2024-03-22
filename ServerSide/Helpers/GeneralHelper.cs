public class GeneralHelper{
    public static void SendMail(){
        string mailSubject,mailBody,strToEmails,strCCEmails;
        string mailServerAddress, fromEmail,fromTitle;
        mailServerAddress = ConfigurationManager.AppSettings["MailServerAddress"].ToString();
        fromEmail = ConfigurationManager.AppSettings["FromEmail"].ToString();
        fromTitle = ConfigurationManager.AppSettings["FromTitle"].ToString();


        strToEmails = "srinivas.magupalli@gmail.com";
        strCCEmails = "srinivas.magupalli@gmail.com";

        mailSubject = "test";
        mailBody = "test";

        var smtp = new SmtpClient(mailServerAddress);
        var mail = new MailMessage();

        mail.From= new MailAddress(fromEmail,fromTitle);
        mail.To.Clear();
        if(strToEmails != "") mail.To.Add(strToEmails);

        mail.Subject = mailSubject;
        mail.IsBodyHtml = true;
        mail.Body = mailBody;

        smtp.Send(mail);

    }
}