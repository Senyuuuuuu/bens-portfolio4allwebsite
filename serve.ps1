$port = 8080
$root = 'c:\Users\USER\Downloads\Ai agent Automation'
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host ""
Write-Host "  JARVIS HUD Server" -ForegroundColor Cyan
Write-Host "  Running at: http://localhost:$port/" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff2'= 'font/woff2'
}

while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $resp = $ctx.Response

    $urlPath = $req.Url.LocalPath
    if ($urlPath -eq '/' -or $urlPath -eq '') { $urlPath = '/index.html' }

    $filePath = Join-Path $root $urlPath.TrimStart('/')

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath)
        $ct  = $mime[$ext]
        if (-not $ct) { $ct = 'application/octet-stream' }

        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $resp.ContentType     = $ct
        $resp.ContentLength64 = $bytes.Length
        $resp.StatusCode      = 200
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "  200  $urlPath" -ForegroundColor DarkGray
    } else {
        $resp.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
        $resp.OutputStream.Write($msg, 0, $msg.Length)
        Write-Host "  404  $urlPath" -ForegroundColor Red
    }

    $resp.OutputStream.Close()
}
