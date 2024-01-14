export function playAudio(audio: any) {
    let audioData = atob(audio)
    // Convert decoded data to Uint8Array
    let uint8Array = new Uint8Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      uint8Array[i] = audioData.charCodeAt(i);
    }

    // Create Blob from Uint8Array
    let blob = new Blob([uint8Array], { type: "audio/mp3" });

    // Create URL from Blob
    let url = URL.createObjectURL(blob);

    // Create new Audio object and play it
    let audioxxx = new Audio(url);
    audioxxx.playbackRate = 1.25;
    audioxxx.play()
}