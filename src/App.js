import React, { useState, Component } from 'react';
import MonacoEditor from 'react-monaco-editor';

var _editor = undefined;
var _monaco = undefined;

export default function App() {
  const [_code, setCode] = useState('// type your code...\n   [error] test \n   [info] info \n   [notice] notice');
  const [_options, setOptions] = useState({ selectOnLineNumbers: true, contextmenu: true });

  function editorWillMount(monaco) {
    applyTheme(monaco)
    applyHover(monaco)
  }

  function editorDidMount(editor, monaco) {
    _editor = editor;
    _monaco = monaco;
    editor.focus();
    addActions(editor, monaco)
    addCommands(editor, monaco)
  }

  function applyHover(monaco) {
    monaco.languages.registerHoverProvider('mySpecialLanguage', {
      provideHover: function (model, position) {
        return {
          range: new monaco.Range(
            1,
            1,
            model.getLineCount(),
            model.getLineMaxColumn(model.getLineCount())
          ),
          contents: [
            { value: '**SOURCE**' },
            { value: '```html\n' + 'asdf' + '\n```' }
          ]
        };
      }
    });
  }

  function applyTheme(monaco) {
    monaco.languages.register({ id: 'mySpecialLanguage' });
    monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
      tokenizer: {
        root: [
          [/\#.*/, 'custom-comment'],
          [/\[error.*/, 'custom-error'],
          [/\[notice.*/, 'custom-notice'],
          [/\[info.*/, 'custom-info'],
          [/\[[a-zA-Z 0-9:]+\]/, 'custom-date']
        ]
      }
    });

    monaco.editor.defineTheme('myCoolTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'custom-comment', foreground: '8080ff' },
        { token: 'custom-info', foreground: '808080' },
        { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
        { token: 'custom-notice', foreground: 'FFA500' },
        { token: 'custom-date', foreground: '008800' }
      ]
    });
    
  }

  function addActions(editor, monaco) {
    editor.addAction({
      id: 'my-unique-id',
      label: 'My Label!!!',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_1,
      ],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: function (ed) {
        ed.trigger('keyboard', 'type', { text: "test" });
      }
    });
  }

  function addCommands(editor, monaco) {
    editor.addCommand(monaco.KeyCode.F9, function () {
      editor.revealPositionInCenter({ lineNumber: 40, column: 1 });
    });
  }

  function onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }

  return (
    <MonacoEditor
      width="100%"
      height="100vh"
      language="mySpecialLanguage"
      theme="myCoolTheme"
      value={_code}
      options={_options}
      onChange={onChange}
      editorDidMount={editorDidMount}
      editorWillMount={editorWillMount}
    />
  );
}
