import { d3_extended as d3 } from '/public/js/d3.extensions.mjs';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

import { playAudio } from '/public/js/audio.mjs';
import { tagLookup, parseMetadata, parseTimestamps, convertStringToSeconds } from '/public/js/parsers.mjs';

function fetchTranscript (path) {
	return fetch(decodeURI(path))
	.then(async res => {
		if (res.ok) return res.text();
		else throw new Error('Could not find file.');
	});
	// WE DO NOT USE CATCH HERE AS WE NEED TO CHECK FOR THE ERROR IN THE getTranscript FUNCTION
}

export const getTranscript = async function (path) {
	let transcript = ''
	let usedSource = path;
	
	try {
		transcript = await fetchTranscript(path);
	} catch (err) {
		if (path.startsWith('./')) {
			const upPath = path.replace(/^(.)?\//, '../');
			transcript = await fetchTranscript(upPath);
			usedSource = upPath;
		}
	}
	return { transcript, usedSource };
}
export const renderTranscript = function (text, source) {
	let html = marked.parse(text);
	// REPLACE TIMESTAMP MARKERS IN TEXT
	// AD SET UP BUTTONS FOR INTERACTION
	const timestamps = parseTimestamps(html);
	if (timestamps?.length) {
		for (let i = 0; i < timestamps.length; i++) {
			const ts = timestamps[i];
			const str = ts[0];
			const sec = convertStringToSeconds(ts[0]);
			html = html.replace(str, `<button class='play'>&#9205;</button><button class='jump-to-ts' id='ts-${sec}' data-ts='${sec}'><label>${str.replace(/[\[\]]*/g, '')}</label></button>&nbsp;`);
		}
	}

	const transcript = d3.select('section.content')
	.html(html);

	const url = new URL(document.location);
	const path = url.pathname.split('/').filter(d => d.length);
	const titleSection = d3.select('section.title');

	console.log(source.replace('../', ''))

	titleSection.addElems('button', 'chip breadcrumb', path)
		.addElem('label')
		.addElem('a')
			.attr('href', (d, i) => `/${path.slice(0, i + 1).join('/')}`)
		.html(d => d)
	transcript.select('h1').moveTo(titleSection.node());
	// ADD LINK TO EDIT FILE
	titleSection.addElem('a', 'edit-link')
		.attr('href', _ => {
			const moveup = source.match(/\.\.\//g)?.length;
			let gitpath = path;
			console.log(gitpath)
			if (moveup) gitpath = path.slice(0, moveup * -1);
			console.log(gitpath.join('/'))
			console.log(source)
			console.log(moveup)
			return `https://github.com/UNDP-Accelerator-Labs/RnD-Archive/edit/main/${gitpath.join('/')}/${source.replace('../', '')}`
		}).attr('target', '_blank')
		.html('Edit this page')

	transcript.selectAll('p')
	.each(function () {
		const sel = d3.select(this);
		const txt = this.textContent.trim();
		const { text, ...metadata } = parseMetadata(txt, ['skills', 'tools', 'tactics', 'principles']);
		
		if (Object.keys(metadata).length) {
			const div = d3.select(this.parentNode).insertElem(_ => this.nextElementSibling, 'div', 'annotated-paragraph');
			
			sel.moveTo(div.node())
			.html(text);

			const chips = div.addElem('div', 'chips')
			for (let key in metadata) {
				chips.addElems('button', `chip ${key.replace('-')}`, metadata[key])
				.addElem('label')
				.addElem('a')
					.attr('href', d => `/elements/${key}/?doc=${d}`)
				.html(d => {
					if (d.length > 30) return `${d.slice(0, 30)}…`;
					else return d;
				});
			}
		}
	});

	d3.selectAll('button.jump-to-ts')
	.on('click', function () {
		let { ts } = this.dataset;
		ts = parseFloat(ts * 100); // NEED TO PASS CENTISECONDS
		playAudio(ts);
	});
}

