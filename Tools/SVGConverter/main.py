import os
from reactnative import convertSvgToRN

pathSvg = '../../res/icons/svg'
pathIcons = '../../res/icons'

svgs = sorted(os.listdir(pathSvg))
icons = sorted(os.listdir(pathIcons))
if '.DS_Store' in svgs: svgs.remove('.DS_Store')
if '.DS_Store' in icons: icons.remove('.DS_Store')
print('Found {} svg'.format(len(svgs)))

# Remove old icons
removed = 0
for svg in svgs:
    jsFile = svg.replace('.svg', '.js')
    if os.path.exists(pathIcons + '/' + jsFile):
        os.remove(pathIcons + '/' + jsFile)
        removed += 1
if removed > 0:
    print('Removed {} old icons ({} ignored)'.format(removed, len(icons) - removed))

# Convert & save new icons
converted = 0
for svg in svgs:
    jsFile = svg.replace('.svg', '.js')
    if os.path.exists(pathIcons + '/' + jsFile):
        print('Icon {} already exists'.format(jsFile))
        continue

    # Read SVG
    f = open(pathSvg + '/' + svg, 'r')
    svgContent = f.read()
    f.close()

    # Convert
    rnContent = convertSvgToRN(svgContent)
    if rnContent is None:
        print('Failed to convert {}'.format(svg))
        continue

    # Format
    rnContent = rnContent.replace(' xmlns="http://www.w3.org/2000/svg"', '')
    rnContent = rnContent.replace('"', "'")

    # Save
    f = open(pathIcons + '/' + jsFile, 'w')
    f.write(rnContent)
    f.close()

    converted += 1
    print('Converted {}'.format(svg))
if converted > 0:
    print('Converted {} new icons'.format(converted))
