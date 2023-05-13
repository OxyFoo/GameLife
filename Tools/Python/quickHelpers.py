#
# Code obsolète
#

import requests

URL = 'https://www.oxyfoo.com/App/GameLife/test.php?action=quickAddHelper'
FILE = 'helpers.txt'
SEP = ','
PWD = 'blablajaivraiment0imag!nati0npourlesmotsdepasseuntrucdefou' # Semblant de sécurité

with open(FILE, 'r') as f:
    for line in f:
        if len(line) <= 1: continue
        if not SEP in line: continue
        l = line[:-1] if "\n" in line else line # Enlever la fin de ligne si il y en a une (\n)
        name, type, trad = l[:-1].split(SEP)
        data = { 'Password': PWD, 'Name': name, 'Type': type, 'Trad': trad }
        requests.post(URL, data=data)