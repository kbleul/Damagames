// Retrieve the latest tag using git describe
$tag = trim(shell_exec('git describe --tags --abbrev=0'));

// Update the version file with the tag
$versionFilePath = '../frontend/src/version.js';
$versionFileContent = "const VERSION = '$tag';\nexport default VERSION;\n";
file_put_contents($versionFilePath, $versionFileContent);