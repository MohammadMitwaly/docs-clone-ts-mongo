import Editor from "./components/Editor";
import "./styles/quillTheme.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    <div>
      <Editor />
    </div>
  );
}

export default App;
