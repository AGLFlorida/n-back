import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(__dirname, '..');
const pbxprojPath = path.join(projectRoot, 'ios/nback.xcodeproj/project.pbxproj');
const gradlePath = path.join(projectRoot, 'android/app/build.gradle');

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
const version = packageJson.version;
const buildNumber = packageJson.build;

// Update iOS
let pbxproj = fs.readFileSync(pbxprojPath, 'utf8');
pbxproj = pbxproj.replace(/MARKETING_VERSION = [\d.]+;/g, `MARKETING_VERSION = ${version};`);
pbxproj = pbxproj.replace(/CURRENT_PROJECT_VERSION = [\d.]+;/g, `CURRENT_PROJECT_VERSION = ${buildNumber};`);
fs.writeFileSync(pbxprojPath, pbxproj);
console.log(`Updated iOS version to ${version} (${buildNumber})`);

// Update Android
let gradle = fs.readFileSync(gradlePath, 'utf8');
gradle = gradle.replace(/versionCode \d+/g, `versionCode ${buildNumber}`);
gradle = gradle.replace(/versionName "[\d.]+"/g, `versionName "${version}"`);
fs.writeFileSync(gradlePath, gradle);
console.log(`Updated Android version to ${version} (${buildNumber})`); 