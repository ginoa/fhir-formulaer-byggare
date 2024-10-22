/**
 * @license Copyright (c) 2014-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import "../../../node_modules/ckeditor5/dist/ckeditor5.css"
import "../../../node_modules/ckeditor5/dist/ckeditor5-editor.css"
import "../../../node_modules/ckeditor5/dist/ckeditor5-content.css"

import {
    TextTransformation,
    TableToolbar,
    Table,
    PasteFromOffice,
    Paragraph,
    Markdown,
    List,
    Link,
    Italic,
    Heading,
    Essentials,
    ClassicEditor,
    Bold,
    Autoformat,
    BlockQuote,
  } from "ckeditor5";
  
 class MarkdownEditor extends ClassicEditor {}

  // Plugins to include in the build.
  MarkdownEditor.builtinPlugins = [
    Autoformat,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Italic,
    Link,
    List,
    Markdown,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,
  ];
  
  // Editor configuration.
  MarkdownEditor.defaultConfig = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "undo",
        "redo",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
  };
  
  export default MarkdownEditor;
  