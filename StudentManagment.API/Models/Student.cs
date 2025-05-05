namespace STMSApi.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string StudentId { get; set; }
        public string Year { get; set; }
        public string Group { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}