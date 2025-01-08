// REGEX LOOKUP [[]]
export const tagLookup = /\[\[[\w:.\-\/\d\s…&\(\)\",]*\]\]/g;
const typeLookup = /\[\[type:[\w:.\-\/\d\s…&\(\)\",]*\]\]/g;

export const parseMetadata = function (text, metafields) {
	if (!Array.isArray(metafields)) metafields = [metafields];
	// RETURN ids WITH HYPERLINKS

	let matches = [...text.matchAll(tagLookup)]
	.filter(d => {
		return metafields.some(c => d[0].replace(/[\[\]]/g, '').startsWith(c));
	});

	// SPLICE THE text TO REMOVE THE metadata
	matches.forEach(d => {
		text = text.replace(d[0], '');
	});
	const typeMatches = [...text.matchAll(typeLookup)];
	typeMatches.forEach(d => {
		text = text.replace(d[0], '');
	})

	const metadata = {};
	matches.forEach(d => {
		const [ key, value ] = d[0].replace(/[\[\]]/g, '').split(':');
		// const obj = {};
		// obj[key] = value;
		// return obj;
		if (metadata[key]) metadata[key].push(value);
		else metadata[key] = [value];
	});
	
	// if (metadata.length) return { ...Object.assign.apply(Object, metadata), text }; // RETURN A FLAT OBJECT
	if (Object.keys(metadata).length) return { ...metadata, text }; // RETURN A FLAT OBJECT
	else return { text };
}
export const parseTimestamps = function (text) {
	// REGEX LOOKUP [[]]
	// AND RETURN ids WITH HYPERLINKS
	const lookup = /\[\[\d+[:.]?(\d+)?(:\d+)?\]\]/g;
	return [...text.matchAll(lookup)];
}
export const convertStringToSeconds = function (str) {
	return str.replace(/[\[\]]+/g, '')
		.split(/[:.]/g)
		.reverse()
		.map((d, i) => +d * Math.pow(60, i))
		.reduce((accumulator, value) => accumulator + value); // CONVERT EVERYTHING TO SECONDS
}
export const parseIntervals = function (text, audioDuration) {
	let timestamps = parseTimestamps(text);
	timestamps = timestamps.map(d => {
		return convertStringToSeconds(d[0]);
	})
	timestamps = zip(timestamps, timestamps.slice(1)).flat().filter(d => d !== undefined && d < audioDuration);
	timestamps.push(audioDuration);
	return chunk(timestamps, 2);
}
function chunk (arr, size) {
	const groups = [];
	for (let i = 0; i < arr.length; i += size) {
		groups.push(arr.slice(i, i + size));
	}
	return groups;
};
function zip (arr1, arr2) {
  return arr1.map((d, i) => [d, arr2[i]]);
};