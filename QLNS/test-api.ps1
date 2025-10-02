# Test QLNS API Script
Write-Host "🚀 Testing QLNS API..." -ForegroundColor Green

$baseUrl = "http://localhost:8080/api"

# Test 1: Register Admin
Write-Host "`n1️⃣ Testing Register Admin..." -ForegroundColor Yellow
$registerBody = @{
    ten_dangnhap = "admin"
    mat_khau = "Admin@123456"
    quyen_han = "ADMIN"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✅ Register Success: $($registerResponse.message)" -ForegroundColor Green
} catch {
    $errorResponse = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorResponse)
    $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
    Write-Host "❌ Register Failed: $($errorBody.message)" -ForegroundColor Red
    
    if ($errorBody.message -like "*đã tồn tại*") {
        Write-Host "💡 Account already exists, proceeding to login..." -ForegroundColor Cyan
    }
}

# Test 2: Login
Write-Host "`n2️⃣ Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    tenDangnhap = "admin"
    matKhau = "Admin@123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login Success!" -ForegroundColor Green
    Write-Host "👤 User: $($loginResponse.data.tenDangnhap)" -ForegroundColor Cyan
    Write-Host "🔑 Role: $($loginResponse.data.quyenHan)" -ForegroundColor Cyan
    Write-Host "🎫 Token: $($loginResponse.data.token.Substring(0, 20))..." -ForegroundColor Cyan
    
    $token = $loginResponse.data.token
    
    # Test 3: Test Protected API
    Write-Host "`n3️⃣ Testing Protected API..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    try {
        $accountsResponse = Invoke-RestMethod -Uri "$baseUrl/tai-khoan" -Method Get -Headers $headers
        Write-Host "✅ Protected API Success!" -ForegroundColor Green
        Write-Host "📊 Found $($accountsResponse.Count) accounts" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Protected API Failed" -ForegroundColor Red
    }
    
} catch {
    $errorResponse = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorResponse)
    $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
    Write-Host "❌ Login Failed: $($errorBody.message)" -ForegroundColor Red
}

Write-Host "`n🎉 Test completed!" -ForegroundColor Green
