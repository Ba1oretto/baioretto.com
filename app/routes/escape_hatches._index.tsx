import type { V2_MetaFunction, LoaderFunction, LinksFunction } from "@remix-run/node";
import parse from "~/utils/markdown.server";
import { useLoaderData } from "@remix-run/react";
import viewer_stylesheet from "~/css/viewer.css";

const content = "## 文化の違い\n" +
  "\n" +
  "おいっす、barroitです。今回ご紹介する異文化は「敬語の違い」です。\n" +
  "\n" +
  "\n" +
  "\n" +
  "中国と日本は文化的に多くの共通点を持っていますが、敬語の使用に関する違いは非常に顕著です。中国語には「您」のような尊敬を表す言葉が存在しますが、日本語の敬語の体系は中国語よりも非常に複雑と思います。\n" +
  "\n" +
  "\n" +
  "\n" +
  "日本語の敬語には、尊敬語、謙譲語、丁寧語の三つのカテゴリがあります。尊敬語は他人の行動に対する尊敬を表すために使われます。例えば、「いらっしゃいます」、「なさいます」などの言葉があります。謙譲語は自分の行動を謙遜して述べるために使われます。例えば、「いたします」、「申し上げeます」などの言葉があります。丁寧語は一般的に礼儀正しく話すために使われ、最も一般的な形は「ます」形です。\n" +
  "\n" +
  "\n" +
  "\n" +
  "一方、中国語の敬語は日本語ほど複雑ではなく、より簡単で直接的です。例えば、年上の人や地位が高い人に対する敬意を示すために「您」を使用します。しかし、日常会話では「你」を使用することが一般的で、「您」はあまり使われません。\n" +
  "\n" +
  "\n" +
  "\n" +
  "中国文化では、敬語よりも行動や態度が尊重や礼儀を示す重要な要素とされています。例えば、年長者や上司に対する敬意は、言葉よりも行動で示されることが多いです。逆に、日本文化では、敬語の使用が礼儀として重視され、日常の会話においても一般的に使われています。\n" +
  "\n" +
  "\n" +
  "\n" +
  "両国の敬語の使用には違いがありますが、これは文化や価値観の違いを反映しています。どちらのアプローチもそれぞれの文化に合っているため、相互の理解と尊重が重要です。\n" +
  "\n" +
  "\n" +
  "\n" +
  "今回の紹介はこれで終わりますので、ご視聴ありがとうございました。";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: viewer_stylesheet,
    },
  ];
};

export const meta: V2_MetaFunction = () => ([
  {
    title: "Escape Hatches",
  },
]);

export const loader: LoaderFunction = async () => {
  return parse(content);
};

export default function EscapeHatches() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="h-full my-32 container mx-auto flex flex-col gap-y-10">
      <section className="viewer" dangerouslySetInnerHTML={ { __html: data } } />
    </div>
  );
}