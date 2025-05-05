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
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var students = await _context.Students
                .Where(s => s.UserId == userId)
                .ToListAsync();
            return Ok(students);
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent([FromBody] Student student)
        {
            student.UserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return Ok(student);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student updatedStudent)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (student.UserId != userId) return Unauthorized();

            student.FullName = updatedStudent.FullName;
            student.StudentId = updatedStudent.StudentId;
            student.Year = updatedStudent.Year;
            student.Group = updatedStudent.Group;
            await _context.SaveChangesAsync();
            return Ok(student);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (student.UserId != userId) return Unauthorized();

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}