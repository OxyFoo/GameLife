import os

def Counter(path):
    lines = 0
    dirs = os.listdir(path)
    for i in range(len(dirs)):
        if dirs[i] in ignoreDirs:
            continue
        name = path + "/" + dirs[i]
        if os.path.isdir(name):
            # Is Directory
            lines += Counter(name)
        else:
            # Is File
            if name.split('.')[-1] in exts:
                # File is code
                file = open(name, 'r')
                nb_lines = len(file.readlines())
                print("{}{} lines".format(name.ljust(50), str(nb_lines).rjust(4)))
                lines += nb_lines
                file.close()
    return lines

exts = [ "js", "php" ]
ignoreDirs = ['beta']

os.system("cls || clear")

nb_lines = Counter("../Server")
nb_lines += Counter("../src")
#nb_lines = Counter("../src/Themes")
print("\nTotal :".ljust(50) + str(nb_lines).rjust(4) + ' lines')
