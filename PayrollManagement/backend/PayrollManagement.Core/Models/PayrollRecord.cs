using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PayrollManagement.Core.Models
{
    public class PayrollRecord
    {
        public int Id { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        [Required]
        [MaxLength(7)] // YYYY-MM format
        public string Month { get; set; } = string.Empty;
        
        // JSON fields for flexible earnings and deductions structure
        [MaxLength(2000)]
        public string EarningsJson { get; set; } = string.Empty;
        
        [MaxLength(2000)]
        public string DeductionsJson { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal LossOfPay { get; set; } = 0;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Reimbursements { get; set; } = 0;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? IncentiveAdjustment { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal NetPayable { get; set; }
        
        [Required]
        public PayrollStatus Status { get; set; } = PayrollStatus.Pending;
        
        public int? ApprovedBy { get; set; }
        
        public DateTime? ApprovedOn { get; set; }
        
        public int? RejectedBy { get; set; }
        
        [MaxLength(500)]
        public string? RejectionReason { get; set; }
        
        public DateTime? RejectedOn { get; set; }
        
        public int AttendanceDays { get; set; }
        
        public int WorkingDays { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Employee Employee { get; set; } = null!;
        public User? ApprovedByUser { get; set; }
        public User? RejectedByUser { get; set; }
        public ICollection<Payslip> Payslips { get; set; } = new List<Payslip>();
    }
    
    public enum PayrollStatus
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3
    }
}
