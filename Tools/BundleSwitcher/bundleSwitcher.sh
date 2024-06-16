#!/bin/bash

# Stop on error
set -e

# If no environment is provided, exit
if [ -z "$1" ]; then
    echo -e "No environment provided."
    echo -e "Usage:"
    echo -e "\t./bundleSwitcher.sh <environment>"
    echo -e "Environments:"
    echo -e "\ttest"
    exit 1
fi

# If not Linux or macOS, exit
if [ "$(uname)" != "Linux" ] && [ "$(uname)" != "Darwin" ]; then
    echo -e "Unsupported platform: $(uname)"
    echo -e "Supported platforms: Linux, macOS"
    exit 1
fi

if [ "$1" == "test" ]; then
    old_app_name="GameLife"
    new_app_name="GameLife Test"
    old_package_name="com.gamelife"
    new_package_name="com.gamelife.test"
    old_bundle_id="GameLife"
    new_bundle_id="GameLife.test"
else
    echo "Unsupported environment."
    exit 1
fi

# Android
echo -e "\tAndroid"
echo -e "App Name: $old_app_name => $new_app_name"
echo -e "Bundle ID: $old_package_name => $new_package_name"
echo -ne "Replacing..."
if [ "$(uname)" == "Linux" ]; then
    EDITED_FILES=$(find ./ \
        -type d -name res -prune -o \
        -type d -name Tools -prune -o \
        -type d -name node_modules -prune -o \
        -type f -regex '.*\.\(gradle\|pro\|xml\|js\|java\)' \
        -exec sh -c 'grep -q "$1" "{}" && sed -i "s/$1/$2/g" "{}" && echo "{}"' _ "${old_package_name}" "${new_package_name}" \;)

    # Change App Name
    APP_NAME_CHANGED_FILES=$(find ./android/app/src/main/res/values/ -name strings.xml -exec sh -c 'grep -q "$1" "{}" && sed -i "s/$1/$2/g" "{}" && echo "{}"' _ "${old_app_name}" "${new_app_name}" \;)
    EDITED_FILES="$EDITED_FILES\n$APP_NAME_CHANGED_FILES"
elif [ "$(uname)" == "Darwin" ]; then
    EDITED_FILES=$(find ./ \
        -type d -name res -prune -o \
        -type d -name Tools -prune -o \
        -type d -name node_modules -prune -o \
        -type f -regex '.*\.\(gradle|pro|xml|js|java\)' \
        -exec sh -c 'grep -q "$1" "{}" && sed -i "" -e "s/$1/$2/g" "{}" && echo "{}"' _ "${old_package_name}" "${new_package_name}" \;)

    # Change App Name
    APP_NAME_CHANGED_FILES=$(find ./android/app/src/main/res/values/ -name strings.xml -exec sh -c 'grep -q "$1" "{}" && sed -i "" -e "s/$1/$2/g" "{}" && echo "{}"' _ "${old_app_name}" "${new_app_name}" \;)
    EDITED_FILES="$EDITED_FILES\n$APP_NAME_CHANGED_FILES"
fi
echo -e "\rEdited files: $(echo "$EDITED_FILES" | wc -l | xargs)"

# iOS
echo -e "\n\tiOS"
echo -e "Bundle ID: $old_bundle_id => $new_bundle_id"
echo -ne "Replacing..."

if [ "$(uname)" == "Linux" ]; then
    sed -i "s/PRODUCT_NAME = $old_bundle_id;/PRODUCT_NAME = $new_bundle_id;/g" ./ios/GameLife.xcodeproj/project.pbxproj
    sed -i "/PRODUCT_BUNDLE_IDENTIFIER = \"org.reactjs.native.example.\$(PRODUCT_NAME:rfc1034identifier)\";/a\\\t\t\t\t\"PRODUCT_BUNDLE_IDENTIFIER[sdk=iphoneos*]\" = org.reactjs.native.example.$new_bundle_id;" ./ios/GameLife.xcodeproj/project.pbxproj
    sed -i "s/<string>org.reactjs.native.example.$old_bundle_id/<string>org.reactjs.native.example.$new_bundle_id/g" ./ios/GoogleService-Info.plist
    sed -i "s/94a736940ff60c834b1898/22189fa611f1a9d64b1898/g" ./ios/GoogleService-Info.plist
elif [ "$(uname)" == "Darwin" ]; then
    sed -i '' -e "s/PRODUCT_NAME = $old_bundle_id;/PRODUCT_NAME = $new_bundle_id;/g" ./ios/GameLife.xcodeproj/project.pbxproj
    sed -i '' -e "/PRODUCT_BUNDLE_IDENTIFIER = \"org.reactjs.native.example.\$(PRODUCT_NAME:rfc1034identifier)\";/a\\
				\"PRODUCT_BUNDLE_IDENTIFIER[sdk=iphoneos*]\" = org.reactjs.native.example.$new_bundle_id;" ./ios/GameLife.xcodeproj/project.pbxproj
    sed -i '' -e "s/<string>org.reactjs.native.example.$old_bundle_id/<string>org.reactjs.native.example.$new_bundle_id/g" ./ios/GoogleService-Info.plist
    sed -i '' -e "s/94a736940ff60c834b1898/22189fa611f1a9d64b1898/g" ./ios/GoogleService-Info.plist
fi
echo -e "\rEdited files: 2"
