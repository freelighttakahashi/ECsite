# import-to-supabase.ps1
# data/raw の JSON を Supabase にインポートする
# 事前に docs/supabase-schema.sql を Supabase SQL Editor で実行してください
#
# 使い方:
#   $env:SUPABASE_URL = "https://xxxx.supabase.co"
#   $env:SUPABASE_SERVICE_KEY = "eyJ..."
#   powershell -ExecutionPolicy Bypass -File .\scripts\import-to-supabase.ps1

param(
    [string]$SupabaseUrl = $env:SUPABASE_URL,
    [string]$ServiceKey  = $env:SUPABASE_SERVICE_KEY,
    [string]$DataDir     = "C:\Users\britz\Desktop\ECsite\data\raw"
)

$ErrorActionPreference = "Stop"
$ProgressPreference    = "SilentlyContinue"

if ([string]::IsNullOrWhiteSpace($SupabaseUrl)) {
    $SupabaseUrl = Read-Host "Supabase URL (https://xxxx.supabase.co)"
}
if ([string]::IsNullOrWhiteSpace($ServiceKey)) {
    $ServiceKey = Read-Host "Service Role Key"
}

$base = $SupabaseUrl.TrimEnd('/')
$headers = @{
    "apikey"        = $ServiceKey
    "Authorization" = "Bearer $ServiceKey"
    "Content-Type"  = "application/json"
    "Prefer"        = "return=minimal"
}

function Invoke-SupabaseInsert([string]$Table, [array]$Rows) {
    if ($Rows.Count -eq 0) { return }
    $body = $Rows | ConvertTo-Json -Depth 6 -Compress
    if ($Rows.Count -eq 1) { $body = "[$body]" }
    $uri = "$base/rest/v1/$Table"
    try {
        Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $body | Out-Null
        Write-Host "  $Table : $($Rows.Count) 件投入"
    } catch {
        Write-Error "  $Table 投入失敗: $_"
        throw
    }
}

# 1. ブランド投入
Write-Host "ブランド投入..."
$brands = @(
    @{ id = 1; name = "FREELIGHT"; slug = "freelight" },
    @{ id = 2; name = "microgravity"; slug = "microgravity" }
)
Invoke-SupabaseInsert "brands" $brands

# 2. カテゴリ投入
Write-Host "カテゴリ投入..."
$catJson = Get-Content (Join-Path $DataDir "categories.json") -Raw | ConvertFrom-Json
$categories = @()
foreach ($c in $catJson) {
    $categories += @{
        id         = [long]$c.id
        name       = $c.name
        slug       = $c.name.ToLower()
        sort_order = 0
    }
}
Invoke-SupabaseInsert "categories" $categories

# 3. 商品投入
Write-Host "商品投入..."
$prodJson = Get-Content (Join-Path $DataDir "products.json") -Raw | ConvertFrom-Json
$products = @()
foreach ($p in $prodJson) {
    $imgs = @()
    if ($p.images) {
        $imgs = $p.images -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    }
    $products += @{
        id               = [long]$p.id
        title            = $p.title
        description_html = $p.description_html
        category_id      = [long]$p.category_id
        brand_id         = 1
        price_ex_tax     = [int]($p.price_ex_tax -replace ',','')
        price_incl_tax   = [int]($p.price_incl_tax -replace ',','')
        is_new           = [bool]$p.is_new
        images           = $imgs
    }
}
# 50件ずつ投入
$batch = 50
for ($i = 0; $i -lt $products.Count; $i += $batch) {
    $end = [Math]::Min($i + $batch - 1, $products.Count - 1)
    $chunk = $products[$i..$end]
    Invoke-SupabaseInsert "products" $chunk
    Start-Sleep -Milliseconds 300
}

Write-Host "インポート完了"