using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Jogging.Infrastructure2.Models;

[Table("Profile")]
public partial class Profile
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("role")]
    [StringLength(255)]
    public string? Role { get; set; }
}
