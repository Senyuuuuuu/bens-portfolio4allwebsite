$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
Write-Host "Listening on http://localhost:8000/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        if ($url -eq "/" -or $url -eq "") { $url = "/index.html" }
        
        # Prevent path traversal breakouts
        $cleanUrl = $url.Replace("..", "").Replace("//", "/")
        $filePath = Join-Path "c:\Users\USER\Downloads\Ai agent Automation" $cleanUrl.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            
            $contentType = "text/plain"
            if ($filePath -like "*.html") { $contentType = "text/html" }
            elseif ($filePath -like "*.css") { $contentType = "text/css" }
            elseif ($filePath -like "*.js") { $contentType = "text/javascript" }
            elseif ($filePath -like "*.png") { $contentType = "image/png" }
            elseif ($filePath -like "*.jpg" -or $filePath -like "*.jpeg") { $contentType = "image/jpeg" }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $filePath")
            $response.OutputStream.Write($err, 0, $err.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # Silent fail on active stream cancellation
        if ($listener.IsListening) {
            Write-Host "Error in loop: $_"
        }
    }
}
$listener.Close()
