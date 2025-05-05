using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using STMSApi.Data;
using STMSApi.Models;

namespace STMSApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAttendance()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var attendance = await _context.Attendances
                .Include(a => a.Student)
                .Where(a => a.UserId == userId)
                .ToListAsync();
            return Ok(attendance);
        }

        [HttpPost]
        public async Task<IActionResult> SaveAttendance([FromBody] List<Attendance> attendances)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            foreach (var attendance in attendances)
            {
                attendance.UserId = userId;
                attendance.Date = DateTime.UtcNow;
                _context.Attendances.Add(attendance);
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("missed")]
        public async Task<IActionResult> GetMissedAttendance()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var missed = await _context.Attendances
                .Include(a => a.Student)
                .Where(a => a.UserId == userId && !a.IsPresent)
                .GroupBy(a => a.Student)
                .Select(g => new
                {
                    Id = g.Key.Id,
                    Name = g.Key.FullName,
                    Group = g.Key.Group,
                    Year = g.Key.Year,
                    TimesAbsent = g.Count()
                })
                .ToListAsync();
            return Ok(missed);
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetAttendanceOverview()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var attendances = await _context.Attendances
                .Where(a => a.UserId == userId)
                .ToListAsync();

            var presentCount = attendances.Count(a => a.IsPresent);
            var absentCount = attendances.Count(a => !a.IsPresent);

            return Ok(new { Present = presentCount, Absent = absentCount });
        }
    }
}