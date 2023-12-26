#!/bin/bash

# Arrête le script si une commande échoue
set -e

# Ask for version type or get parameters
if [ -z "$1" ]; then
    echo "What type of version do you want to update? (major/minor/patch)"
    read VERSION_TYPE
else
    VERSION_TYPE=$1
fi
if [ "$VERSION_TYPE" != "major" ] && [ "$VERSION_TYPE" != "minor" ] && [ "$VERSION_TYPE" != "patch" ]; then
    echo "Invalid version type. Exiting."
    exit 1
fi

# Paths
PACKAGE_JSON_PATH="./package.json"
ANDROID_BUILD_GRADLE_PATH="./android/app/build.gradle"
IOS_XCODEPROJ_PATH="./ios/GameLife.xcodeproj/project.pbxproj"

# Package.json version
PACKAGE_JSON_VERSION=$(grep version $PACKAGE_JSON_PATH | head -1 | awk '{ print $2 }' | tr -d '",')
PACKAGE_JSON_VERSION_NAME=$(grep version $PACKAGE_JSON_PATH | head -1 | awk '{ print $2 }' | tr -d '",')

# Increment package.json version
if [ "$VERSION_TYPE" == "major" ]; then
    NEXT_PACKAGE_JSON_VERSION=$(echo $PACKAGE_JSON_VERSION | awk -F. '{$1 = $1 + 1; $2 = 0; $3 = 0;} 1' | sed 's/ /./g')
    NEXT_PACKAGE_JSON_VERSION_NAME=$(echo $PACKAGE_JSON_VERSION_NAME | awk -F. '{$1 = $1 + 1; $2 = 0; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "minor" ]; then
    NEXT_PACKAGE_JSON_VERSION=$(echo $PACKAGE_JSON_VERSION | awk -F. '{$2 = $2 + 1; $3 = 0;} 1' | sed 's/ /./g')
    NEXT_PACKAGE_JSON_VERSION_NAME=$(echo $PACKAGE_JSON_VERSION_NAME | awk -F. '{$2 = $2 + 1; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "patch" ]; then
    NEXT_PACKAGE_JSON_VERSION=$(echo $PACKAGE_JSON_VERSION | awk -F. '{$3 = $3 + 1;} 1' | sed 's/ /./g')
    NEXT_PACKAGE_JSON_VERSION_NAME=$(echo $PACKAGE_JSON_VERSION_NAME | awk -F. '{$3 = $3 + 1;} 1' | sed 's/ /./g')
fi

# Android versions
ANDROID_VERSION_CODE=$(grep versionCode $ANDROID_BUILD_GRADLE_PATH | head -1 | awk '{ print $2 }')
ANDROID_VERSION_NAME=$(grep versionName $ANDROID_BUILD_GRADLE_PATH | head -1 | awk '{ print $2 }' | tr -d '"')

# Increment android version
NEXT_ANDROID_VERSION_CODE=$(($ANDROID_VERSION_CODE + 1))
if [ "$VERSION_TYPE" == "major" ]; then
    NEXT_ANDROID_VERSION_NAME=$(echo $ANDROID_VERSION_NAME | awk -F. '{$1 = $1 + 1; $2 = 0; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "minor" ]; then
    NEXT_ANDROID_VERSION_NAME=$(echo $ANDROID_VERSION_NAME | awk -F. '{$2 = $2 + 1; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "patch" ]; then
    NEXT_ANDROID_VERSION_NAME=$(echo $ANDROID_VERSION_NAME | awk -F. '{$3 = $3 + 1;} 1' | sed 's/ /./g')
fi

# iOS versions
IOS_BUILD_NUMBER=$(grep 'CURRENT_PROJECT_VERSION' $IOS_XCODEPROJ_PATH | head -1 | awk '{ print $3 }' | tr -d ';')
IOS_VERSION=$(grep 'MARKETING_VERSION' $IOS_XCODEPROJ_PATH | head -1 | awk '{ print $3 }' | tr -d ';')

# Increment iOS version
NEXT_IOS_BUILD_NUMBER=$(($IOS_BUILD_NUMBER + 1))
if [ "$VERSION_TYPE" == "major" ]; then
    NEXT_IOS_VERSION=$(echo $IOS_VERSION | awk -F. '{$1 = $1 + 1; $2 = 0; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "minor" ]; then
    NEXT_IOS_VERSION=$(echo $IOS_VERSION | awk -F. '{$2 = $2 + 1; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "patch" ]; then
    NEXT_IOS_VERSION=$(echo $IOS_VERSION | awk -F. '{$3 = $3 + 1;} 1' | sed 's/ /./g')
fi

show_versions() {
    echo ""
    echo -e "Package.json"
    echo -e "\tVersion:\t$PACKAGE_JSON_VERSION\t-> [\e[32m$NEXT_PACKAGE_JSON_VERSION\e[0m]"
    echo -e "\tVersionName:\t$PACKAGE_JSON_VERSION_NAME\t-> [\e[32m$NEXT_PACKAGE_JSON_VERSION_NAME\e[0m]"
    echo -e "Android"
    echo -e "\tVersionCode:\t$ANDROID_VERSION_CODE\t-> [\e[32m$NEXT_ANDROID_VERSION_CODE\e[0m]"
    echo -e "\tVersionName:\t$ANDROID_VERSION_NAME\t-> [\e[32m$NEXT_ANDROID_VERSION_NAME\e[0m]"
    echo -e "iOS"
    echo -e "\tBuild:\t\t$IOS_BUILD_NUMBER\t-> [\e[32m$NEXT_IOS_BUILD_NUMBER\e[0m]"
    echo -e "\tVersion:\t$IOS_VERSION\t-> [\e[32m$NEXT_IOS_VERSION\e[0m]"
    echo ""
}

update_package_json_version() {
    sed -i "s/\"version\": \"$PACKAGE_JSON_VERSION\"/\"version\": \"$NEXT_PACKAGE_JSON_VERSION\"/" $PACKAGE_JSON_PATH
    sed -i "s/\"versionName\": \"$PACKAGE_JSON_VERSION_NAME\"/\"versionName\": \"$NEXT_PACKAGE_JSON_VERSION_NAME\"/" $PACKAGE_JSON_PATH
    echo "Version package.json mise à jour."
}

update_android_version() {
    sed -i "s/versionCode $ANDROID_VERSION_CODE/versionCode $NEXT_ANDROID_VERSION_CODE/" $ANDROID_BUILD_GRADLE_PATH
    sed -i "s/versionName \"$ANDROID_VERSION_NAME\"/versionName \"$NEXT_ANDROID_VERSION_NAME\"/" $ANDROID_BUILD_GRADLE_PATH
    echo "Version Android mise à jour."
}

update_ios_version() {
    sed -i "s/CURRENT_PROJECT_VERSION = $IOS_BUILD_NUMBER;/CURRENT_PROJECT_VERSION = $NEXT_IOS_BUILD_NUMBER;/" $IOS_XCODEPROJ_PATH
    sed -i "s/MARKETING_VERSION = $IOS_VERSION;/MARKETING_VERSION = $NEXT_IOS_VERSION;/" $IOS_XCODEPROJ_PATH
    echo "Version iOS mise à jour."
}

show_versions

# Ask for confirmation if not --force
if [ "$2" != "--force" ]; then
    echo "Voulez-vous mettre à jour les versions? (y/N)"
    read ANSWER
    echo ""
else
    ANSWER="y"
fi

if [ "$ANSWER" == "y" ]; then
    update_package_json_version
    update_android_version
    update_ios_version
else
    echo "Mise à jour annulée."
fi
