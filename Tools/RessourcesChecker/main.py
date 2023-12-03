import json
from utils import read_file, have_same_keys, have_same_keys_js



#
# Fichiers à comparer
#
lang_files = [
    '../../res/langs/fr.json',
    '../../res/langs/en.json'
]
theme_files = [
    '../../res/themes/main.js',
    '../../res/themes/light.js'
]



#
# Global vars
#
status = 0



#
# Comparaison des fichiers de langues
#
for i in range(len(lang_files) - 1):
    lang1_file = lang_files[i]
    lang2_file = lang_files[i+1]
    lang1 = json.loads(read_file(lang1_file))
    lang2 = json.loads(read_file(lang2_file))

    print('> Comparing \'{}\' and \'{}\''.format(lang1_file, lang2_file))
    if have_same_keys(lang1, lang2):
        print('[+] Both json have the same keys.')
    else:
        print('[-] Both json do not have the same keys.')
        status = 1



#
# Comparaison des fichiers de thèmes
#
print()
for i in range(len(theme_files) - 1):
    theme1_file = theme_files[i]
    theme2_file = theme_files[i+1]
    theme1 = read_file(theme1_file).splitlines()
    theme2 = read_file(theme2_file).splitlines()

    print('> Comparing \'{}\' and \'{}\''.format(theme1_file, theme2_file))
    status_js = have_same_keys_js(theme1, theme2)
    if status_js == 0:
        print('[+] Both themes have the same keys.')
    else:
        if status_js == 1:
            print('[-] Both js do not have the same length.')
        elif status_js == 2:
            print('[-] Both js do not have the same keys.')
        status = 1



#
# Résultat
#
exit(status)
