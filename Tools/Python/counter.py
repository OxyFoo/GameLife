import os

def Counter(path, ext):
    lines = 0
    dirs = os.listdir(path)
    for i in range(len(dirs)):
        if dirs[i] in ignoreDirs:
            continue
        name = path + "/" + dirs[i]
        if os.path.isdir(name):
            # Is Directory
            lines += Counter(name, ext)
        else:
            # Is File
            if name.split('.')[-1] == ext:
                # File is code
                file = open(name, 'r', encoding='utf8', errors='ignore')
                nb_lines = len(file.readlines())
                #print("{}{} lines".format(name.ljust(50), str(nb_lines).rjust(4)))
                lines += nb_lines
                file.close()
    return lines

def CountAll():
    lines = { 'total': 0 }
    for ext in exts:
        lines[ext] = 0

    for path in paths:
        for ext in exts:
            nb = Counter(path, ext)
            lines[ext] += nb
            lines['total'] += nb

    return lines

paths = [
    "../../serverHTTP",
    "../../serverTCP",
    "../../src"
]
exts = [ "js", "php" ]
ignoreDirs = [ "Public" ]

os.system("cls || clear")
nb_lines = CountAll()
print(nb_lines)
