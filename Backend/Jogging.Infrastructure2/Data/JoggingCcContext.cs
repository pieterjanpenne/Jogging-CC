using System;
using System.Collections.Generic;
using Jogging.Infrastructure2.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Jogging.Infrastructure2.Data;

public partial class JoggingCcContext : DbContext
{
    public JoggingCcContext()
    {
    }

    public JoggingCcContext(DbContextOptions<JoggingCcContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<AgeCategory> AgeCategories { get; set; }

    public virtual DbSet<Competition> Competitions { get; set; }

    public virtual DbSet<CompetitionPerCategory> CompetitionPerCategories { get; set; }

    public virtual DbSet<Person> People { get; set; }

    public virtual DbSet<Personview> Personviews { get; set; }

    public virtual DbSet<Profile> Profiles { get; set; }

    public virtual DbSet<Registration> Registrations { get; set; }

    public virtual DbSet<School> Schools { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseMySql("server=mysql-28d63a87-linabencheikh-nt.f.aivencloud.com;port=21290;database=Jogging_CC;uid=avnadmin;pwd=AVNS_vEpmT_7ygfJjKSPWezk", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.30-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
        });

        modelBuilder.Entity<AgeCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
        });

        modelBuilder.Entity<Competition>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.Active).HasDefaultValueSql("'0'");
            entity.Property(e => e.RankingActive).HasDefaultValueSql("'0'");
        });

        modelBuilder.Entity<CompetitionPerCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.Gender).IsFixedLength();
        });

        modelBuilder.Entity<Person>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.Gender).HasDefaultValueSql("''");
        });

        modelBuilder.Entity<Personview>(entity =>
        {
            entity.ToView("personview");

            entity.Property(e => e.Gender).HasDefaultValueSql("''");
        });

        modelBuilder.Entity<Profile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
        });

        modelBuilder.Entity<Registration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
        });

        modelBuilder.Entity<School>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
