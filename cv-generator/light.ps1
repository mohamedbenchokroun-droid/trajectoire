param([string]$Key = "EN", [int]$Px = 360)
# Copie d'envoi du CV avec photo allégée (le CV d'origine n'est pas modifié)
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem
$root = "C:\Users\mbenc\cvsrc"
$stamp = Get-Date -Format "HHmmss"
$dst = "$root\send\$Key-$stamp"
New-Item -ItemType Directory -Force "$root\send" | Out-Null
Copy-Item "$root\out\$Key" $dst -Recurse
$img = [System.Drawing.Image]::FromFile("$root\out\$Key\word\media\image1.png")
$bmp = New-Object System.Drawing.Bitmap $Px, ([int]($Px * $img.Height / $img.Width))
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'
$g.DrawImage($img, 0, 0, $bmp.Width, $bmp.Height)
$g.Dispose(); $img.Dispose()
$bmp.Save("$dst\word\media\image1.png", [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
$docx = "$root\send\$Key-$stamp.docx"
[System.IO.Compression.ZipFile]::CreateFromDirectory($dst, $docx)
$pdf = "$root\send\CV_Mohamed_Benchokroun_$Key.pdf"
$word = New-Object -ComObject Word.Application; $word.Visible = $false
$doc = $word.Documents.Open($docx, $false, $true)
$doc.ExportAsFixedFormat($pdf, 17, $false, 1, 3, 1, 1)
$doc.Close($false); $word.Quit()
"$pdf $((Get-Item $pdf).Length)"
