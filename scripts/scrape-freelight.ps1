# scrape-freelight.ps1
# ColorMe (shop-pro.jp) の公開ページから商品データと画像を収集する補助スクリプト
# 実行: powershell -ExecutionPolicy Bypass -File .\scripts\scrape-freelight.ps1

param(
    [string]$OutputDir = "C:\Users\britz\Desktop\ECsite"
)

$ErrorActionPreference = "Stop"
$ProgressPreference    = "SilentlyContinue"

$EucJp = [System.Text.Encoding]::GetEncoding(20932)

function Fetch-Html([string]$Url) {
    $wc = New-Object System.Net.WebClient
    $wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
    $bytes = $wc.DownloadData($Url)
    return $EucJp.GetString($bytes)
}

function Strip-Tags([string]$s) {
    return ([regex]::Replace($s, '<[^>]+>', '')).Trim()
}

# カテゴリ定義 (cbid => 表示名)
$Categories = [ordered]@{
    '933900' = "TAGBACKPACK"
    '1266661' = "TAGSACO"
    '936209' = "TAGPOLE"
    '934964' = "TAGSTOV"
    '1254977' = "TAGSLEEP"
    '1474197' = "Tarp&Shelter"
    '936210' = "TAGACC"
    '938945' = "TAGMATEx"
}

$rawDir  = Join-Path $OutputDir "data\raw"
$imgRoot = Join-Path $OutputDir "data\images\products"
New-Item -ItemType Directory -Force -Path $rawDir  | Out-Null
New-Item -ItemType Directory -Force -Path $imgRoot | Out-Null

# 1. カテゴリページから商品IDを収集
$productIdToCategory = @{}
foreach ($cbid in $Categories.Keys) {
    Write-Host "カテゴリ取得: $($Categories[$cbid]) ($cbid)"
    $url  = "http://freelight.shop-pro.jp/?mode=cate&cbid=$cbid&csid=0"
    $html = Fetch-Html $url
    $itemBlocks = [regex]::Matches($html, '<div class="itemarea">(.*?)</div>', 'Singleline')
    $ids = @()
    foreach ($blk in $itemBlocks) {
        $m = [regex]::Match($blk.Groups[1].Value, '\?pid=(\d+)')
        if ($m.Success) { $ids += $m.Groups[1].Value }
    }
    $ids = $ids | Sort-Object -Unique
    foreach ($id in $ids) {
        if (-not $productIdToCategory.ContainsKey($id)) {
            $productIdToCategory[$id] = $cbid
        }
    }
    Start-Sleep -Milliseconds 500
}
Write-Host "商品ID収集完了: $($productIdToCategory.Count) 件"

# 2. 商品詳細を取得
$products = @()
$i = 0
foreach ($productId in $productIdToCategory.Keys) {
    $i++
    $cbid    = $productIdToCategory[$productId]
    $catName = $Categories[$cbid]
    Write-Host "[$i/$($productIdToCategory.Count)] 商品取得: $productId ($catName)"

    try {
        $url  = "http://freelight.shop-pro.jp/?pid=$productId"
        $html = Fetch-Html $url

        $titleRaw = [regex]::Match($html, '<h2[^>]*>(.*?)</h2>', 'Singleline').Groups[1].Value
        $title    = Strip-Tags $titleRaw
        if ([string]::IsNullOrWhiteSpace($title)) { throw "invalid product page" }

        $priceRaw  = [regex]::Match($html, 'price_detail[^>]*>(.*?)</p>', 'Singleline').Groups[1].Value
        $priceText  = Strip-Tags $priceRaw
        $priceEx    = ""
        $priceIn    = ""
        if ($priceText -match '([\d,]+)') { $priceEx = $matches[1] }
        if ($priceText -match '税込\s*([\d,]+)') { $priceIn = $matches[1] }

        $imgMatches = [regex]::Matches($html, 'https://img02\.shop-pro\.jp/[^"''\s]+/product/' + $productId + '(?:_o\d+)?\.jpg[^"''\s]*')
        $imageUrls  = $imgMatches | ForEach-Object { $_.Value } | Sort-Object -Unique

        $descRaw = [regex]::Match($html, '<h3[^>]*>(.*?)</h3>', 'Singleline').Groups[1].Value
        $desc    = $descRaw.Trim()

        $catDisplay = [regex]::Match($html, 'Category\s*:\s*<a[^>]*>(.*?)</a>', 'Singleline').Groups[1].Value
        $catDisplay = Strip-Tags $catDisplay

        $isNew = $html -match 'new_mark_img1'

        $products += [pscustomobject]@{
            id               = $productId
            title            = $title
            category_id      = $cbid
            category         = $catName
            category_display = $catDisplay
            price_ex_tax     = $priceEx
            price_incl_tax   = $priceIn
            price_text       = $priceText
            is_new           = $isNew
            images           = ($imageUrls -join ';')
            description_html = $desc
        }

        $prodDir = Join-Path $imgRoot $productId
        New-Item -ItemType Directory -Force -Path $prodDir | Out-Null
        $idx = 0
        foreach ($iu in $imageUrls) {
            $idx++
            $pathPart = ($iu -split '\?')[0]
            $ext = [System.IO.Path]::GetExtension($pathPart)
            if (-not $ext) { $ext = ".jpg" }
            $target = Join-Path $prodDir ("img{0:D2}{1}" -f $idx, $ext)
            try {
                $wc2 = New-Object System.Net.WebClient
                $wc2.DownloadFile($iu, $target)
            } catch {
                Write-Warning "  画像DL失敗: $iu"
            }
        }
        $thumbUrl = "https://img02.shop-pro.jp/PA01124/856/product/${productId}_th.jpg"
        try {
            $wc3 = New-Object System.Net.WebClient
            $wc3.DownloadFile($thumbUrl, (Join-Path $prodDir "thumb.jpg"))
        } catch { }

    } catch {
        Write-Warning "  商品取得失敗: $productId - $_"
    }

    Start-Sleep -Milliseconds 700
}

# 3. JSON 保存
$jsonPath = Join-Path $rawDir "products.json"
$products | ConvertTo-Json -Depth 5 | Out-File -FilePath $jsonPath -Encoding UTF8
Write-Host "JSON保存: $jsonPath"

# 4. CSV 保存
$csvPath = Join-Path $rawDir "products.csv"
$products | Select-Object id, title, category_id, category, price_ex_tax, price_incl_tax, is_new, images | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
Write-Host "CSV保存: $csvPath"

# 5. カテゴリ一覧を保存
$catPath = Join-Path $rawDir "categories.json"
$Categories.GetEnumerator() | ForEach-Object { [pscustomobject]@{ id = $_.Key; name = $_.Value } } | ConvertTo-Json | Out-File -FilePath $catPath -Encoding UTF8
Write-Host "カテゴリ保存: $catPath"

Write-Host "完了: $($products.Count) 商品"
