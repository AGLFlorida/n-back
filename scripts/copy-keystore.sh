#!/bin/bash
if [ ! -d "android" ]; then
  echo "Android folder not found! Did you run 'npx expo prebuild --clean'?"
  exit 1
fi

cp release.keystore android/app/release.keystore

ANDROID_KEYSTORE_PASSWORD=$(grep ANDROID_KEYSTORE_PASSWORD .env | cut -d'"' -f2)
ANDROID_KEY_ALIAS=$(grep ANDROID_KEY_ALIAS .env | cut -d'"' -f2)
ANDROID_KEY_PASSWORD=$(grep ANDROID_KEY_PASSWORD .env | cut -d'"' -f2)

# Create keystore.properties dynamically
cat > android/keystore.properties << EOL
storeFile=release.keystore
storePassword=${ANDROID_KEYSTORE_PASSWORD}
keyAlias=${ANDROID_KEY_ALIAS}
keyPassword=${ANDROID_KEY_PASSWORD}
EOL

echo "Keystore setup complete."
