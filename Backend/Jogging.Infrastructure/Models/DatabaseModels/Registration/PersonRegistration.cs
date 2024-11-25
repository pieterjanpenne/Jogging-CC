using Jogging.Infrastructure.Models.DatabaseModels.Competition;
using Jogging.Infrastructure.Models.DatabaseModels.Person;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.Registration;

[Table("Registration")]
public class PersonRegistration : BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }

    [Column("RunNumber")]
    public short? RunNumber { get; set; }

    [Column("RunTime")]
    public TimeSpan? RunTime { get; set; }

    [Column("CompetitionPerCategoryId")]
    public int CompetitionPerCategoryId { get; set; }
    
    [Column("Paid")]
    public bool? Paid { get; set; }
    
    [Column("CompetitionId")]
    public int CompetitionId { get; set; }
    
    [Column("PersonId")]
    public int PersonId { get; set; }
    
    [Reference(typeof(SimplePerson), ReferenceAttribute.JoinType.Inner)]
    public SimplePerson Person { get; set; }
    
    [Reference(typeof(SimpleCompetition), ReferenceAttribute.JoinType.Inner)]
    public SimpleCompetition Competition { get; set; }
}