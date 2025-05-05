namespace STMSApi.Models
{
    public class DailyVisit
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int VisitCount { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}