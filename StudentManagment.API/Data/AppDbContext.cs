using Microsoft.EntityFrameworkCore;
using STMSApi.Models;

namespace STMSApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<DailyVisit> DailyVisits { get; set; }
    }
}