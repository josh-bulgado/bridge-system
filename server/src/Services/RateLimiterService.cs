using Microsoft.Extensions.Caching.Memory;
using System.Net;

namespace server.Services
{
    public class RateLimiterService
    {
        private readonly IMemoryCache _cache;

        public RateLimiterService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public bool IsRateLimited(string key, int maxRequests, TimeSpan timeWindow)
        {
            var cacheKey = $"rate_limit_{key}";
            
            if (!_cache.TryGetValue(cacheKey, out int currentCount))
            {
                currentCount = 0;
            }

            if (currentCount >= maxRequests)
            {
                return true;
            }

            _cache.Set(cacheKey, currentCount + 1, timeWindow);
            return false;
        }

        public string GetClientIp(HttpContext context)
        {
            return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        }
    }
}
