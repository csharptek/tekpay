using Microsoft.EntityFrameworkCore;
using PayrollManagement.Core.Models;

namespace PayrollManagement.Infrastructure.Data
{
    public class PayrollDbContext : DbContext
    {
        public PayrollDbContext(DbContextOptions<PayrollDbContext> options) : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<PayrollRecord> PayrollRecords { get; set; }
        public DbSet<Payslip> Payslips { get; set; }
        public DbSet<PayrollConfiguration> PayrollConfigurations { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Role).IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });
            
            // Employee configuration
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.UserId).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Department).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Designation).HasMaxLength(100);
                entity.Property(e => e.CTC).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.SalaryBreakupJson).HasMaxLength(2000);
                entity.Property(e => e.BankAccount).HasMaxLength(100);
                entity.Property(e => e.PAN).HasMaxLength(20);
                entity.Property(e => e.Aadhar).HasMaxLength(20);
                entity.Property(e => e.IncentiveEligible).HasDefaultValue(true);
                entity.Property(e => e.Status).HasDefaultValue(EmployeeStatus.Active);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                
                // Relationships
                entity.HasOne(e => e.User)
                    .WithOne(u => u.Employee)
                    .HasForeignKey<Employee>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.ReportingManager)
                    .WithMany(e => e.Subordinates)
                    .HasForeignKey(e => e.ReportingManagerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            
            // PayrollRecord configuration
            modelBuilder.Entity<PayrollRecord>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.EmployeeId, e.Month }).IsUnique();
                entity.Property(e => e.Month).IsRequired().HasMaxLength(7);
                entity.Property(e => e.EarningsJson).HasMaxLength(2000);
                entity.Property(e => e.DeductionsJson).HasMaxLength(2000);
                entity.Property(e => e.LossOfPay).HasColumnType("decimal(18,2)").HasDefaultValue(0);
                entity.Property(e => e.Reimbursements).HasColumnType("decimal(18,2)").HasDefaultValue(0);
                entity.Property(e => e.IncentiveAdjustment).HasColumnType("decimal(18,2)");
                entity.Property(e => e.NetPayable).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.Status).HasDefaultValue(PayrollStatus.Pending);
                entity.Property(e => e.RejectionReason).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                
                // Relationships
                entity.HasOne(e => e.Employee)
                    .WithMany(e => e.PayrollRecords)
                    .HasForeignKey(e => e.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.ApprovedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.ApprovedBy)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(e => e.RejectedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.RejectedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            
            // Payslip configuration
            modelBuilder.Entity<Payslip>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.EmployeeId, e.Month }).IsUnique();
                entity.Property(e => e.Month).IsRequired().HasMaxLength(7);
                entity.Property(e => e.FileUrl).IsRequired().HasMaxLength(500);
                entity.Property(e => e.GeneratedOn).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                
                // Relationships
                entity.HasOne(e => e.PayrollRecord)
                    .WithMany(e => e.Payslips)
                    .HasForeignKey(e => e.PayrollRecordId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Employee)
                    .WithMany(e => e.Payslips)
                    .HasForeignKey(e => e.EmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            
            // PayrollConfiguration configuration
            modelBuilder.Entity<PayrollConfiguration>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Key).IsUnique();
                entity.Property(e => e.Key).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Value).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.UpdatedOn).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.Version).HasDefaultValue(1);
                
                // Relationships
                entity.HasOne(e => e.UpdatedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.UpdatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
        
        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }
        
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }
        
        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is User || e.Entity is Employee || e.Entity is PayrollRecord || e.Entity is Payslip)
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);
                
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Property("CreatedAt") != null)
                        entry.Property("CreatedAt").CurrentValue = DateTime.UtcNow;
                }
                
                if (entry.Property("UpdatedAt") != null)
                    entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
            }
        }
    }
}
