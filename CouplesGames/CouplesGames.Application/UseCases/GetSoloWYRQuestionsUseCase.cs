using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CouplesGames.Application.UseCases
{
    public class GetSoloWYRQuestionsUseCase
    {
        private IFirestoreService _firestoreService;

        public GetSoloWYRQuestionsUseCase(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<List<Question>> Execute(string userId)
        {
            return await _firestoreService.GetSoloQuestionsAsync();
        }
    }
}
