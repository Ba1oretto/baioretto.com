import { marked } from "marked";


const renderer = {
  heading: (text: string, level: number) => `<h${ level } class="code-line">${ text }</h${ level }>`,
  paragraph: (text: string) => `<p class="has-line-data">${ text }</p>`,
  table: (header: string, body: string) => `<table class="table table-striped table-bordered"><thead>${ header }</thead>${ body }</table>`,
};

marked.use({ mangle: false, headerIds: false }, { renderer });

export default marked.parse;