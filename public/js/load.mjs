import { parseMetadata } from "./parsers.mjs";
import {
  setupAudio,
  getAudio,
  filterAudioData,
  normalizeAudioData,
  audioElement,
  playAudio,
  pauseAudio,
} from "./audio.mjs";
import { visualizeAudio } from "./visualization.mjs";
import { getTranscript, renderTranscript } from "./transcript.mjs";
import { renderMenu } from "./menu.mjs";
import { parseIntervals } from "./parsers.mjs";

async function onLoad() {
  // if (!url) url = '/media/audio/horror-background-atmosphere-156462.mp3';
  const params = new URLSearchParams(document.location.search);
  const doc = params.get("doc");
  let source = "README.md";
  if (doc) source = `./pages/${doc}.md`;

  console.log("loading transcript");
  const { transcript, usedSource } = await getTranscript(source);
  let { audio: url, text } = parseMetadata(transcript, "audio");

  url = url?.[0];
  renderTranscript(text, usedSource);

  // Set up audio context
  if (url) {
    setupAudio();
    const audioContext = new AudioContext();
    let currentBuffer = null;

    const audioBuffer = await getAudio(url, audioContext);
    const filteredData = filterAudioData(audioBuffer);
    const normalizedData = normalizeAudioData(filteredData);

    const [audio, duration, playable] = await audioElement(url);

    const intervals = parseIntervals(text, duration);
    if (playable) visualizeAudio(normalizedData, audio, duration, intervals);
  }

  // RENDER THE MENU
  await renderMenu();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    onLoad();
  });
} else {
  (async () => {
    await onLoad();
  })();
}
