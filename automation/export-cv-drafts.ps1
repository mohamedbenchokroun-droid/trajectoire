param(
  [Parameter(Mandatory=$true)][string]$DraftDirectory
)

$ErrorActionPreference = 'Stop'
$draft = (Resolve-Path -LiteralPath $DraftDirectory).Path
$documents = Get-ChildItem -LiteralPath $draft -Filter '*.docx' -File
if ($documents.Count -ne 4) { throw "Quatre CV Word attendus, trouvés : $($documents.Count)" }
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  foreach ($file in $documents) {
    $pdf = [IO.Path]::ChangeExtension($file.FullName, '.pdf')
    if (Test-Path -LiteralPath $pdf) { throw "PDF déjà présent : $pdf" }
    $document = $word.Documents.Open($file.FullName, $false, $true)
    try {
      # Le gabarit Word ajoute une page finale vide ; seule la première page
      # contient le CV. L'export reprend la règle historique de pack.ps1.
      $document.ExportAsFixedFormat($pdf, 17, $false, 0, 3, 1, 1)
    } finally {
      $document.Close($false)
    }
    if (-not (Test-Path -LiteralPath $pdf -PathType Leaf)) { throw "Export absent : $pdf" }
    Write-Output ([IO.Path]::GetFileName($pdf))
  }
} finally {
  $word.Quit()
}
