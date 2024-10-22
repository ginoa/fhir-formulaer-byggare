import {Autoformat} from "@ckeditor/ckeditor5-autoformat";
import {BlockQuote} from "@ckeditor/ckeditor5-block-quote";
import { Bold } from "@ckeditor/ckeditor5-basic-styles";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import {Essentials} from "@ckeditor/ckeditor5-essentials/";
import {Heading} from "@ckeditor/ckeditor5-heading";
import {Italic} from "@ckeditor/ckeditor5-basic-styles";
import {Link} from "@ckeditor/ckeditor5-link";
import {List} from "@ckeditor/ckeditor5-list";
import {Markdown} from "@ckeditor/ckeditor5-markdown-gfm";
import {Paragraph} from "@ckeditor/ckeditor5-paragraph";
import {PasteFromOffice} from "@ckeditor/ckeditor5-paste-from-office";
import {Table} from "@ckeditor/ckeditor5-table";
import {TableToolbar} from "@ckeditor/ckeditor5-table";
import {TextTransformation} from "@ckeditor/ckeditor5-typing";

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