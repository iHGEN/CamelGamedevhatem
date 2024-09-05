function base64ToBlob(base64, type) {
  const binary = atob(base64.replace(/\s/g, ''));
  const len = binary.length;
  const buffer = new ArrayBuffer(len);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return new Blob([buffer], { type: type });
}
function shareScreenshot(file,textdata) {
  if (navigator.canShare({ files: [file] })) {
    navigator.share({
      files: [file],
      title: 'لعبة الابل',
      text: textdata,
    }).then(() => console.log('Screenshot shared successfully!'))
      .catch((error) => console.error('Error sharing screenshot:', error));
  } else {

    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screenshot.png';
    a.textContent = 'Download Screenshot';
    document.body.appendChild(a);
  }
}
