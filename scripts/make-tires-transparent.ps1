Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Joshsegatt\.gemini\antigravity\brain\afc39501-4bba-46b4-8376-1964a207d747\.user_uploaded\media_1790274654672.jpg"
$dest = "c:\Users\Joshsegatt\Desktop\LApneus\public\assets\pneus-stack-rim.png"

$bmp = [System.Drawing.Bitmap]::FromFile($src)
$w = [int]$bmp.Width
$h = [int]$bmp.Height

Write-Host "Processing $w x $h image..."

# Allocate flat array for visited/background
$isBg = New-Object 'bool[]' ($w * $h)
$queue = New-Object 'System.Collections.Generic.Queue[int]'

# Read all pixels into byte array
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$byteCount = [Math]::Abs($bmpData.Stride) * $h
$rawBytes = New-Object 'byte[]' $byteCount
[System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $rawBytes, 0, $byteCount)
$bmp.UnlockBits($bmpData)
$bmp.Dispose()

# Helper to check if pixel index is near white
function CheckWhite($idx) {
    $offset = $idx * 4
    $b = [int]$rawBytes[$offset]
    $g = [int]$rawBytes[$offset + 1]
    $r = [int]$rawBytes[$offset + 2]
    return ($r -ge 238 -and $g -ge 238 -and $b -ge 238)
}

# Seed top and bottom rows
for ($x = 0; $x -lt $w; $x++) {
    $idxTop = $x
    if (CheckWhite $idxTop) {
        $isBg[$idxTop] = $true
        $queue.Enqueue($idxTop)
    }
    $idxBot = ($h - 1) * $w + $x
    if (CheckWhite $idxBot) {
        $isBg[$idxBot] = $true
        $queue.Enqueue($idxBot)
    }
}

# Seed left and right columns
for ($y = 0; $y -lt $h; $y++) {
    $idxLeft = $y * $w
    if (-not $isBg[$idxLeft] -and (CheckWhite $idxLeft)) {
        $isBg[$idxLeft] = $true
        $queue.Enqueue($idxLeft)
    }
    $idxRight = $y * $w + ($w - 1)
    if (-not $isBg[$idxRight] -and (CheckWhite $idxRight)) {
        $isBg[$idxRight] = $true
        $queue.Enqueue($idxRight)
    }
}

# Flood fill
while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $cx = $curr % $w
    $cy = [int]($curr / $w)

    # 4-connectivity
    $neighbors = @()
    if ($cx -gt 0) { $neighbors += ($curr - 1) }
    if ($cx -lt ($w - 1)) { $neighbors += ($curr + 1) }
    if ($cy -gt 0) { $neighbors += ($curr - $w) }
    if ($cy -lt ($h - 1)) { $neighbors += ($curr + $w) }

    foreach ($n in $neighbors) {
        if (-not $isBg[$n]) {
            $offset = $n * 4
            $b = [int]$rawBytes[$offset]
            $g = [int]$rawBytes[$offset + 1]
            $r = [int]$rawBytes[$offset + 2]
            if ($r -ge 235 -and $g -ge 235 -and $b -ge 235) {
                $isBg[$n] = $true
                $queue.Enqueue($n)
            }
        }
    }
}

# Create output 32bppArgb array
$outBytes = New-Object 'byte[]' $byteCount

for ($curr = 0; $curr -lt ($w * $h); $curr++) {
    $offset = $curr * 4
    $b = $rawBytes[$offset]
    $g = $rawBytes[$offset + 1]
    $r = $rawBytes[$offset + 2]

    if ($isBg[$curr]) {
        # Transparent
        $outBytes[$offset] = 0
        $outBytes[$offset + 1] = 0
        $outBytes[$offset + 2] = 0
        $outBytes[$offset + 3] = 0
    } else {
        # Check if adjacent to background for antialiasing
        $cx = $curr % $w
        $cy = [int]($curr / $w)
        $nearBg = $false
        if ($cx -gt 0 -and $isBg[$curr - 1]) { $nearBg = $true }
        elseif ($cx -lt ($w - 1) -and $isBg[$curr + 1]) { $nearBg = $true }
        elseif ($cy -gt 0 -and $isBg[$curr - $w]) { $nearBg = $true }
        elseif ($cy -lt ($h - 1) -and $isBg[$curr + $w]) { $nearBg = $true }

        if ($nearBg -and ($r -ge 210 -and $g -ge 210 -and $b -ge 210)) {
            $maxC = [Math]::Max([int]$r, [Math]::Max([int]$g, [int]$b))
            $alpha = [int](255 * (240 - $maxC) / 30)
            if ($alpha -lt 0) { $alpha = 0 }
            if ($alpha -gt 255) { $alpha = 255 }
            $outBytes[$offset] = $b
            $outBytes[$offset + 1] = $g
            $outBytes[$offset + 2] = $r
            $outBytes[$offset + 3] = [byte]$alpha
        } else {
            $outBytes[$offset] = $b
            $outBytes[$offset + 1] = $g
            $outBytes[$offset + 2] = $r
            $outBytes[$offset + 3] = 255
        }
    }
}

$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outData = $outBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
[System.Runtime.InteropServices.Marshal]::Copy($outBytes, 0, $outData.Scan0, $byteCount)
$outBmp.UnlockBits($outData)

$outBmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmp.Dispose()

$fi = Get-Item $dest
Write-Host "Clean cutout PNG saved to ${dest} ($($fi.Length) bytes)"
