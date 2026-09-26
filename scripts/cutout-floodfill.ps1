Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Joshsegatt\.gemini\antigravity\brain\afc39501-4bba-46b4-8376-1964a207d747\.user_uploaded\media_1790274654672.jpg"
$dest = "c:\Users\Joshsegatt\Desktop\LApneus\public\assets\pneus-stack-rim.png"

$bmp = [System.Drawing.Bitmap]::FromFile($src)
$w = $bmp.Width
$h = $bmp.Height

# We will do a BFS flood fill from the borders to identify background pixels
$visited = New-Object 'bool[,]' $w, $h
$isBg = New-Object 'bool[,]' $w, $h

$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

# Check if a pixel is considered "white background"
function IsWhite([System.Drawing.Color]$c) {
    return ($c.R -ge 240 -and $c.G -ge 240 -and $c.B -ge 240)
}

# Seed borders
for ($x = 0; $x -lt $w; $x++) {
    foreach ($y in @(0, $h - 1)) {
        $c = $bmp.GetPixel($x, $y)
        if (IsWhite $c) {
            $visited[$x, $y] = $true
            $isBg[$x, $y] = $true
            $queue.Enqueue((New-Object System.Drawing.Point($x, $y)))
        }
    }
}
for ($y = 0; $y -lt $h; $y++) {
    foreach ($x in @(0, $w - 1)) {
        if (-not $visited[$x, $y]) {
            $c = $bmp.GetPixel($x, $y)
            if (IsWhite $c) {
                $visited[$x, $y] = $true
                $isBg[$x, $y] = $true
                $queue.Enqueue((New-Object System.Drawing.Point($x, $y)))
            }
        }
    }
}

# BFS flood fill
$dirs = @(
    @(-1, 0), @(1, 0), @(0, -1), @(0, 1),
    @(-1, -1), @(1, -1), @(-1, 1), @(1, 1)
)

while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    foreach ($d in $dirs) {
        $nx = $pt.X + $d[0]
        $ny = $pt.Y + $d[1]
        if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
            if (-not $visited[$nx, $ny]) {
                $visited[$nx, $ny] = $true
                $c = $bmp.GetPixel($nx, $ny)
                if (IsWhite $c) {
                    $isBg[$nx, $ny] = $true
                    $queue.Enqueue((New-Object System.Drawing.Point($nx, $ny)))
                }
            }
        }
    }
}

# Now create output bitmap
$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $orig = $bmp.GetPixel($x, $y)
        if ($isBg[$x, $y]) {
            $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Check if adjacent to background for soft anti-aliased edge
            $nearBg = $false
            foreach ($d in $dirs) {
                $nx = $x + $d[0]
                $ny = $y + $d[1]
                if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                    if ($isBg[$nx, $ny]) { $nearBg = $true; break }
                }
            }
            if ($nearBg -and ($orig.R -ge 215 -and $orig.G -ge 215 -and $orig.B -ge 215)) {
                $alpha = [int](255 * (255 - [Math]::Max($orig.R, [Math]::Max($orig.G, $orig.B))) / 40)
                if ($alpha -lt 0) { $alpha = 0 }
                if ($alpha -gt 255) { $alpha = 255 }
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $orig.R, $orig.G, $orig.B))
            } else {
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $orig.R, $orig.G, $orig.B))
            }
        }
    }
}

$bmp.Dispose()
$outBmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmp.Dispose()

$fi = Get-Item $dest
Write-Host "Flood-fill cutout saved to ${dest}: $($fi.Length) bytes"
