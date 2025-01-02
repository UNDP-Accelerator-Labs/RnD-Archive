import { playAudio } from '/js/audio.mjs';

function setupSVG (svg) {
	const { clientWidth: cw, clientHeight: ch, offsetWidth: ow, offsetHeight: oh } = svg.node().parentNode;
	const width = cw ?? ow;
	const height = ch ?? oh;
	
	svg.attrs({ 
		'x': 0,
		'y':0,
		'viewBox': `0 0 ${width} ${height}`,
		'preserveAspectRatio': 'xMidYMid meet'
	});

	return { width, height, svg };
}

export const visualizeAudio = function (audioData, audio, audioDuration, intervals) {
	const { width, height, svg } = setupSVG(d3.select('svg#audio'));

	const bands = new Array(audioData.length).fill(0).map((d, i) => i);
	const padding = 10
	const x = d3.scaleBand(bands, [ 0, width ]);
	const y = d3.scaleLinear(d3.extent(audioData), [ height - padding, padding ]); // HERE THE DOMAIN IS [0, 1] SINCE THE AUDIO DATA IS NORMALIZED
	const path = d3.line()
		.x((d, i) => x(i))
		.y(d => y(d))
		.curve(d3.curveBasis);

	audioDuration = audioDuration * 100;
	const playbackSteps = d3.scaleLinear([ 0, audioDuration ], [ 0, width ]);

	const sections = svg.addElems('g', 'sections', intervals)
		.attr('transform', d => `translate(${playbackSteps(d[0] * 100)}, 0)`)
	sections.addElems('line', 'section-separator')
		.attrs({
			'x1': d => playbackSteps((d[1] - d[0]) * 100),
			'y1': 0,
			'x2': d => playbackSteps((d[1] - d[0]) * 100),
			'y2': height,
		})
	sections.addElems('rect', 'section')
		.attrs({
			'width': d => playbackSteps((d[1] - d[0]) * 100),
			'height': d => height,
			'x': 0,
			'y': 0,
		})
	.on('click', (e, d) => {
		playAudio(d[0] * 100);
	});

	svg.addElem('path', 'audio')
		.datum(audioData)
		.attr('d', path);

	const playhead = svg.addElem('line', 'playhead main')
		.attrs({
			'x1': 1,
			'x2': 1,
			'y1': 0,
			'y2': height,
			'transform': `translate(${[ 0, 0 ]})`,
			'data-max_x': width,
		});
	// const jumpToPlayhead = svg.addElem('line', 'playhead ghost')
	// 	.attrs({
	// 		'x1': 0,
	// 		'x2': 0,
	// 		'y1': 0,
	// 		'y2': height,
	// 		'transform': `translate(${[ 0, 0 ]})`,
	// 	});

	// svg
	// .on('mousemove', function (e, d) {
	// 	const { x } = e;
	// 	const { x: mx, width: mw } = this.getBoundingClientRect();
	// 	const offset = mx + (mw - width) / 2;
	// 	let ts = x - offset;
	// 	if (ts < 0) ts = 0;
	// 	else if (ts >= width) ts = width;
	// 	jumpToPlayhead.attr('transform', `translate(${[ ts, 0 ]})`);
	// 	d.jumpTo = ts;
	// })
	// svg.on('click', (e, d) => {
	// 	let ts = 0;
	// 	if (d.jumpTo) ts = playbackSteps.invert(d.jumpTo);
	// 	console.log(ts)
	// 	playback(ts);
	// });

	return svg;
}