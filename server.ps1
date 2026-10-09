# EduSpark Static HTTP Web Server with Module Resolution & Robust Stream Handling
$port = 8082
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "EduSpark Web Server started at $prefix"

$root = $PSScriptRoot

try {
  while ($listener.IsListening) {
    try {
      $context = $listener.GetContext()
      $request = $context.Request
      $response = $context.Response
      
      $urlPath = $request.Url.LocalPath
      if ($urlPath -eq "/") { $urlPath = "/index.html" }
      
      $filePath = [System.IO.Path]::Combine($root, $urlPath.TrimStart('/').Replace('/', '\'))
      
      if (-not (Test-Path $filePath -PathType Leaf)) {
        if ($filePath.EndsWith(".js")) {
          $tsPath = $filePath.Substring(0, $filePath.Length - 3) + ".ts"
          if (Test-Path $tsPath -PathType Leaf) {
            $filePath = $tsPath
          }
        }
      }

      if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        
        switch ($ext) {
          ".html" { $response.ContentType = "text/html; charset=utf-8" }
          ".css"  { $response.ContentType = "text/css; charset=utf-8" }
          ".js"   { $response.ContentType = "text/javascript; charset=utf-8" }
          ".ts"   { $response.ContentType = "text/javascript; charset=utf-8" }
          ".json" { $response.ContentType = "application/json; charset=utf-8" }
          ".svg"  { $response.ContentType = "image/svg+xml" }
          default { $response.ContentType = "application/octet-stream" }
        }
        
        try {
          $response.ContentLength64 = $bytes.Length
          $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
          # Silently handle stream write variations
        }
      } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found: " + $urlPath)
        try {
          $response.ContentLength64 = $msg.Length
          $response.OutputStream.Write($msg, 0, $msg.Length)
        } catch {}
      }
      try { $response.Close() } catch {}
    } catch {
      # Keep listener loop alive across request exceptions
    }
  }
} finally {
  $listener.Stop()
}
