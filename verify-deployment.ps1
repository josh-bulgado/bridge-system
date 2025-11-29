# BRIDGE System Deployment Verification Script
# Run this after deployment to verify everything is working

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BRIDGE System Deployment Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$domain = "bridgesystem.abrdns.com"
$apiUrl = "https://bridge-system-api.onrender.com"
$errors = @()
$warnings = @()

# Function to test DNS
function Test-DNS {
    param($hostname, $type)
    Write-Host "Testing DNS: $type record for $hostname..." -NoNewline
    try {
        $result = Resolve-DnsName -Name $hostname -Type $type -ErrorAction Stop
        if ($result) {
            Write-Host " ✓ PASSED" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host " ✗ FAILED" -ForegroundColor Red
        $script:errors += "DNS $type record not found for $hostname"
        return $false
    }
}

# Function to test HTTP endpoint
function Test-Endpoint {
    param($url, $expectedStatus = 200)
    Write-Host "Testing endpoint: $url..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq $expectedStatus) {
            Write-Host " ✓ PASSED (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host " ✗ FAILED (Status: $($response.StatusCode))" -ForegroundColor Red
            $script:errors += "Unexpected status code for $url"
            return $false
        }
    }
    catch {
        Write-Host " ✗ FAILED" -ForegroundColor Red
        $script:errors += "Cannot reach $url - $($_.Exception.Message)"
        return $false
    }
}

# Function to test SSL certificate
function Test-SSL {
    param($hostname)
    Write-Host "Testing SSL certificate for $hostname..." -NoNewline
    try {
        $uri = "https://$hostname"
        $request = [System.Net.WebRequest]::Create($uri)
        $request.Timeout = 10000
        $response = $request.GetResponse()
        $response.Close()
        Write-Host " ✓ PASSED" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host " ✗ FAILED" -ForegroundColor Red
        $script:errors += "SSL certificate issue for $hostname"
        return $false
    }
}

Write-Host "📡 SECTION 1: DNS Configuration" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""

# Test CNAME for frontend
Test-DNS -hostname $domain -type "CNAME"

# Test TXT records for email
Write-Host "Testing DNS: TXT records for email..." -NoNewline
try {
    $txtRecords = Resolve-DnsName -Name $domain -Type TXT -ErrorAction Stop
    $spfFound = $false
    foreach ($record in $txtRecords) {
        if ($record.Strings -like "*v=spf1*include:resend.com*") {
            $spfFound = $true
            break
        }
    }
    if ($spfFound) {
        Write-Host " ✓ PASSED (SPF found)" -ForegroundColor Green
    }
    else {
        Write-Host " ⚠ WARNING (SPF not found)" -ForegroundColor Yellow
        $script:warnings += "SPF record not found - emails may not be delivered"
    }
}
catch {
    Write-Host " ⚠ WARNING" -ForegroundColor Yellow
    $script:warnings += "Cannot verify TXT records"
}

# Test DKIM
$dkimDomain = "resend._domainkey.$domain"
Write-Host "Testing DNS: DKIM record..." -NoNewline
try {
    $dkimRecord = Resolve-DnsName -Name $dkimDomain -Type TXT -ErrorAction Stop
    if ($dkimRecord) {
        Write-Host " ✓ PASSED" -ForegroundColor Green
    }
}
catch {
    Write-Host " ⚠ WARNING" -ForegroundColor Yellow
    $script:warnings += "DKIM record not found - emails may not authenticate"
}

Write-Host ""
Write-Host "🌐 SECTION 2: Frontend (Vercel)" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""

# Test frontend URL
$frontendUrl = "https://$domain"
Test-Endpoint -url $frontendUrl

# Test SSL
Test-SSL -hostname $domain

# Test specific frontend routes
Write-Host "Testing frontend routes..." -NoNewline
$routes = @("/", "/about", "/features")
$routesPassed = $true
foreach ($route in $routes) {
    try {
        $response = Invoke-WebRequest -Uri "$frontendUrl$route" -Method Get -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -ne 200) {
            $routesPassed = $false
        }
    }
    catch {
        $routesPassed = $false
    }
}
if ($routesPassed) {
    Write-Host " ✓ PASSED" -ForegroundColor Green
}
else {
    Write-Host " ⚠ WARNING (Some routes failed)" -ForegroundColor Yellow
    $script:warnings += "Some frontend routes are not accessible"
}

Write-Host ""
Write-Host "🔧 SECTION 3: Backend (Render)" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""

# Test API health endpoint
Test-Endpoint -url "$apiUrl/health"

# Test API base endpoint
Write-Host "Testing API base endpoint..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api" -Method Get -TimeoutSec 10
    Write-Host " ✓ PASSED" -ForegroundColor Green
}
catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host " ✓ PASSED (404 expected)" -ForegroundColor Green
    }
    else {
        Write-Host " ⚠ WARNING" -ForegroundColor Yellow
        $script:warnings += "API base endpoint returned unexpected response"
    }
}

# Test CORS
Write-Host "Testing CORS configuration..." -NoNewline
try {
    $headers = @{
        "Origin" = "https://$domain"
    }
    $response = Invoke-WebRequest -Uri "$apiUrl/health" -Method Options -Headers $headers -UseBasicParsing -TimeoutSec 10
    $allowOrigin = $response.Headers["Access-Control-Allow-Origin"]
    if ($allowOrigin -eq "https://$domain" -or $allowOrigin -eq "*") {
        Write-Host " ✓ PASSED" -ForegroundColor Green
    }
    else {
        Write-Host " ⚠ WARNING" -ForegroundColor Yellow
        $script:warnings += "CORS may not be configured correctly for your domain"
    }
}
catch {
    Write-Host " ⚠ WARNING" -ForegroundColor Yellow
    $script:warnings += "Cannot verify CORS configuration"
}

Write-Host ""
Write-Host "📧 SECTION 4: Email Service (Resend)" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Checking Resend configuration..." -NoNewline
Write-Host " ℹ MANUAL CHECK REQUIRED" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please verify manually:" -ForegroundColor Cyan
Write-Host "  1. Go to https://resend.com/domains" -ForegroundColor White
Write-Host "  2. Check that 'bridgesystem.abrdns.com' shows ✓ Verified" -ForegroundColor White
Write-Host "  3. Send a test email from Resend dashboard" -ForegroundColor White
Write-Host "  4. Register a test account at $frontendUrl/register" -ForegroundColor White
Write-Host "  5. Verify OTP email is received" -ForegroundColor White

Write-Host ""
Write-Host "🔐 SECTION 5: Security Headers" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Testing security headers..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri $frontendUrl -Method Get -UseBasicParsing -TimeoutSec 10
    $securityHeaders = @(
        "X-Content-Type-Options",
        "X-Frame-Options",
        "X-XSS-Protection"
    )
    $headersFound = 0
    foreach ($header in $securityHeaders) {
        if ($response.Headers[$header]) {
            $headersFound++
        }
    }
    if ($headersFound -eq $securityHeaders.Count) {
        Write-Host " ✓ PASSED" -ForegroundColor Green
    }
    elseif ($headersFound -gt 0) {
        Write-Host " ⚠ WARNING (Some headers missing)" -ForegroundColor Yellow
        $script:warnings += "Some security headers are missing"
    }
    else {
        Write-Host " ✗ FAILED" -ForegroundColor Red
        $script:errors += "Security headers not configured"
    }
}
catch {
    Write-Host " ⚠ WARNING" -ForegroundColor Yellow
    $script:warnings += "Cannot verify security headers"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "🎉 ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your BRIDGE System is successfully deployed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "URLs:" -ForegroundColor Cyan
    Write-Host "  Frontend: https://$domain" -ForegroundColor White
    Write-Host "  Backend:  $apiUrl" -ForegroundColor White
    Write-Host "  API Docs: $apiUrl/swagger" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Register admin account at https://$domain/register" -ForegroundColor White
    Write-Host "  2. Configure barangay settings" -ForegroundColor White
    Write-Host "  3. Add document templates" -ForegroundColor White
    Write-Host "  4. Create staff accounts" -ForegroundColor White
}
else {
    if ($errors.Count -gt 0) {
        Write-Host "❌ ERRORS FOUND: $($errors.Count)" -ForegroundColor Red
        Write-Host ""
        foreach ($error in $errors) {
            Write-Host "  • $error" -ForegroundColor Red
        }
        Write-Host ""
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "⚠️  WARNINGS: $($warnings.Count)" -ForegroundColor Yellow
        Write-Host ""
        foreach ($warning in $warnings) {
            Write-Host "  • $warning" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    Write-Host "Please address the issues above before going live." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Troubleshooting guides:" -ForegroundColor Cyan
    Write-Host "  • DEPLOYMENT_GUIDE.md - Complete deployment guide" -ForegroundColor White
    Write-Host "  • DNS_CONFIGURATION.md - DNS troubleshooting" -ForegroundColor White
    Write-Host "  • RESEND_SETUP.md - Email setup help" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Pause to keep window open
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
