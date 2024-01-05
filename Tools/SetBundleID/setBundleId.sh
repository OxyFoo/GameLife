#!/bin/bash

# Stop on error
set -e

ANDROID_INFO_PATH="./android/app/google-services.json"
IOS_INFO_PATH="./ios/GoogleService-Info.plist"

# If no new bundle ID is provided, exit
if [ -z "$1" ]; then
    echo -e "No new bundle ID provided."
    echo -e "Usage: ./setBundleId.sh <new_bundle_id>"
    echo -e "\tThis will update the bundle ID in the following files:"
    echo -e "\t\t$ANDROID_INFO_PATH"
    echo -e "\t\t$IOS_INFO_PATH"
    echo -e "Usage: ./setBundleId.sh --show"
    echo -e "\tThis will show the current bundle ID."
    exit 1
fi

set_bundle_IDs() {
    ANDROID_BUNDLE_ID=$(grep "bundle_id" $ANDROID_INFO_PATH | awk -F '"' '{print $4}')
    IOS_BUNDLE_ID=$(grep -A 1 "<key>BUNDLE_ID</key>" $IOS_INFO_PATH | awk -F'[<>]' '/string/ {print $3}')
    IOS_BUNDLE_ID_EXPORT=$(grep -A 2 "<key>provisioningProfiles</key>" $IOS_INFO_PATH | awk -F'[<>]' 'NR==3 {print $3}')
}

show_bundle_IDs() {
    echo ""
    echo -e "Android:\t$ANDROID_BUNDLE_ID"
    echo -e "iOS:\t\t$IOS_BUNDLE_ID"
    echo -e "iOS Export:\t$IOS_BUNDLE_ID_EXPORT"
    echo ""
}

check_bundle_IDs() {
    if [ "$ANDROID_BUNDLE_ID" != "$IOS_BUNDLE_ID" ] || [ "$ANDROID_BUNDLE_ID" != "$IOS_BUNDLE_ID_EXPORT" ]; then
        echo "Bundle IDs are different.";
        exit 1
    fi
}

update_bundle_IDs() {
    NEW_BUNDLE_ID="$1"

    if [ "$(uname)" == "Linux" ]; then
        sed -i "s/\"bundle_id\": \"$ANDROID_BUNDLE_ID\"/\"bundle_id\": \"$NEW_BUNDLE_ID\"/" $ANDROID_INFO_PATH
        sed -i "/<key>BUNDLE_ID<\/key>/{n;s/>.*/>$NEW_BUNDLE_ID<\/string>/;}" $IOS_INFO_PATH
        sed -i "/<key>provisioningProfiles<\/key>/,/<\/dict>/ s|<key>$IOS_BUNDLE_ID_EXPORT<\/key>|<key>$NEW_BUNDLE_ID<\/key>|" $IOS_INFO_PATH
    elif [ "$(uname)" == "Darwin" ]; then
        sed -i '' "s/\"bundle_id\": \"$ANDROID_BUNDLE_ID\"/\"bundle_id\": \"$NEW_BUNDLE_ID\"/" $ANDROID_INFO_PATH
        sed -i '' "/<key>BUNDLE_ID<\/key>/{n;s/>.*/>$NEW_BUNDLE_ID<\/string>/;}" $IOS_INFO_PATH
        sed -i '' "/<key>provisioningProfiles<\/key>/,/<\/dict>/ s|<key>$IOS_BUNDLE_ID_EXPORT<\/key>|<key>$NEW_BUNDLE_ID<\/key>|" $IOS_INFO_PATH
    else
        echo "Unsupported OS."
        exit 1
    fi
    echo "Bundle IDs updated."
}

# Show current bundle IDs
set_bundle_IDs
check_bundle_IDs

if [ "$1" == "--show" ]; then
    echo "$ANDROID_BUNDLE_ID" # All bundle IDs are the same
    exit 0
fi

# Update bundle IDs
show_bundle_IDs
update_bundle_IDs "$1"

# Show new bundle IDs
set_bundle_IDs
show_bundle_IDs
check_bundle_IDs
