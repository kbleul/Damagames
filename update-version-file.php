// Retrieve the latest tag using git describe
$tag = trim(shell_exec('git describe --tags --abbrev=0'));

// Extract the desired version format from the tag using regular expression
if (preg_match('/^v(\d+\.\d+\.\d+)-rc(\d+)$/', $tag, $matches)) {
// Update the version file for release candidate format
$versionFilePath = './frontend/src/version.js';
$versionFileContent = "export const VERSION = 'v{$matches[1]}-rc{$matches[2]}';";
file_put_contents($versionFilePath, $versionFileContent);
// Deploy to staging environment and run e2e tests
echo "Deploying to staging environment...";
} else if (preg_match('/^v(\d+\.\d+\.\d+)$/', $tag, $matches)) {
// Update the version file for stable release format
$versionFilePath = './frontend/src/version.js';
$versionFileContent = "export const VERSION = '{$matches[0]}';";
file_put_contents($versionFilePath, $versionFileContent);
// Deploy to production environment
echo "Deploying to production environment...";
} else {
echo "Tag format not supported!";
exit 1;
}