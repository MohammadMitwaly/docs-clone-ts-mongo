import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

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
  const [connection, setConnection] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >();
  const [quillEditor, setQuillEditor] = useState<Quill | undefined>();

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) {
      return;
    }
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const tempQuilEditor = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: ToolbarOptions },
    });
    setQuillEditor(tempQuilEditor);
  }, []);

  useEffect(() => {
    const tempConnection = io("http://localhost:5000");
    setConnection(tempConnection);
    return () => {
      tempConnection.disconnect();
    };
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default Editor;
