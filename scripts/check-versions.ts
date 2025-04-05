import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(__dirname, '..');

interface PackageJson {
  version: string;
  build?: string;
  androidVersionCode?: number;
}

interface AppJson {
  expo: {
    version: string;
    ios?: {
      buildNumber: string;
    };
    android?: {
      versionCode: number;
    };
  };
}

interface Versions {
  source: string;
  version?: string;
  buildNumber?: string;
  versionCode?: number;
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    const fullPath = path.join(projectRoot, filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(content) as T;
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
    return null;
  }
}

function getXcodeBuildVersion(): Versions | null {
  try {
    const iosPath = path.join(projectRoot, 'ios');
    if (!fs.existsSync(iosPath)) {
      return null;
    }

    // Read the project.pbxproj file
    const pbxprojPath = path.join(iosPath, 'nback.xcodeproj', 'project.pbxproj');
    const content = fs.readFileSync(pbxprojPath, 'utf8');

    // Extract MARKETING_VERSION and CURRENT_PROJECT_VERSION
    const marketingVersion = content.match(/MARKETING_VERSION = ([\d.]+)/)?.[1];
    const buildNumber = content.match(/CURRENT_PROJECT_VERSION = ([\d.]+)/)?.[1];

    return {
      source: 'Xcode',
      version: marketingVersion,
      buildNumber: buildNumber
    };
  } catch (e) {
    console.error('Error reading Xcode version:', e);
    return null;
  }
}

function getGradleVersions(): Versions | null {
  try {
    const androidPath = path.join(projectRoot, 'android');
    if (!fs.existsSync(androidPath)) {
      return null;
    }

    const gradlePath = path.join(androidPath, 'app', 'build.gradle');
    const content = fs.readFileSync(gradlePath, 'utf8');

    const versionCode = content.match(/versionCode\s+(\d+)/)?.[1];
    const versionName = content.match(/versionName\s+"([\d.]+)"/)?.[1];

    return {
      source: 'Gradle',
      version: versionName,
      versionCode: versionCode ? parseInt(versionCode) : undefined
    };
  } catch (e) {
    console.error('Error reading Gradle version:', e);
    return null;
  }
}

function checkVersions() {
  const versions: Versions[] = [];
  const updates: string[] = [];

  // Read package.json
  const packageJson = readJsonFile<PackageJson>('package.json');
  if (packageJson) {
    versions.push({
      source: 'package.json',
      version: packageJson.version,
      buildNumber: packageJson.build,
      versionCode: parseInt(packageJson.build || '0')
    });
  }

  // Read app.json
  const appJson = readJsonFile<AppJson>('app.json');
  if (appJson) {
    versions.push({
      source: 'app.json',
      version: appJson.expo.version,
      buildNumber: appJson.expo.ios?.buildNumber,
      versionCode: appJson.expo.android?.versionCode
    });
  }

  // Get Xcode versions
  const xcodeVersions = getXcodeBuildVersion();
  if (xcodeVersions) {
    versions.push(xcodeVersions);
  }

  // Get Android versions
  const gradleVersions = getGradleVersions();
  if (gradleVersions) {
    versions.push(gradleVersions);
  }

  // Compare versions
  let hasDiscrepancy = false;
  const baseVersion = versions[0].version;
  const baseBuild = versions[0].buildNumber;
  const baseVersionCode = versions[0].versionCode;

  console.log('\nVersion Check Results:');
  console.log('=====================');

  versions.forEach(v => {
    console.log(`\n${v.source}:`);
    if (v.version) {
      const versionMismatch = v.version !== baseVersion;
      console.log(`  Version: ${v.version}${versionMismatch ? ' ⚠️' : ''}`);
      if (versionMismatch) {
        switch (v.source) {
          case 'app.json':
            updates.push(`Update ${path.join(projectRoot, 'app.json')}: "expo.version" should be "${baseVersion}"`);
            break;
          case 'Xcode':
            updates.push(`Update ${path.join(projectRoot, 'ios/nback.xcodeproj/project.pbxproj')}: MARKETING_VERSION should be "${baseVersion}"`);
            break;
          case 'Gradle':
            updates.push(`Update ${path.join(projectRoot, 'android/app/build.gradle')}: versionName should be "${baseVersion}"`);
            break;
        }
      }
    }
    if (v.buildNumber) {
      const buildMismatch = v.buildNumber !== baseBuild;
      console.log(`  iOS Build Number: ${v.buildNumber}${buildMismatch ? ' ⚠️' : ''}`);
      if (buildMismatch) {
        switch (v.source) {
          case 'app.json':
            updates.push(`Update ${path.join(projectRoot, 'app.json')}: "expo.ios.buildNumber" should be "${baseBuild}"`);
            break;
          case 'Xcode':
            updates.push(`Update ${path.join(projectRoot, 'ios/nback.xcodeproj/project.pbxproj')}: CURRENT_PROJECT_VERSION should be "${baseBuild}"`);
            break;
        }
      }
    }
    if (v.versionCode) {
      const versionCodeMismatch = v.versionCode !== baseVersionCode;
      console.log(`  Android Version Code: ${v.versionCode}${versionCodeMismatch ? ' ⚠️' : ''}`);
      if (versionCodeMismatch) {
        switch (v.source) {
          case 'app.json':
            updates.push(`Update ${path.join(projectRoot, 'app.json')}: "expo.android.versionCode" should be ${baseVersionCode}`);
            break;
          case 'Gradle':
            updates.push(`Update ${path.join(projectRoot, 'android/app/build.gradle')}: versionCode should be ${baseVersionCode}`);
            break;
        }
      }
    }

    if (v.version !== baseVersion || 
        (v.buildNumber && v.buildNumber !== baseBuild) //|| 
        // (v.versionCode && v.versionCode !== baseVersionCode)
    ) {
      hasDiscrepancy = true;
    }
  });

  if (!hasDiscrepancy) {
    console.log('\nAll versions match!');
  } else {
    console.log('\nVersion discrepancies found!');
    console.log('\nRequired updates:');
    console.log('----------------');
    updates.forEach(update => console.log(`- ${update}`));
    process.exit(1);
  }
}

checkVersions(); 