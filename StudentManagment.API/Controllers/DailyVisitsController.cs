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
    public class DailyVisitsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DailyVisitsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDailyVisits()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var visits = await _context.DailyVisits
                .Where(v => v.UserId == userId)
                .ToListAsync();
            return Ok(visits);
        }

        [HttpPost]
        public async Task<IActionResult> LogVisit()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var today = DateTime.UtcNow.Date;

            var visit = await _context.DailyVisits
                .FirstOrDefaultAsync(v => v.UserId == userId && v.Date.Date == today);

            if (visit == null)
            {
                visit = new DailyVisit
                {
                    UserId = userId,
                    Date = today,
                    VisitCount = 1
                };
                _context.DailyVisits.Add(visit);
            }
            else
            {
                visit.VisitCount++;
            }

            await _context.SaveChangesAsync();
            return Ok(visit);
        }

        [HttpDelete]
        public async Task<IActionResult> ClearVisits()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var visits = await _context.DailyVisits
                .Where(v => v.UserId == userId)
                .ToListAsync();

            _context.DailyVisits.RemoveRange(visits);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}