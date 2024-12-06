async function loadUnityGame() {
  var container = document.querySelector("#unity-container");
  var canvas = document.querySelector("#unity-canvas");
  var loadingBar = document.querySelector("#unity-loading-bar");
  var progressBarFull = document.querySelector("#unity-progress-bar-full");
   var warningBanner = document.querySelector("#unity-warning");
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

  // Configuration for Unity instance
  var config = {
    dataUrl: buildUrl + "/CamelGameDevHatem.data.br", 
    frameworkUrl: buildUrl + "/CamelGameDevHatem.framework.js.br",
    codeUrl: buildUrl + "/CamelGameDevHatem.wasm.br",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "i20-Project",
    productVersion: "0.1.0",
    showBanner: unityShowBanner,
  };
  
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Mobile device style: fill the whole browser client area with the game canvas:
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }

      loadingBar.style.display = "block";

  // Load the Unity loader script
  var script = document.createElement("script");
  script.src = buildUrl + "/CamelGameDevHatem.loader.js";
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
