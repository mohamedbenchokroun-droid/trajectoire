param([string]$Docx, [string]$Pdf, [string]$Png)
# Word -> PDF
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($Docx, $false, $true)
$pages = $doc.ComputeStatistics(2)
$doc.ExportAsFixedFormat($Pdf, 17, $false, 0, 3, 1, 1)
$pages = $doc.ComputeStatistics(2)
$doc.Close($false)
$word.Quit()
"pages=$pages"
if (-not $Png) { return }
# PDF -> PNG (page 1) via Windows.Data.Pdf
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op, [type]$t) { $m = $asTask.MakeGenericMethod($t); $task = $m.Invoke($null, @($op)); $task.Wait() | Out-Null; $task.Result }
function AwaitAction($op) { $a = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' })[0]; $a.Invoke($null, @($op)).Wait() | Out-Null }
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime] | Out-Null
$file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($Pdf)) ([Windows.Storage.StorageFile])
$pdfDoc = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
for ($i = 0; $i -lt $pdfDoc.PageCount; $i++) {
  $page = $pdfDoc.GetPage($i)
  $opts = New-Object Windows.Data.Pdf.PdfPageRenderOptions
  $opts.DestinationWidth = 1100
  $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
  AwaitAction ($page.RenderToStreamAsync($stream, $opts))
  $net = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream.GetInputStreamAt(0))
  $out = $Png -replace '\.png$', "-$($i+1).png"
  $fs = [System.IO.File]::Create($out); $net.CopyTo($fs); $fs.Close()
  $out
}
