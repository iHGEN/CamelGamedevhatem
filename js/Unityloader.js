async function getFileSize(url) {
  const response = await fetch(url, { method: 'HEAD' });
  const contentLength = response.headers.get('Content-Length');
  return parseInt(contentLength, 10);
}

async function downloadChunk(url, start, end) {
  const headers = {
      'Range': `bytes=${start}-${end}`
  };
  const response = await fetch(url, { headers });
  if (!response.ok && response.status !== 206) {
      throw new Error(`Failed to download chunk: ${start}-${end}`);
  }
  return await response.arrayBuffer();
}


async function downloadChunksInParallel(url, ranges) {
  const downloadPromises = ranges.map(range => downloadChunk(url, range.start, range.end));
  const chunks = await Promise.all(downloadPromises);
  return chunks;
}

function mergeChunks(chunks) {
  let totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  let mergedArray = new Uint8Array(totalLength);

  let offset = 0;
  for (let chunk of chunks) {
      mergedArray.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
  }

  return mergedArray.buffer;
}

async function loadUnityGame() {
  var container = document.querySelector("#unity-container");
  var canvas = document.querySelector("#unity-canvas");
  var loadingBar = document.querySelector("#unity-loading-bar");
  var progressBarFull = document.querySelector("#unity-progress-bar-full");

  var unityInstance = null;
  function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
      warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
      if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
      setTimeout(function() {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }
    updateBannerVisibility();
  }
  var buildUrl = "Build";
  var dataUrl = buildUrl + "/CamelDevHatem.data.br";

  
  const fileSize = await getFileSize(dataUrl);
  const chunkSize = 5242880; // 5MB in bytes
  const numberOfChunks = Math.ceil(fileSize / chunkSize);


  let ranges = [];
  for (let i = 0; i < numberOfChunks; i++) {
      let start = i * chunkSize;
      let end = (i + 1) * chunkSize - 1;
      if (end >= fileSize) {
          end = fileSize - 1;
      }
      ranges.push({ start, end });
  }

  
  let chunks = await downloadChunksInParallel(dataUrl, ranges);


  let mergedData = mergeChunks(chunks);

  
  let dataBlob = new Blob([mergedData]);
  let dataBlobUrl = URL.createObjectURL(dataBlob);

  var config = {
      dataUrl: dataBlobUrl,
      frameworkUrl: buildUrl + "/CamelDevHatem.framework.js.br",
      codeUrl: buildUrl + "/CamelDevHatem.wasm.br",
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "i20-Project",
      productVersion: "0.1.0",
      showBanner: unityShowBanner,
  };

  var script = document.createElement("script");
  script.src = buildUrl + "/CamelDevHatem.loader.js";
  script.onload = () => {
      createUnityInstance(canvas, config, (progress) => {
          progressBarFull.style.width = 100 * progress + "%";
      }).then((unityInstance) => {
          this.unityInstance = unityInstance;
          loadingBar.style.display = "none";
      }).catch((message) => {
          alert(message);
      });
  };
  document.body.appendChild(script);
}

loadUnityGame();