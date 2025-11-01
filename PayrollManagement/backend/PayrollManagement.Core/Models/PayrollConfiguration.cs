using System.ComponentModel.DataAnnotations;

namespace PayrollManagement.Core.Models
{
    public class PayrollConfiguration
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Key { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(1000)]
        public string Value { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public SettingType SettingType { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public int UpdatedBy { get; set; }
        
        public DateTime UpdatedOn { get; set; } = DateTime.UtcNow;
        
        public int Version { get; set; } = 1;
        
        // Navigation property
        public User UpdatedByUser { get; set; } = null!;
    }
    
    public enum SettingType
    {
        Percentage = 1,
        Currency = 2,
        Date = 3,
        Boolean = 4,
        Text = 5,
        Json = 6
    }
}
