import re
import json
from os import listdir
from os.path import join, isdir

basepath = './'

if __name__ == '__main__':
	subdirs = [name for name in listdir(basepath) if isdir(join(basepath, name)) and name not in ['node_modules', 'public', 'scripts', '.git'] and name[0] != '.']
	jsonFile = join('./', 'routing.json')
		
	with open(jsonFile, 'w') as pipe:
		json.dump(subdirs, pipe)