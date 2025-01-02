import { playAudio } from '/js/audio.mjs';
import { parseMetadata, parseTimestamps, convertStringToSeconds } from '/js/parsers.mjs';

export const getTranscript = function (path) {
	return fetch(path)
	.then(res => res.text())
	// .then(md => marked.parse(md)) // DEPENDENCY ON marked
	.catch(err => console.log(err))
}
export const renderTranscript = function (text) {
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

	titleSection.addElems('button', 'chip breadcrumb', path)
		.addElem('label')
		.addElem('a')
			.attr('href', (d, i) => `/${path.slice(0, i + 1).join('/')}`)
		.html(d => d)
	transcript.select('h1').moveTo(titleSection.node());

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
				chips.addElem('button', `chip ${key.replace('-')}`)
				.addElem('label')
				.addElem('a')
					.attr('href', `/elements/${key}/?doc=${metadata[key]}`)
				.html(_ => {
					const str = metadata[key];
					if (str.length > 30) return `${str.slice(0, 30)}…`;
					else return str;
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

