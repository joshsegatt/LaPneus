Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Joshsegatt\.gemini\antigravity\brain\afc39501-4bba-46b4-8376-1964a207d747\.user_uploaded\media_1790274654672.jpg"
$dest = "c:\Users\Joshsegatt\Desktop\LApneus\public\assets\pneus-stack-rim.png"

$bmp = [System.Drawing.Bitmap]::FromFile($src)
$w = $bmp.Width
$h = $bmp.Height
Write-Host "Source image: ${w}x${h}"

$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Lock bits for fast processing
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outData = $outBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$byteCount = [Math]::Abs($bmpData.Stride) * $h
$pixels = New-Object byte[] $byteCount
$outPixels = New-Object byte[] $byteCount

[System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $pixels, 0, $byteCount)

# In 32bppArgb, each pixel is 4 bytes: [B, G, R, A]
for ($i = 0; $i -lt $byteCount; $i += 4) {
    $b = $pixels[$i]
    $g = $pixels[$i+1]
    $r = $pixels[$i+2]
    # Check if near white
    $minChannel = [Math]::Min($r, [Math]::Min($g, $b))
    $maxChannel = [Math]::Max($r, [Math]::Max($g, $b))
    
    # White background threshold:
    # If all channels > 248 and low saturation
    if ($minChannel -ge 248 -and ($maxChannel - $minChannel) -le 10) {
        # Transparent
        $outPixels[$i] = 0
        $outPixels[$i+1] = 0
        $outPixels[$i+2] = 0
        $outPixels[$i+3] = 0
    } elseif ($minChannel -ge 225 -and ($maxChannel - $minChannel) -le 15) {
        # Soft feathering at the boundary
        $alpha = [int](255 * (248 - $minChannel) / (248 - 225))
        if ($alpha -lt 0) { $alpha = 0 }
        if ($alpha -gt 255) { $alpha = 255 }
        $outPixels[$i] = $b
        $outPixels[$i+1] = $g
        $outPixels[$i+2] = $r
        $outPixels[$i+3] = [byte]$alpha
    } else {
        $outPixels[$i] = $b
        $outPixels[$i+1] = $g
        $outPixels[$i+2] = $r
        $outPixels[$i+3] = 255
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($outPixels, 0, $outData.Scan0, $byteCount)

$bmp.UnlockBits($bmpData)
$outBmp.UnlockBits($outData)

$bmp.Dispose()
$outBmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmp.Dispose()

$fi = Get-Item $dest
Write-Host "Saved cutout PNG to ${dest}: $($fi.Length) bytes"
