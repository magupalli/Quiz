public class ERPDBHelper{
    static string ERPEmpInfoViewName = ConfigurationManager.AppSettings["ERPEmpInfoViewName"].ToString();

    static string Get_EmpInfoNamesQuery(){
        return "SELECT Employee_Name, User_Name from " + ERPEmpInfoViewName;
    }

    public static List<Employee> GetEmpInfo_Names(){
        var lstItems = new List<Employee>();
        using(var connection = DBConnection.ERPDBConnection()){
            try{
                using(var cmd = new OracleCommand()){
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = Get_EmpInfoNamesQuery();
                    using(var rdrItems = cmd.ExecuteReader()){
                        while(rdrItems.Read()){
                            try{
                                lstItems.Add(new Employee{
                                    LoginName = rdrItems["User_name"].ToString(),
                                    DisplayName = rdrItems["Employee_name"].ToString(),
                                });
                            }
                            catch(Exception ex){
                                throw ex;
                            }
                        }
                    }
                    connection.close();
                }
            }
            catch(Exception ex){
                if(connection.State == System.Data.ConnectionState.Open){
                    connection.Close();
                }
            }
        }
        return lstItems;
    }
}