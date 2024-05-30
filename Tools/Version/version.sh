#!/bin/bash

#
# ./version.sh [major/minor/patch] [--version] ["What's new (fr)" "What's new (en)"] [--force]
#
# Exemples:
# ./version.sh major/minor/patch --version ["What's new (fr)" "What's new (en)"] [--force]
# ./version.sh major/minor/patch "What's new (fr)" "What's new (en)" --force
#

# "sed -i" compatibility Linux/MacOS
sedi() {
    case "$(uname)" in
        Linux*) sed -i "$@" ;;
        Darwin*) sed -i '' "$@" ;;
    esac
}

# Arrête le script si une commande échoue
set -e

# Get parameters
ARG_PRINT=false
ARG_FORCE=false
case " $@ " in
    *' --version '*) ARG_PRINT=true ;;
    *' --force '*) ARG_FORCE=true ;;
esac

# Ask for version type or get parameters
if [ -z "$1" ]; then
    printf "What type of version do you want to update? (major/minor/patch) "
    read VERSION_TYPE
else
    VERSION_TYPE=$1
fi
if [ "$VERSION_TYPE" != "major" ] && [ "$VERSION_TYPE" != "minor" ] && [ "$VERSION_TYPE" != "patch" ]; then
    printf "Invalid version type. Exiting.\n"
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
    NEXT_PACKAGE_JSON_VERSION=$(printf $PACKAGE_JSON_VERSION | awk -F. '{$1 = $1 + 1; $2 = 0; $3 = 0;} 1' | sed 's/ /./g')
    NEXT_PACKAGE_JSON_VERSION_NAME=$(printf $PACKAGE_JSON_VERSION_NAME | awk -F. '{$1 = $1 + 1; $2 = 0; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "minor" ]; then
    NEXT_PACKAGE_JSON_VERSION=$(printf $PACKAGE_JSON_VERSION | awk -F. '{$2 = $2 + 1; $3 = 0;} 1' | sed 's/ /./g')
    NEXT_PACKAGE_JSON_VERSION_NAME=$(printf $PACKAGE_JSON_VERSION_NAME | awk -F. '{$2 = $2 + 1; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "patch" ]; then
    NEXT_PACKAGE_JSON_VERSION=$(printf $PACKAGE_JSON_VERSION | awk -F. '{$3 = $3 + 1;} 1' | sed 's/ /./g')
    NEXT_PACKAGE_JSON_VERSION_NAME=$(printf $PACKAGE_JSON_VERSION_NAME | awk -F. '{$3 = $3 + 1;} 1' | sed 's/ /./g')
fi

# Only print version if --version anywhere in parameters without using grep
if $ARG_PRINT; then
    printf "$NEXT_PACKAGE_JSON_VERSION_NAME"
    exit 0
fi

# Android versions
ANDROID_VERSION_CODE=$(grep versionCode $ANDROID_BUILD_GRADLE_PATH | head -1 | awk '{ print $2 }')
ANDROID_VERSION_NAME=$(grep versionName $ANDROID_BUILD_GRADLE_PATH | head -1 | awk '{ print $2 }' | tr -d '"')

# Increment android version
NEXT_ANDROID_VERSION_CODE=$(($ANDROID_VERSION_CODE + 1))
if [ "$VERSION_TYPE" == "major" ]; then
    NEXT_ANDROID_VERSION_NAME=$(printf $ANDROID_VERSION_NAME | awk -F. '{$1 = $1 + 1; $2 = 0; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "minor" ]; then
    NEXT_ANDROID_VERSION_NAME=$(printf $ANDROID_VERSION_NAME | awk -F. '{$2 = $2 + 1; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "patch" ]; then
    NEXT_ANDROID_VERSION_NAME=$(printf $ANDROID_VERSION_NAME | awk -F. '{$3 = $3 + 1;} 1' | sed 's/ /./g')
fi

# iOS versions
IOS_BUILD_NUMBER=$(grep 'CURRENT_PROJECT_VERSION' $IOS_XCODEPROJ_PATH | head -1 | awk '{ print $3 }' | tr -d ';')
IOS_VERSION=$(grep 'MARKETING_VERSION' $IOS_XCODEPROJ_PATH | head -1 | awk '{ print $3 }' | tr -d ';')

# Increment iOS version
NEXT_IOS_BUILD_NUMBER=1
if [ "$VERSION_TYPE" == "major" ]; then
    NEXT_IOS_VERSION=$(printf $IOS_VERSION | awk -F. '{$1 = $1 + 1; $2 = 0; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "minor" ]; then
    NEXT_IOS_VERSION=$(printf $IOS_VERSION | awk -F. '{$2 = $2 + 1; $3 = 0;} 1' | sed 's/ /./g')
elif [ "$VERSION_TYPE" == "patch" ]; then
    NEXT_IOS_VERSION=$(printf $IOS_VERSION | awk -F. '{$3 = $3 + 1;} 1' | sed 's/ /./g')
fi

show_versions() {
    printf "Package.json\n"
    printf "\tVersion:\t$PACKAGE_JSON_VERSION\t-> [\e[32m$NEXT_PACKAGE_JSON_VERSION\e[0m]\n"
    printf "\tVersionName:\t$PACKAGE_JSON_VERSION_NAME\t-> [\e[32m$NEXT_PACKAGE_JSON_VERSION_NAME\e[0m]\n"
    printf "\nAndroid\n"
    printf "\tVersionCode:\t$ANDROID_VERSION_CODE\t-> [\e[32m$NEXT_ANDROID_VERSION_CODE\e[0m]\n"
    printf "\tVersionName:\t$ANDROID_VERSION_NAME\t-> [\e[32m$NEXT_ANDROID_VERSION_NAME\e[0m]\n"
    printf "\niOS\n"
    printf "\tBuild:\t\t$IOS_BUILD_NUMBER\t-> [\e[32m$NEXT_IOS_BUILD_NUMBER\e[0m]\n"
    printf "\tVersion:\t$IOS_VERSION\t-> [\e[32m$NEXT_IOS_VERSION\e[0m]\n"
    if [ ! -z "$1" ] && [ ! -z "$2" ]; then
        printf "What's new (fr)\n"
        printf "\t$1\n"
        printf "What's new (en)\n"
        printf "\t$2\n"
    fi
}

update_package_json_version() {
    sedi "s/\"version\": \"$PACKAGE_JSON_VERSION\"/\"version\": \"$NEXT_PACKAGE_JSON_VERSION\"/" $PACKAGE_JSON_PATH
    sedi "s/\"versionName\": \"$PACKAGE_JSON_VERSION_NAME\"/\"versionName\": \"$NEXT_PACKAGE_JSON_VERSION_NAME\"/" $PACKAGE_JSON_PATH
    printf "Version package.json mise à jour.\n"
}

update_android_version() {
    sedi "s/versionCode $ANDROID_VERSION_CODE/versionCode $NEXT_ANDROID_VERSION_CODE/" $ANDROID_BUILD_GRADLE_PATH
    sedi "s/versionName \"$ANDROID_VERSION_NAME\"/versionName \"$NEXT_ANDROID_VERSION_NAME\"/" $ANDROID_BUILD_GRADLE_PATH
    printf "Version Android mise à jour.\n"
}

update_ios_version() {
    sedi "s/CURRENT_PROJECT_VERSION = $IOS_BUILD_NUMBER;/CURRENT_PROJECT_VERSION = $NEXT_IOS_BUILD_NUMBER;/" $IOS_XCODEPROJ_PATH
    sedi "s/MARKETING_VERSION = $IOS_VERSION;/MARKETING_VERSION = $NEXT_IOS_VERSION;/" $IOS_XCODEPROJ_PATH
    printf "Version iOS mise à jour.\n"
}

update_whats_new() {
    # Save what's new (fr/en) if in parameters
    if [ ! -z "$1" ] && [ ! -z "$2" ]; then
        printf "$1\n" > ./distribution/whatsnew/whatsnew-fr-FR
        printf "$2\n" > ./distribution/whatsnew/whatsnew-en-US
        printf "What's new saved.\n"
    fi
}

show_versions $2 $3

# Ask for confirmation if not --force anywhere in parameters without using grep
if ! $ARG_FORCE; then
    printf "\nVoulez-vous mettre à jour les versions? (y/N) "
    read ANSWER
    printf "\n"
else
    ANSWER="y"
fi

if [ "$ANSWER" == "y" ]; then
    update_package_json_version
    update_android_version
    update_ios_version
    update_whats_new $2 $3
else
    printf "Mise à jour annulée.\n"
fi
