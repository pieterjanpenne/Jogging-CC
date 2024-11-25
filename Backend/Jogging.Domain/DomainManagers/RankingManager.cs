using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Models;

namespace Jogging.Domain.DomainManagers;

public class RankingManager
{
    private readonly ResultManager _resultManager;
    private readonly IMapper _mapper;

    public RankingManager(ResultManager resultManager, IMapper mapper)
    {
        _resultManager = resultManager;
        _mapper = mapper;
    }

    private static void InsertInOrder(List<RankingDom> list, RankingDom item)
    {
        int index = list.BinarySearch(item,
            Comparer<RankingDom>.Create((x, y) => y.Points.CompareTo(x.Points)));
        if (index < 0)
        {
            index = ~index;
        }

        list.Insert(index, item);
    }

    public async Task<List<Dictionary<string, List<RankingDom>>>> GetAllRankings(QueryStringParameters parameters)
    {
        var allResults = await _resultManager.GetAllResults();
        Console.WriteLine(allResults);


        var groupedResults = allResults
            .GroupBy(r => r.CompetitionId)
            .ToDictionary(
                competitionGroup => competitionGroup.Key,
                competitionGroup => competitionGroup
                    .GroupBy(r => new { r.AgeCategoryName, r.Gender, r.DistanceName })
                    .ToDictionary(
                        categoryGenderGroup => (categoryGenderGroup.Key.AgeCategoryName, categoryGenderGroup.Key.Gender,
                            categoryGenderGroup.Key.DistanceName),
                        categoryGenderGroup => categoryGenderGroup.ToList()
                    )
            );

        List<Dictionary<string, List<RankingDom>>> results = new List<Dictionary<string, List<RankingDom>>>();

        foreach (var competitionGroup in groupedResults)
        {
            var categoryGenderGroups = competitionGroup.Value;

            foreach (var categoryGenderGroup in categoryGenderGroups)
            {
                var personGroups = categoryGenderGroup.Value;
                int amountOfPoints = 200;
                foreach (var person in personGroups)
                {
                    var personRankingCategory = new RankingCategoryDom()
                    {
                        AgeCategoryName = person.AgeCategoryName,
                        DistanceName = person.DistanceName,
                        Gender = person.Gender
                    };

                    var key = personRankingCategory.GetKey();
                    var existingEntry = results.FirstOrDefault(k => k.ContainsKey(key));
                    var simplePerson = new SimplePersonDom(person.FirstName, person.LastName);

                    if (existingEntry != null)
                    {
                        var existingList = existingEntry[key];
                        var existingPerson = existingList.FirstOrDefault(p =>
                            p.Person.Equals(_mapper.Map<SimplePersonDom>(simplePerson)));

                        if (existingPerson != null)
                        {
                            existingPerson.PointList.Add(amountOfPoints);
                            existingPerson.AmountOfRaces++;

                            if (existingPerson.PointList.Count > 4)
                            {
                                existingPerson.PointList = existingPerson.PointList
                                    .OrderByDescending(p => p)
                                    .Take(4)
                                    .ToList();
                            }

                            existingPerson.Points = existingPerson.PointList.Sum();
                            existingList.Remove(existingPerson);
                            InsertInOrder(existingList, existingPerson);
                        }
                        else
                        {
                            InsertInOrder(existingList,
                                new RankingDom()
                                    { Person = simplePerson, PointList = [amountOfPoints], Points = amountOfPoints });
                        }
                    }
                    else
                    {
                        var newList = new List<RankingDom>();
                        InsertInOrder(newList,
                            new RankingDom()
                                { Person = simplePerson, PointList = [amountOfPoints], Points = amountOfPoints });
                        var newEntry = new Dictionary<string, List<RankingDom>>
                        {
                            { key, newList }
                        };
                        results.Add(newEntry);
                    }

                    amountOfPoints--;
                }
            }
        }

        if (results.Count == 0)
        {
            throw new RankingException("No valid rankings found");
        }

        return results;
    }
}