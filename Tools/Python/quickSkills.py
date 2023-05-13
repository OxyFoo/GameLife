#
# Code obsolète
#

import requests

URL = 'https://www.oxyfoo.com/App/GameLife/test.php?action=quickAddSkill'
FILE = 'skills.txt'
SEP = ','
PWD = 'blablajaivraiment0imag!nati0npourlesmotsdepasseuntrucdefou'

with open(FILE, 'r') as f:
    for line in f:
        if len(line) <= 1: continue
        if not SEP in line: continue
        l = line[:-1] if "\n" in line else line
        name, trad, cat, Sag, Int, Con, For, End, Dex, Agi = l.split(SEP)
        data = { 'Password': PWD, 'Name': name, 'Translations': trad, 'CategoryID': cat, 'Wisdom': Sag, 'Intelligence': Int, 'Confidence': Con, 'Strength': For, 'Stamina': End, 'Dexterity': Dex, 'Agility': Agi }
        requests.post(URL, data=data)