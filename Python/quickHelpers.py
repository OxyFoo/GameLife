import requests

URL = 'https://www.oxyfoo.com/App/GameLife/test.php?action=quickAddHelper'
FILE = 'helpers.txt'
SEP = ','

with open(FILE, 'r') as f:
    for line in f:
        if len(line) <= 1: continue
        if not SEP in line: continue
        name, type, trad = line[:-1].split(SEP)
        data = { 'Name': name, 'Type': type, 'Trad': trad }
        requests.post(URL, data=data)