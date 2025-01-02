import { parseMetadata } from '/js/parsers.mjs';
import { setupAudio, getAudio, filterAudioData, normalizeAudioData, audioElement, playAudio, pauseAudio } from '/js/audio.mjs';
import { visualizeAudio } from '/js/visualization.mjs';
import { getTranscript, renderTranscript } from '/js/transcript.mjs';
import { parseIntervals } from '/js/parsers.mjs';

async function onLoad () {
	// if (!url) url = '/media/audio/horror-background-atmosphere-156462.mp3';
	const params = new URLSearchParams(document.location.search);
	const doc = params.get('doc');
	let source = 'README.md';
	if (doc) source = `./pages/${doc}.md`;
	
	console.log('loading transcript')
	let transcript = await getTranscript(source);
	const { audio: url, text } = parseMetadata(transcript, 'audio');
	renderTranscript(text);

	// Set up audio context
	if (url) {
		setupAudio();
		const audioContext = new AudioContext();
		let currentBuffer = null;

		console.log('loading audio')
		const audioBuffer = await getAudio(url, audioContext);
		const filteredData = filterAudioData(audioBuffer);
		const normalizedData = normalizeAudioData(filteredData);

		const [ audio, duration, playable ] = await audioElement(url);

		const intervals = parseIntervals(text, duration);
		if (playable) visualizeAudio(normalizedData, audio, duration, intervals);
	}
}
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', function () {
		onLoad();
	});
} else {
	(async () => { await onLoad() })();
}