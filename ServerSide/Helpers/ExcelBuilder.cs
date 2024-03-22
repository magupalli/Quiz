using OfficeOpenXml;
using OfficeOpenXml.Style;

public class ExcelBuilder {
    

    private static object GetQuestionText(Quiz quiz, int qtnCntr){
        if(quiz.Language == 1)
        return quiz.Questions[qtnCntr].Question;
        else if (quiz.Language== 2)
        return quiz.Questions[qtnCntr].Question_En;
    
        else if (quiz.Language== 3)
        return quiz.Questions[qtnCntr].Question + " / " + quiz.Questions[qtnCntr].Question_En;
    }

    public static GetQuizResponsesExcelPackage(QuizResult quizResult){
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        var oExcel = new ExcelPackage();

        var workSheet = oExcel.Worbook.Worksheets.Add("QuizResponses");

        workSheet.Cells[2,2].Value = (quizResult.quiz.Language == 1 ? quizResult.quiz.Title : (quizResult.quiz.Language == 2? quizResult.quiz.Title_En : (quizResult.quiz.Language == 3 ? quizResult.quiz.Title+ " / "+ quizResult.quiz.Title_En : "N/A")));
        workSheet.Cells[2,2].Style.Font.Size =15;
        workSheet.Cells[2,2].Style.Font.Bold = true;
        workSheet.Cells["B2:P2"].Merge = true;
        workSheet.Row(2).Height = 21;

        workSheet.Cells[4,2].Value = (quizResult.quiz.Language == 1 ? quizResult.quiz.Title : (quizResult.quiz.Language == 2? quizResult.quiz.Title_En : (quizResult.quiz.Language == 3 ? quizResult.quiz.Title+ " / "+ quizResult.quiz.Title_En : "N/A")));
        workSheet.Cells[4,2].Style.Font.Size =15;
        workSheet.Cells[4,2].Style.Font.Bold = true;
        workSheet.Cells["B4:P4"].Merge = true;
      


    }
}
