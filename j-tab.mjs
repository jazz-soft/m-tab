import {EditorView, basicSetup} from "codemirror";
import JZZ from "jzz";
import KBD from "jzz-input-kbd";
import TINY from "jzz-synth-tiny";
KBD(JZZ);
TINY(JZZ);

JZZ.synth.Tiny.register('Web Audio');
var piano = JZZ.input.Kbd({ at: "piano" });
var midiout = JZZ().openMidiOut();
var widget = JZZ.Widget();
piano.connect(midiout);
piano.connect(widget);
widget.connect(piano);

let editor = new EditorView({
  extensions: [basicSetup],
  parent: document.body
})

widget._receive = function(msg) {
  console.log(msg.toString());
};