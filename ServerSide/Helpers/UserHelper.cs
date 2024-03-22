using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;
using System.Web;

public class UserHelper
{

    public static string CurrentUserName
    {
        get
        {
            var currentLoginname = HttpContext.Current.User.Identity.Name;
            currentLoginname = currentLoginname.Substring(currentLoginname.IndexOf(@"\") + 1);
            return currentLoginname;
        }
    }

    public static List<Employee> getEmployees(string searchText)
    {
        List<Employee> employees = new List<Employee>();
        var adSearchRoot = ConfigurationManager.AppSettings["ADSearchRoot"].ToString();
        using (DirectorySearcher ds = new DirectorySearcher(adSearchRoot))
        {
            ds.PropertiesToLoad.Add("samAccountName");
            ds.PropertiesToLoad.Add("displayname");
            ds.PropertiesToLoad.Add("mail");

            ds.Filter = getFilterText(searchText);
            var results = ds.FindAll();
            if (results != null)
            {
                foreach (SearchResult result in results)
                {
                    try
                    {
                        employees.Add(new Employee
                        {
                            LoginName = result.Properties["samAccountName"][0].ToString(),
                            DisplayName = result.Properties["displayname"][0].ToString(),
                            Email = result.Properties["mail"][0].ToString(),

                        });

                    }
                    catch (Exception ex)
                    {

                    }

                }
            }
        }
        return employees.OrderBy(employees => employees.DisplayName).ToList();
    }

    public static Employee getEmployee(string searchText)
    {
        Employee employee = null;
        var adSearchRoot = ConfigurationManager.AppSettings["ADSearchRoot"].ToString();
        using (DirectorySearcher ds = new DirectorySearcher(adSearchRoot))
        {
            ds.PropertiesToLoad.Add("samAccountName");
            ds.PropertiesToLoad.Add("displayname");
            ds.PropertiesToLoad.Add("mail");

            ds.Filter = getFilterText_SpecificUser(searchText);
            var results = ds.FindOne();
            if (results != null)
            {
                try
                {
                    employee = new Employee
                    {
                        LoginName = result.Properties["samAccountName"][0].ToString(),
                        DisplayName = result.Properties["displayname"][0].ToString(),
                        Email = result.Properties["mail"][0].ToString(),

                    };

                }
                catch (Exception ex)
                {

                }

            }
        }

        return employee;
    }

    private static string getFilterText(string searchText)
    {
        return "(&(objectClass=user)(objectCategory=person)(|(mail=" + searchText + "*)(displayname=*" + searchText + ")(samAccountName=*" + searchText + ")(givenName=*" + searchText + ")(sn=*" + searchText + ")(telephonenumber=*" + searchText + ")(employeeid=*" + searchText + ")))";
    }
    private static string getFilterText_SpecificUser(string searchText)
    {
        return "(&(objectClass=user)(objectCategory=person)(|(samAccountName=*" + searchText + ")))";
    }

    public static List<Employee> getEmployeesWithUserNamesFilter(List<string> usernames)
    {
        List<Employee> employees = new List<Employee>();
        var adSearchRoot = ConfigurationManager.AppSettings["ADSearchRoot"].ToString();
        using (DirectorySearcher ds = new DirectorySearcher(adSearchRoot))
        {
            //ds.PropertiesToLoad.Add("samAccountName");
            //ds.PropertiesToLoad.Add("displayname");
            //ds.PropertiesToLoad.Add("mail");

            var filterText = "";
            foreach (var username in usernames)
            {
                filterText += "(samAccountName=" + username + ")";
            }
            if (filterText != "")
            {
                filterText = "(|" + filterText + ")"
                }
            ds.Filter = "(&(objectClass=user)(objectCategory=person)" + filterText + ")";
            var results = ds.FindAll();
            if (results != null)
            {
                foreach (SearchResult result in results)
                {
                    try
                    {
                        employees.Add(new Employee
                        {
                            LoginName = result.Properties["samAccountName"][0].ToString(),
                            DisplayName = result.Properties["displayname"][0].ToString(),
                            Email = result.Properties["mail"][0].ToString(),
                            Department = result.Properties["department"][0].ToString(),
                            EmployeeId = result.Properties["employeeid"][0].ToString(),
                            JobTitle = result.Properties["title"][0].ToString(),

                        });

                    }
                    catch (Exception ex)
                    {

                        employees.Add(new Employee
                        {
                            LoginName = result.Properties["samAccountName"][0].ToString(),
                            DisplayName = "",
                            Email = "",
                            Department = "",
                            EmployeeId = "0000",
                            JobTitle = "",

                        });

                    }

                }
            }
        }
        return employees.OrderBy(employees => employees.DisplayName).ToList();
    }

}