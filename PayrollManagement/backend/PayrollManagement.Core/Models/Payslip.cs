using System.ComponentModel.DataAnnotations;

namespace PayrollManagement.Core.Models
{
    public class Payslip
    {
        public int Id { get; set; }
        
        [Required]
        public int PayrollRecordId { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        [Required]
        [MaxLength(7)] // YYYY-MM format
        public string Month { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string FileUrl { get; set; } = string.Empty;
        
        public DateTime GeneratedOn { get; set; } = DateTime.UtcNow;
        
        public DateTime? EmailSentOn { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public PayrollRecord PayrollRecord { get; set; } = null!;
        public Employee Employee { get; set; } = null!;
    }
}
