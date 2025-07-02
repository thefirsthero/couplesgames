using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;

namespace CouplesGames.Application.Queries.Users
{
    public class GetUserQuery : IRequest<User?>
    {
        public string Uid { get; }

        public GetUserQuery(string uid)
        {
            Uid = uid;
        }
    }

    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, User?>
    {
        private readonly IFirestoreService _firestoreService;

        public GetUserQueryHandler(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<User?> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            try { 
                return await _firestoreService.GetUserAsync(request.Uid);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("GetUserQueryHandler.Handle", ex);
                throw;
            }
        }
    }
}