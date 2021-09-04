import requests

URL = 'https://www.oxyfoo.com/App/GameLife/test.php?action=quickAddTesteur'
FILE = 'betatesteurs.txt'
PWD = 'blablajaivraiment0imag!nati0npourlesmotsdepasseuntrucdefou'

with open(FILE, 'r') as f:
    for line in f:
        if len(line) <= 1: continue
        mail = line[:-1] if "\n" in line else line
        data = { 'Password': PWD, 'Mail': mail }
        requests.post(URL, data=data)