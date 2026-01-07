import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .ql-container {
        font-family: inherit;
        font-size: 1rem;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
      }
      .ql-toolbar {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        background: hsl(var(--muted));
        border-color: hsl(var(--border));
      }
      .ql-container {
        border-color: hsl(var(--border));
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        min-height: 150px;
      }
      .ql-editor {
        min-height: 150px;
      }
      .ql-editor.ql-blank::before {
        color: hsl(var(--muted-foreground));
        font-style: normal;
      }
      .ql-snow .ql-stroke {
        stroke: hsl(var(--foreground));
      }
      .ql-snow .ql-fill {
        fill: hsl(var(--foreground));
      }
      .ql-toolbar button:hover,
      .ql-toolbar button:focus {
        color: hsl(var(--primary));
      }
      .ql-toolbar button:hover .ql-stroke,
      .ql-toolbar button:focus .ql-stroke {
        stroke: hsl(var(--primary));
      }
      .ql-toolbar button:hover .ql-fill,
      .ql-toolbar button:focus .ql-fill {
        fill: hsl(var(--primary));
      }
      .ql-toolbar button.ql-active {
        color: hsl(var(--primary));
      }
      .ql-toolbar button.ql-active .ql-stroke {
        stroke: hsl(var(--primary));
      }
      .ql-toolbar button.ql-active .ql-fill {
        fill: hsl(var(--primary));
      }
      .ql-editor a {
        color: hsl(var(--primary));
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
    />
  );
};

export default RichTextEditor;
