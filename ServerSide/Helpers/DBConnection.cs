using Oracle.ManagedDataAccess.Client;
using System.Data.SqlClient;
public class DBConnection{
    public static SqlConnection QuizDBConnection(){
        var connectionString_QuizDB = ConfiguraitonManager.ConnectionStrings["QuizDB"].ToString();
        connectionString_QuizDB = StringCipher.Decrypt(connectionString_QuizDB);
        return new SqlConnection {
            ConnectionString = connectionString_QuizDB
        }
    }
    public static OracleConnection ERPDBConnection(){
        var connectionString_ERPDB = ConfiguraitonManager.ConnectionStrings["ERPDB"].ToString();
        connectionString_ERPDB = StringCipher.Decrypt(connectionString_ERPDB);
        return new OracleConnection {
            ConnectionString = connectionString_ERPDB
        }
    }
}