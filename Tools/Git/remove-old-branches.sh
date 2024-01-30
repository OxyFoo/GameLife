# Update repo && List branches | Keep only branches that are gone      | Delete branches
git fetch -p && git branch -vv | awk "/: (gone|disparue)]/{print \$1}" | xargs git branch -D
