Add-Type -AssemblyName System.Drawing

$srcDir = "C:\Users\Joshsegatt\Desktop\imagespneu"
$destDir = "c:\Users\Joshsegatt\Desktop\LApneus\public\assets"

$mapping = @{
    "IMG-20260924-WA0022.jpg" = "intervention-domicile-fiat.jpg"
    "IMG-20260924-WA0024.jpg" = "intervention-levage-pneumatique.jpg"
    "IMG20260921141536.jpg"   = "atelier-mobile-equipement.jpg"
    "IMG20260921141544.jpg"   = "montage-pneus-mercedes-taxi.jpg"
    "IMG20260921141600.jpg"   = "remplacement-freins-mercedes.jpg"
    "IMG20260921141625.jpg"   = "mecanicien-montage-pneu.jpg"
}

$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)

foreach ($entry in $mapping.GetEnumerator()) {
    $srcPath = Join-Path $srcDir $entry.Key
    $destPath = Join-Path $destDir $entry.Value

    if (Test-Path $srcPath) {
        $img = [System.Drawing.Bitmap]::FromFile($srcPath)
        $w = $img.Width
        $h = $img.Height
        $maxDim = 1600

        if ($w -gt $maxDim -or $h -gt $maxDim) {
            if ($w -gt $h) {
                $newW = $maxDim
                $newH = [int]($h * ($maxDim / $w))
            } else {
                $newH = $maxDim
                $newW = [int]($w * ($maxDim / $h))
            }
        } else {
            $newW = $w
            $newH = $h
        }

        $resized = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($resized)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()

        $resized.Save($destPath, $jpegEncoder, $encoderParams)
        $resized.Dispose()
        $img.Dispose()

        $fi = Get-Item $destPath
        Write-Host "Processed $($entry.Key) -> $($entry.Value): $($newW)x$($newH) ($([math]::Round($fi.Length/1KB, 1)) KB)"
    } else {
        Write-Warning "Source not found: $srcPath"
    }
}
