import { useCallback, useEffect, useState } from "react";
import Quill, { TextChangeHandler } from "quill";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { useParams } from "react-router-dom";

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
  // Get the document ID from the URL
  const { id: documentID } = useParams<{ id: string }>();

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
    tempQuilEditor.enable(false);
    tempQuilEditor.setText("Loading document data, please wait...");
    setQuillEditor(tempQuilEditor);
  }, []);

  useEffect(() => {
    const tempConnection = io("http://localhost:5000");
    setConnection(tempConnection);
    // Clean up after we no longer need this connection
    return () => {
      tempConnection.disconnect();
    };
  }, []);

  // This updates the backend every time text in the editor changes
  useEffect(() => {
    // Check if this is the first render
    if (!connection || !quillEditor) {
      return;
    }
    const textChangeHandler: TextChangeHandler = (delta, oldDelta, source) => {
      if (source === "user") {
        connection.emit("send-changes", delta);
      } else {
        return;
      }
    };
    // Set the text change listener
    quillEditor.on("text-change", textChangeHandler);
    // Clean up the text change listener once we no longer need it
    return () => {
      quillEditor.off("text-change", textChangeHandler);
    };
  }, [connection, quillEditor]);

  useEffect(() => {
    // Check if this is the first render
    if (!connection || !quillEditor) {
      return;
    }
    const textChangeHandler = (changes: any) => {
      quillEditor.updateContents(changes);
    };
    // Set the text change listener
    connection.on("receive-changes", textChangeHandler);
    // Clean up the text change listener once we no longer need it
    return () => {
      connection.off("receive-changes", textChangeHandler);
    };
  }, [connection, quillEditor]);

  useEffect(() => {
    if (!connection || !quillEditor) {
      return;
    }
    connection.once("load-document", (document) => {
      quillEditor.setContents(document);
      quillEditor.enable(true);
    });
    connection.emit("get-document", documentID);
  }, [connection, quillEditor, documentID]);

  return <div className="container" ref={wrapperRef}></div>;
};

export default Editor;
