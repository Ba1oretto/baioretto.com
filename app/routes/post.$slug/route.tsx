import type { LinksFunction } from "@remix-run/node";
import viewer_stylesheet from "~/css/viewer.css";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: viewer_stylesheet,
    },
  ];
};

const renderer = {
  heading: (text: string, level: number) => `<h${ level } class="code-line">${ text }</h${ level }>`,
  paragraph: (text: string) => `<p class="has-line-data">${ text }</p>`,
  table: (header: string, body: string) => `<table class="table table-striped table-bordered"><thead>${ header }</thead>${ body }</table>`,
};

marked.use({ mangle: false, headerIds: false }, { renderer });

export const loader = async () => {
  throw new Error("not implemented😅");
  const data = "";
  return marked.parse(data);
};

export default function () {
  const res = useLoaderData();

  return (
    <main className="h-full my-32 container mx-auto flex flex-col gap-y-10">
      <section className="viewer" dangerouslySetInnerHTML={ { __html: res } } />
    </main>
  );
}