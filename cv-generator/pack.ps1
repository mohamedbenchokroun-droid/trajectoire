Add-Type -AssemblyName System.IO.Compression.FileSystem
$root = "C:\Users\mbenc\cvsrc"
foreach ($k in @("Communication", "Sales", "Transformation_Digitale", "EN")) {
  $docx = "$root\CV_Mohamed_Benchokroun_$k.docx"
  if (Test-Path $docx) { Remove-Item $docx -Force }
  [System.IO.Compression.ZipFile]::CreateFromDirectory("$root\out\$k", $docx)
  & "$root\render.ps1" -Docx $docx -Pdf "$root\CV_Mohamed_Benchokroun_$k.pdf" -Png "$root\prev_$k.png"
}
