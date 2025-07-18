using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace CouplesGames.Infrastructure.Services
{
    public class SelfPingHostedService : BackgroundService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string? _pingUrl;
        private readonly ILogger<SelfPingHostedService> _logger;

        public SelfPingHostedService(
            IConfiguration configuration,
            ILogger<SelfPingHostedService> logger,
            IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _pingUrl = configuration["SELF_PING_URL"];
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (string.IsNullOrEmpty(_pingUrl))
            {
                _logger.LogWarning("SELF_PING_URL is not configured. Self-ping service will not start.");
                return;
            }

            var httpClient = _httpClientFactory.CreateClient();

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var response = await httpClient.GetAsync(_pingUrl, stoppingToken);
                    if (response.IsSuccessStatusCode)
                    {
                        _logger.LogInformation($"Self ping successful at {DateTime.UtcNow}");
                    }
                    else
                    {
                        _logger.LogWarning($"Self ping failed: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Self ping exception");
                }

                await Task.Delay(TimeSpan.FromMinutes(12), stoppingToken);
            }
        }
    }
}
