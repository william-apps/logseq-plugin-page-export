import React, { useCallback, useEffect, useState } from "react";
import {
  useAppVisible,
  exportToPngImgUrl,
  savePngImgUrl,
  useEventListener,
  usePageName,
} from "./utils";

const HIDE_UI_KEY_LIST = ["Escape"];
function App() {
  const [querySelector, setQuerySelector] = useState("#main-content-container");
  const [ignoreClassName, setIgnoreClassName] = useState("references");
  const [imageUrl, setImageUrl] = useState("");
  const pageName = usePageName();
  const visible = useAppVisible();
  useEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      if (HIDE_UI_KEY_LIST.indexOf(e.key) !== -1) {
        window.logseq.hideMainUI();
      }
    },
    document
  );

  const exportOnce = useCallback(() => {
    setImageUrl("");
    exportToPngImgUrl(querySelector, ignoreClassName.split(" ")).then(
      (url: string) => {
        setImageUrl(url);
      }
    );
  }, []);

  useEffect(() => {
    exportOnce();
  }, []);

  if (visible) {
    return (
      <main className="backdrop-filter backdrop-blur-md fixed inset-0 flex flex-col items-center justify-center">
        <div className="text-black bg-white p-30 rounded">
          <h1 className="text-2xl text-center">
            Welcome to use [[Logseq Page Export]]
          </h1>
          <br />
          <br />
          <div className="flex item-center justify-between">
            <span>ignoreClassName</span>
            <input
              type="text"
              value={ignoreClassName}
              onChange={(e) => {
                setIgnoreClassName(e.target.value);
              }}
              className="ml-10 border-2 border-slate-100 grow"
            ></input>
          </div>
          <div className="mt-6 flex item-center justify-between">
            <span>querySelector</span>
            <input
              type="text"
              value={querySelector}
              onChange={(e) => {
                setQuerySelector(e.target.value);
              }}
              className="ml-10 border-2 border-slate-100 grow"
            ></input>
          </div>
          <div className="min-h-[300px] border-2 border-slate-100 mt-2 flex justify-center content-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                className="my-0 mx-auto max-h-[300px] overflow-hidden"
              />
            ) : (
              <span className="text-center">Loading...</span>
            )}
          </div>
          <button
            className="mt-2 px-6 py-2 bg-yellow-500 font-medium text-sm hover:bg-yellow-600 text-yellow-100 rounded"
            onClick={() => {
              exportOnce();
            }}
          >
            Preview Page
          </button>
          <button
            className="ml-2 px-6 py-2 bg-blue-500 font-medium text-sm hover:bg-blue-600 text-blue-100 rounded"
            onClick={() => {
              savePngImgUrl(imageUrl, pageName);
            }}
          >
            Save To Disk
          </button>
        </div>
      </main>
    );
  }

  return null;
}

export default App;