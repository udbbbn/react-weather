import * as React from "react";
import * as ReactDOM from "react-dom";
import { Hello } from "./components/HelloWorld";
import { default as Index } from "./components/index";


ReactDOM.render(
    <Index></Index>
    , document.getElementById("app")
)

// ReactDOM.render(<Hello name="i" age={18} />, document.getElementById("app"));
