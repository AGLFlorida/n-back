#!/bin/bash

# TODO: this is way too manual but it works for now. Fastlane would be better but I got
# tired of fighting with it (for now).

# Array of device IDs
DEVICE_IDS=(
    "D0BA153C-122D-4DF2-875A-095B2B5A29DA"  
    "06AA21EA-093E-4F6C-86BC-1D356CD60624"  
    "7672B3C9-CAA1-43C2-A2E4-0D2C13EEBC9C" 
)

# Create screenshots directory if it doesn't exist
mkdir -p screenshots

# Function to get device details
get_device_details() {
    local device_id="$1"
    local device_name=$(xcrun simctl list devices | grep "$device_id" | sed -E 's/    (iPhone[^(]*).*/\1/' | xargs)
    echo "$device_name"
}

# Function to boot simulators
boot_simulators() {
    echo "Booting simulators..."
    # Open Simulator.app first
    open -a Simulator
    sleep 5  # Wait for Simulator to launch
    
    # Boot each device from the array
    for device_id in "${DEVICE_IDS[@]}"; do
        device_name=$(get_device_details "$device_id")
        echo "Booting $device_name..."
        xcrun simctl boot "$device_id" || true
    done
    
    echo "Installing app on simulators..."
    # Install on each device
    for device_id in "${DEVICE_IDS[@]}"; do
        device_name=$(get_device_details "$device_id")
        echo "Installing on $device_name..."
        npx expo run:ios --device="$device_name"
        sleep 10  # Wait for install to complete
    done
    
    echo "Simulators booted and app installed."
    echo ""
    echo "IMPORTANT: Before taking screenshots"
    echo "1. Wait at least 30 seconds for all apps to fully load"
    echo "2. Check ALL simulators for 'Refreshing...' banners"
    echo "3. If you see a banner, wait for it to disappear"
    echo "4. Only proceed with screenshots when all simulators are clear"
    echo ""
    read -p "Press Enter when all simulators are ready..."
}

# Function to take screenshots
take_screenshots() {
    # Ask for screenshot prefix
    echo "Enter prefix for screenshot files (e.g., 'home'):"
    read -p "> " prefix
    
    if [ -z "$prefix" ]; then
        echo "Error: Prefix cannot be empty"
        return 1
    fi
    
    echo "Taking screenshots of current screen..."
    echo "Checking for 'Refreshing...' banners..."
    sleep 2
    
    # Take screenshots of each device in the array
    for device_id in "${DEVICE_IDS[@]}"; do
        device_name=$(get_device_details "$device_id")
        echo "Taking screenshot of $device_name..."
        xcrun simctl io "$device_id" screenshot --type=png "screenshots/${prefix}_${device_name// /_}.png"
        sleep 1
    done
    
    echo "Screenshots saved in ./screenshots directory:"
    ls -1 "screenshots/${prefix}_"*
    
    # Verify with user
    echo ""
    echo "Please verify all screenshots are clear of banners."
    echo "If any have a banner, wait longer and try again."
}

# Function to close simulators
close_simulators() {
    echo "Shutting down all simulators..."
    xcrun simctl shutdown all
    killall "Simulator"
    echo "All simulators closed"
}

# Main menu loop
while true; do
    echo ""
    echo "Screenshot Tool Menu:"
    echo "1. Boot simulators and install app"
    echo "2. Take screenshots of current screen"
    echo "3. Close all simulators"
    echo "4. Quit"
    echo ""
    read -p "Enter your choice (1-4): " choice

    case $choice in
        1)
            boot_simulators
            ;;
        2)
            take_screenshots
            ;;
        3)
            close_simulators
            ;;
        4)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option. Please choose 1-4."
            ;;
    esac
done 