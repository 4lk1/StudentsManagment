namespace STMSApi.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string TeamName { get; set; }
        public string ProjectTopic { get; set; }
        public string Members { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}