import re
from os import listdir, makedirs
from os.path import isfile, join, basename, splitext, exists
from urllib.parse import quote

basepath = './elements/pages/'

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
	types = re.findall(r'\[\[type:[\w\s]*\]\]', text)
	types = [re.sub(r'[\[\]]*', '', t).replace('type:', '') for t in types]
	return ("- [{}](/elements/**PLACEHODER**/?doc={})".format(title, quote(filename, safe='')), types)

def generateFile (readme, content):
	if exists(readme):
		text = getText(readme)
		content = re.sub(r'<!-- !!DO NOT REMOVE!! start autogenerated hyperlinks -->(.|\s)*<!-- !!DO NOT REMOVE!! end autogenerated hyperlinks -->', content, text)
	else:
		content = "# R&D Elements\n\n{}".format(content)
	
	with open(readme, 'w') as pipe:
		pipe.write(content)

if __name__ == '__main__':
	onlyfiles = [file for file in listdir(basepath) if isfile(join(basepath, file)) and file != '.DS_Store']
	listItems = [setListItem(file) for file in onlyfiles]
	types = list(set([t for (l,ts) in listItems for t in ts]))
	types.sort()

	content = '<!-- !!DO NOT REMOVE!! start autogenerated hyperlinks -->'

	for type in types:
		content = content + "\n\n## [{}](./{})".format(type.capitalize(), type)

		items = [l.replace('**PLACEHODER**', type) for (l,t) in listItems if type in t]
		items.sort()
		firstLetters = list(set([l.replace('"', '')[3:4] for l in items]))
		firstLetters.sort()
		
		subcontent = '\n<div class=multicol>'

		for letter in firstLetters:
			subcontent = subcontent + '\n\n<div>\n\n'
			alphaItems = [l for l in items if l[3:4] == letter]
			subcontent = subcontent + "### {}\n\n{}".format(letter.capitalize(), "\n".join(alphaItems))
			subcontent = subcontent + '\n</div>'

		subcontent = subcontent + '\n</div>'
		# GENERATE THE FILE IN THE SUBDIRECTORY
		subpath = join('./elements/', type)
		subreadme = join(subpath, 'README.md')
		generateFile (subreadme, subcontent)
		# ADD TO THE GENERAL CONTENT FOR THE MAIN DIRECTORY
		content = content + subcontent

	content = content + '\n\n<!-- !!DO NOT REMOVE!! end autogenerated hyperlinks -->'
	# print(content)

	readme = join('./elements/', 'README.md')
	generateFile (readme, content)
	