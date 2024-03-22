public class Employee {
    public string LoginName {get; set;}
    public string DisplayName {get; set;}
    public string Email {get; set;}
    public string Department {get; set;}
    public string EmployeeId {get; set;}
    public string JobTitle {get; set;}
}
public class Admin : Employee{
    public int ID {get; set;}
    public string IDText {get; set;}
    public bool IsActive  {get; set;}
    public int DeptId {get; set;}
    public int DeptText {get; set;}
}