import re
from os import listdir, makedirs
from os.path import isfile, join, basename, splitext, exists

basepath = './stories/pages/'

def getText (file):
	f = open(file, 'r')
	return f.read()

def getTitle (text):
	mdTitle = re.search(r'^#\s+.*', text, flags = re.MULTILINE).group()
	return re.sub(r'#\s+', '', mdTitle)

def setListItem (file):
	filename = splitext(basename(file))[0]
	text = getText(join(basepath, file))
	title = getTitle(text)
	return "- [{}](/stories/?doc={})".format(title, filename)

if __name__ == '__main__':
	onlyfiles = [file for file in listdir(basepath) if isfile(join(basepath, file)) and file != '.DS_Store']
	listItems = [setListItem(file) for file in onlyfiles]
	listItems.sort()
	content = "<!-- !!DO NOT REMOVE!! start autogenerated hyperlinks -->\n{}\n<!-- !!DO NOT REMOVE!! end autogenerated hyperlinks -->".format("\n".join(listItems))
	# content = "# R&D Stories\n\n{}".format("\n".join(listItems))

	readme = join('./stories/', 'README.md')
	
	if exists(readme):
		text = getText(readme)
		content = re.sub(r'<!-- !!DO NOT REMOVE!! start autogenerated hyperlinks -->(.|\s)*<!-- !!DO NOT REMOVE!! end autogenerated hyperlinks -->', content, text)
	else:
		content = "# R&D Stories\n\n{}".format(content)
	
	with open(readme, 'w') as pipe:
		pipe.write(content)