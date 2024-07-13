import {EditorView, basicSetup} from "codemirror";
import JZZ from "jzz";
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

let watcher = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    //console.log('!');
  }
});

let editor = new EditorView({
  extensions: [basicSetup, watcher],
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
  var p = new Parser();
  return p.tok;
}

function Parser(s) {
  this.txt = s;
  this.prev = 0;
  this.cur = 0;
  this.tok = [];
  while (this.cur < this.txt.length) {
    if (/\s/.test(this.txt[this.cur])) this.cut();
    this.cur++;
  }
  this.cut();
}

Parser.prototype.cut = function() {
  if (this.prev != this.cur) this.tok.push({ from: this.prev, to: this.cur, txt: this.txt.substring(this.prev, this.cur) });
}
