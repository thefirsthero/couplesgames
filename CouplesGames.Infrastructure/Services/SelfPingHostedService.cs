using Microsoft.Extensions.Hosting;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;


namespace CouplesGames.Infrastructure.Services
{
    public class SelfPingHostedService : BackgroundService
    {
        private readonly HttpClient _httpClient;
        private readonly string? _pingUrl;
        private readonly ILogger<SelfPingHostedService> _logger;

        public SelfPingHostedService(IConfiguration configuration, ILogger<SelfPingHostedService> logger)
        {
            _httpClient = new HttpClient();
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

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var response = await _httpClient.GetAsync(_pingUrl, stoppingToken);
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
