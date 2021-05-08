import { useCallback, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

const ToolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [
    { header: 1 },
    { header: 2 },
    { header: 3 },
    { header: 4 },
    { header: 5 },
    { header: 6 },
    { header: false },
  ], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }, { direction: "ltr" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const Editor = () => {
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) {
      return;
    }
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, { theme: "snow", modules: { toolbar: ToolbarOptions } });
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    return () => {
      socket.disconnect();
    };
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default Editor;
