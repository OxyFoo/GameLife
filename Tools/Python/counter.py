import os

def Counter(path, ext):
    files = 0
    lines = 0
    dirs = os.listdir(path)
    for i in range(len(dirs)):
        if dirs[i] in ignoreDirs:
            continue
        name = path + '/' + dirs[i]
        if os.path.isdir(name):
            # Is Directory
            result = Counter(name, ext)
            files += result[0]
            lines += result[1]
        else:
            # Is File
            if name.split('.')[-1] == ext:
                if dirs[i] in ignoreFiles:
                    continue
                # File is code
                file = open(name, 'r', encoding='utf8', errors='ignore')
                nb_lines = len(file.readlines())
                #print('{}{} lines'.format(name.ljust(50), str(nb_lines).rjust(4)))
                files += 1
                lines += nb_lines
                file.close()
    return files, lines



##### Config #####

paths = [
    '../../serverHTTP',
    '../../serverTCP',
    '../../src'
]
exts = [
    'js',
    'php'
]
ignoreDirs = [
    'Public'
]
ignoreFiles = [
    'test.php'
]



##### Script #####

files = { 'total': 0 }
lines = { 'total': 0 }
for ext in exts:
    files[ext] = 0
    lines[ext] = 0
    for path in paths:
        nbFiles, nbLines = Counter(path, ext)
        files[ext] += nbFiles
        files['total'] += nbFiles
        lines[ext] += nbLines
        lines['total'] += nbLines

average = {}
for key in files:
    if key == 'total':
        continue
    average[key] = round(100 * lines[key] / lines['total'], 2)

print('Files:', files)
print('Lines:', lines)
print('Ratio:', average)
print('Average lines per file:', lines['total'] / files['total'])