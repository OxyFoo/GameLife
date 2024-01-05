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

if [ "$1" == "test" ]; then
    if [ "$(uname)" == "Linux" ]; then
        # Android
        echo -e "\tAndroid"
        echo -e "New Bundle ID: com.gamelife.test"
        echo -ne "Replacing..."
        EDITED_FILES=$(find ./ \
            -type d -name res -prune -o \
            -type d -name Tools -prune -o \
            -type d -name node_modules -prune -o \
            -type f -regex '.*\.\(gradle\|pro\|xml\|js\|java\)' \
            -exec sh -c 'grep -q "com.gamelife" "{}" && sed -i "s/com.gamelife/com.gamelife.test/g" "{}" && echo "{}"' \;)
        echo -e "\rEdited files: $(echo "$EDITED_FILES" | wc -l)"

        # iOS
        echo -e "\n\tiOS"
        echo -e "New Bundle ID: GameLife.test"
        echo -ne "Replacing..."
        sed -i 's/PRODUCT_NAME = GameLife;/PRODUCT_NAME = GameLife.test;/g' ./ios/GameLife.xcodeproj/project.pbxproj
        echo -e "\rEdited files: 1"
    elif [ "$(uname)" == "Darwin" ]; then
        # Android
        echo -e "\tAndroid"
        echo -e "New Bundle ID: com.gamelife.test"
        echo -ne "Replacing..."
        EDITED_FILES=$(find ./ \
            -type d -name res -prune -o \
            -type d -name Tools -prune -o \
            -type d -name node_modules -prune -o \
            -type f -regex '.*\.\(gradle\|pro\|xml\|js\|java\)' \
            -exec sh -c 'grep -q "com.gamelife" "{}" && sed -i '' "s/com.gamelife/com.gamelife.test/g" "{}" && echo "{}"' \;)
        echo -e "\rEdited files: $(echo "$EDITED_FILES" | wc -l)"

        # iOS
        echo -e "\n\tiOS"
        echo -e "New Bundle ID: GameLife.test"
        echo -ne "Replacing..."
        sed -i '' 's/PRODUCT_NAME = GameLife;/PRODUCT_NAME = GameLife.test;/g' ./ios/GameLife.xcodeproj/project.pbxproj
        echo -e "\rEdited files: 1"
    else
        echo "Unsupported OS."
        exit 1
    fi
else
    echo "Unsupported environment."
    exit 1
fi
