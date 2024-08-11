import {EditorView, basicSetup} from "codemirror";
import {StateField} from "@codemirror/state";
import JZZ from "jzz";
import TAB from "jazz-tab";
import SEL from "jzz-gui-select";
import KBD from "jzz-input-kbd";
import TINY from "jzz-synth-tiny";
SEL(JZZ);
KBD(JZZ);
TINY(JZZ);

JZZ.synth.Tiny.register('Web Audio');
var midi_in = JZZ.gui.SelectMidiIn({ at: 'select_midi_in' });
var midi_out = JZZ.gui.SelectMidiOut({ at: 'select_midi_out' });
var piano = JZZ.input.Kbd({ at: "piano" });
var widget = JZZ.Widget();

midi_in.connect(piano);
piano.connect(midi_out);
piano.connect(widget);
widget.connect(piano);
midi_in.select();
midi_out.select();

let parser = StateField.define({
  create() { return []; },
  update(value, tr) { return tr.docChanged ? tokenize(tr.state.doc.join('\n')) : value; }
});

let watcher = EditorView.updateListener.of((update) => {
  if (!update.docChanged) return;
  //console.log(update.state.field(parser));
  if (update.transactions[0].isUserEvent('input.type')) {}
});

let editor = new EditorView({
  extensions: [basicSetup, parser, watcher],
  parent: document.body
})

widget._receive = function(msg) {
  if (!msg.isNoteOn()) return;
  var note = msg.getNote();
  note = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][note % 12] + Math.floor(note / 12);
  var from = editor.state.selection.main.from;
  var to = editor.state.selection.main.to;
  var anchor = from + note.length;
  editor.dispatch(editor.state.update({changes: {from: from, to: to, insert: note}, selection: {anchor: anchor}}));
};

function tokenize(s) {
  var p = new TAB.Parser(s);
  return p.tok;
}
