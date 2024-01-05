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
    # Android
    echo -e "\tAndroid"
    echo -e "New Bundle ID: com.gamelife.test"
    echo -ne "Replacing..."
    if [ "$(uname)" == "Linux" ]; then
        EDITED_FILES=$(find ./ \
            -type d -name res -prune -o \
            -type d -name Tools -prune -o \
            -type d -name node_modules -prune -o \
            -type f -regex '.*\.\(gradle\|pro\|xml\|js\|java\)' \
            -exec sh -c 'grep -q "com.gamelife" "{}" && sed -i "s/com.gamelife/com.gamelife.test/g" "{}" && echo "{}"' \;)
    elif [ "$(uname)" == "Darwin" ]; then
        EDITED_FILES=$(find ./ \
            -type d -name res -prune -o \
            -type d -name Tools -prune -o \
            -type d -name node_modules -prune -o \
            -type f -regex '.*\.\(gradle\|pro\|xml\|js\|java\)' \
            -exec sh -c 'grep -q "com.gamelife" "{}" && sed -i '' "s/com.gamelife/com.gamelife.test/g" "{}" && echo "{}"' \;)
    fi
    echo -e "\rEdited files: $(echo "$EDITED_FILES" | wc -l)"

    # iOS
    echo -e "\n\tiOS"
    echo -e "New Bundle ID: GameLife.test"
    echo -ne "Replacing..."

    if [ "$(uname)" == "Linux" ]; then
        sed -i 's/PRODUCT_NAME = GameLife;/PRODUCT_NAME = GameLife.test;/g' ./ios/GameLife.xcodeproj/project.pbxproj
    elif [ "$(uname)" == "Darwin" ]; then
        sed -i '' 's/PRODUCT_NAME = GameLife;/PRODUCT_NAME = GameLife.test;/g' ./ios/GameLife.xcodeproj/project.pbxproj
    fi
    echo -e "\rEdited files: 1"
else
    echo "Unsupported environment."
    exit 1
fi
