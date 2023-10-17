// components/UnityLoader.tsx

import { useEffect } from 'react';

const UnityLoader: React.FC = () => {
  useEffect(() => {
    const buildUrl = "/Build";
    const loaderUrl = buildUrl + "/BuildFinalLink.loader.js";

    const config = {
      dataUrl: buildUrl + "/BuildFinalLink.data",
      frameworkUrl: buildUrl + "/BuildFinalLink.framework.js",
      codeUrl: buildUrl + "/BuildFinalLink.wasm",
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "CCCBProject",
      productVersion: "0.1",
    };

    const canvas = document.getElementById('unity-canvas') as HTMLCanvasElement;

    const loadingBar = document.createElement('div');
    const progressBarFull = document.createElement('div');
    loadingBar.appendChild(progressBarFull);

    const script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
      // @ts-ignore
      createUnityInstance(canvas, config, (progress: number) => {
        progressBarFull.style.width = 100 * progress + "%";
      }).then((unityInstance: any) => {
        loadingBar.style.display = "none";
      }).catch((message: string) => {
        alert(message);
      });
    };

    document.body.appendChild(script);

    return () => {
      // Clean up the script element once component is unmounted
      document.body.removeChild(script);
    };

  }, []);

  return null;
};

export default UnityLoader;
