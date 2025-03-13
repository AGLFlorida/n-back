#!/bin/bash

# Default values
source_path=""

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -p|--path) source_path="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Check if source path is provided
if [ -z "$source_path" ]; then
    echo "Error: Please provide path to source icon with -p or --path"
    echo "Usage: ./generate_icons.sh -p path/to/icon.png"
    exit 1
fi

# Check if source file exists
if [ ! -f "$source_path" ]; then
    echo "Error: Source file does not exist: $source_path"
    exit 1
fi

# Check if source is PNG
if [[ ! "$source_path" =~ \.png$ ]]; then
    echo "Error: Source file must be a PNG file"
    exit 1
fi

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed"
    echo "Please install it with: brew install ffmpeg"
    exit 1
fi

# Check source image dimensions using ffprobe
dimensions=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$source_path")
if [ "$dimensions" != "1024x1024" ]; then
    echo "Error: Source image must be 1024x1024 pixels"
    echo "Current dimensions: $dimensions"
    exit 1
fi

# Create output directories
mkdir -p assets/images
mkdir -p assets/favicon

echo "Generating app icons..."

# Copy original for iOS App Store (1024x1024)
cp "$source_path" "assets/images/app-icon.png"

# Generate Android adaptive icon (1024x1024)
cp "$source_path" "assets/images/adaptive-icon.png"

# Generate Android notification icon (96x96)
ffmpeg -i "$source_path" -vf "scale=96:96" -y "assets/images/notification-icon.png" 2>/dev/null

echo "Generating favicon series..."

# Standard favicon sizes and names (as array of "size:filename" pairs)
favicon_pairs=(
    "16:favicon-16x16.png"
    "32:favicon-32x32.png"
    "48:favicon-48x48.png"
    "96:favicon-96x96.png"
    "128:favicon-128x128.png"
    "196:favicon-196x196.png"
    "256:favicon-256x256.png"
)

# Generate each favicon size
for pair in "${favicon_pairs[@]}"; do
    size="${pair%%:*}"
    filename="${pair#*:}"
    ffmpeg -i "$source_path" -vf "scale=${size}:${size}" -y "assets/favicon/$filename" 2>/dev/null
done

# Generate .ico file with multiple sizes
ffmpeg -i "$source_path" -vf "scale=256:256,scale=16:16" -y "assets/favicon/favicon.ico" 2>/dev/null

echo "Done! Assets generated:"
echo ""
echo "App Icons (in assets/images/):"
echo " app-icon.png (1024x1024) - iOS App Store"
echo " adaptive-icon.png (1024x1024) - Android Adaptive Icon"
echo " notification-icon.png (96x96) - Android Notifications"
echo ""
echo "Favicons (in assets/favicon/):"
for pair in "${favicon_pairs[@]}"; do
    size="${pair%%:*}"
    filename="${pair#*:}"
    echo " $filename (${size}x${size}px)"
done
echo " favicon.ico (multi-size)"
echo ""
echo "Next steps:"
echo "1. Update app.json to reference the app icons"
echo "2. Add favicon references to your web index.html:"
echo ""
echo "<link rel=\"icon\" type=\"image/x-icon\" href=\"favicon.ico\">"
echo "<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"favicon-16x16.png\">"
echo "<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"favicon-32x32.png\">"
echo "<link rel=\"icon\" type=\"image/png\" sizes=\"96x96\" href=\"favicon-96x96.png\">"
echo "<link rel=\"icon\" type=\"image/png\" sizes=\"196x196\" href=\"favicon-196x196.png\">"
echo ""
echo "3. Run 'expo prebuild' to generate native assets"
