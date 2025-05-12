import { useEffect, useRef } from "react";
import CreativeEditorSDK, { Configuration } from "@cesdk/cesdk-js";

function CreativeEditorSDKComponent() {
  const cesdkContainerRef = useRef(null);

  useEffect(() => {
    let cesdkInstance: CreativeEditorSDK;

    const config: Configuration = {
      license:
        "PURFmnMJ1TPecWqcqsQu4h1JI6dvaTXMWC5PFAoD2OO0E5koZFZ8HQFBCj2STHxA",
      // Additional configuration options
      callbacks: {
        onUpload: "local",
      },
    };

    if (cesdkContainerRef.current) {
      CreativeEditorSDK.create(cesdkContainerRef.current, config).then(
        (instance) => {
          cesdkInstance = instance;
          // Load a blank scene or a template
          instance.addDemoAssetSources({ sceneMode: "Design" });
          // instance.createDesignScene();

          // Create a new scene
          const scene = cesdkInstance.engine.scene.create();
          const page = cesdkInstance.engine.block.create("page");
          cesdkInstance.engine.block.appendChild(scene, page);

          // Define positions for four image slots
          const positions = [
            { x: 5, y: 5 },
            { x: 30, y: 5 },
            { x: 5, y: 30 },
            { x: 30, y: 30 },
          ];

          positions.forEach((pos) => {
            // Create a placeholder image block at each position
            const imageBlock = cesdkInstance.engine.block.create("graphic");

            cesdkInstance.engine.block.setBlurEnabled(imageBlock, true);

            cesdkInstance.engine.block.setPositionX(imageBlock, pos.x);
            cesdkInstance.engine.block.setPositionY(imageBlock, pos.y);

            cesdkInstance.engine.block.setWidth(imageBlock, 50);
            cesdkInstance.engine.block.setHeight(imageBlock, 50);

            cesdkInstance.engine.block.appendChild(page, imageBlock);
          });
        }
      );
    }
    return () => {
      if (cesdkInstance) {
        cesdkInstance.dispose();
      }
    };
  }, []);

  return (
    <div ref={cesdkContainerRef} style={{ width: "100vw", height: "100vh" }} />
  );
}

export default CreativeEditorSDKComponent;
