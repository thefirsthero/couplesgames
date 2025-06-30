using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;
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

        public async Task<List<Question>> Execute()
        {
            try
            {
                return await _firestoreService.GetSoloQuestionsAsync();
            }
            catch (Exception ex)
            {
                if (_firestoreService is FirestoreService fs)
                {
                    await fs.LogErrorAsync("GetSoloWYRQuestionsUseCase.Execute", ex);
                }
                throw;
            }
        }

    }
}
