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
                // 🔒 Security: Track repeated violations
                IncrementViolationCount(key);
                return true;
            }

            _cache.Set(cacheKey, currentCount + 1, timeWindow);
            return false;
        }

        public string GetClientIp(HttpContext context)
        {
            // 🔒 Security: Check for proxy headers (X-Forwarded-For, X-Real-IP)
            var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedFor))
            {
                var ips = forwardedFor.Split(',');
                if (ips.Length > 0)
                {
                    return ips[0].Trim();
                }
            }

            var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
            if (!string.IsNullOrEmpty(realIp))
            {
                return realIp;
            }

            return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        }

        // 🔒 Security: Block IP temporarily after repeated violations
        public bool IsIpBlocked(string ipAddress)
        {
            var blockKey = $"ip_blocked_{ipAddress}";
            return _cache.TryGetValue(blockKey, out _);
        }

        public void BlockIp(string ipAddress, TimeSpan duration)
        {
            var blockKey = $"ip_blocked_{ipAddress}";
            _cache.Set(blockKey, true, duration);
            
            #if DEBUG
            Console.WriteLine($"[SECURITY] IP blocked: {ipAddress} for {duration.TotalMinutes} minutes");
            #endif
        }

        // 🔒 Security: Track violation count
        private void IncrementViolationCount(string key)
        {
            var violationKey = $"violations_{key}";
            
            if (!_cache.TryGetValue(violationKey, out int violationCount))
            {
                violationCount = 0;
            }

            violationCount++;
            _cache.Set(violationKey, violationCount, TimeSpan.FromMinutes(10));

            // 🔒 Security: Block IP after 5 violations in 10 minutes
            if (violationCount >= 5)
            {
                var ipAddress = key.Replace("email_check_", "");
                BlockIp(ipAddress, TimeSpan.FromMinutes(30));
            }
        }

        // 🔒 Security: Get remaining requests for client feedback
        public int GetRemainingRequests(string key, int maxRequests)
        {
            var cacheKey = $"rate_limit_{key}";
            
            if (!_cache.TryGetValue(cacheKey, out int currentCount))
            {
                return maxRequests;
            }

            return Math.Max(0, maxRequests - currentCount);
        }
    }
}
