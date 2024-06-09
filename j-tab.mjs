import {EditorView, basicSetup} from "codemirror";
import {JZZ} from "jzz";
import {KBD} from "jzz-input-kbd";
import {TINY} from "jzz-synth-tiny";
KBD(JZZ);
TINY(JZZ);

let editor = new EditorView({
  extensions: [basicSetup],
  parent: document.body
})
