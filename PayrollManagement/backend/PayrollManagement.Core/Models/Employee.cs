using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PayrollManagement.Core.Models
{
    public class Employee
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public DateTime DateOfJoining { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string Designation { get; set; } = string.Empty;
        
        [Required]
        public EmployeeStatus Status { get; set; } = EmployeeStatus.Active;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal CTC { get; set; }
        
        // JSON field for flexible salary configuration
        [MaxLength(2000)]
        public string SalaryBreakupJson { get; set; } = string.Empty;
        
        public int? ReportingManagerId { get; set; }
        
        [MaxLength(100)]
        public string BankAccount { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string PAN { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Aadhar { get; set; } = string.Empty;
        
        public bool IncentiveEligible { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? ResignedOn { get; set; }
        
        public DateTime? DeletedAt { get; set; }
        
        // Navigation properties
        public User User { get; set; } = null!;
        public Employee? ReportingManager { get; set; }
        public ICollection<Employee> Subordinates { get; set; } = new List<Employee>();
        public ICollection<PayrollRecord> PayrollRecords { get; set; } = new List<PayrollRecord>();
        public ICollection<Payslip> Payslips { get; set; } = new List<Payslip>();
    }
    
    public enum EmployeeStatus
    {
        Active = 1,
        Notice = 2,
        Resigned = 3,
        Terminated = 4
    }
}
