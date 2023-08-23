import type { SvgTemplateArgs } from "~/components/SvgTemplate";
import type { action } from "./route";

import { useMemo } from "react";
import { Form, useActionData } from "@remix-run/react";
import SvgTemplate from "~/components/SvgTemplate";

type ContactContent = {
  name: SvgTemplateArgs["name"],
  href: string,
  content: string,
};

const _ContactList: ContactContent[] = [
  {
    name: "github",
    href: "https://github.com/ba1oretto",
    content: "ba1oretto",
  },
  {
    name: "mail",
    href: "mailto:sunjiamu@outlook.com",
    content: "sunjiamu@outlook.com",
  },
  {
    name: "twitter",
    href: "https://twitter.com/barro1t",
    content: "barro1t",
  },
  {
    name: "bilibili",
    href: "https://space.bilibili.com/361996128",
    content: "Ba1oretto",
  },
];

export default function () {
  const data = useActionData<typeof action>();
  const contact_list = useMemo(() => _ContactList.map(({ name, href, content }) => (
    <div key={name}>
      <dt className="sr-only">{name}</dt>
      <dd className="max-w-min">
        <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-x-2">
          <SvgTemplate name={name} width="16" class_name="inline" />
          <p>{content}</p>
        </a>
      </dd>
    </div>
  )), []);

  return (
    <section id="contact_me">
      <h2>Get in touch</h2>
      <div className="grid md:grid-cols-2">
        <article>
          <p className="mb-6">Have a project for me? Any questions about something I've built? I'd love to hear from you. Give me a shout by email or using the form below if you'd like to contact me.</p>
          <dl className="[&>*]:mb-2 last:[&>*]:mb-10 md:last:[&>*]:mb-0">
            {contact_list}
          </dl>
        </article>
        {/* TODO Implement: submission logic and remove class "readOnly tabIndex={-1} disabled" */}
        <Form method="post" className="grid grid-rows-[1fr_1fr_3fr_1fr] gap-y-4 [&>label>span]:sr-only [&>label>*:nth-child(2)]:rounded-md [&>label>*:nth-child(2)]:placeholder-blue-1100/70 [&>label>*:nth-child(2)]:dark:placeholder-white-500/70 [&>label>*:nth-child(2)]:w-full [&>label>*:nth-child(2)]:h-full [&>label>*:nth-child(2)]:p-2 [&>label>*:nth-child(2)]:shadow-blue [&>label>*:nth-child(2)]:shadow-blue-900 [&>label>*:nth-child(2)]:bg-transparent">
          <label>
            <span>name</span>
            <input name="name" placeholder="Name" required readOnly tabIndex={-1} disabled />
          </label>
          <label>
            <span>mail</span>
            <input name="mail" placeholder="Mail" required readOnly tabIndex={-1} disabled />
          </label>
          <label>
            <span>message</span>
            <textarea name="message" placeholder={"Message\nThis form logic is not implemented yet."} required readOnly tabIndex={-1} disabled />
          </label>
          {data?.error ? (
            <p className="text-amber-400">{data.error}</p>
          ) : (
            <button type="submit" className="w-max px-4 py-2 border-2 border-blue-400 rounded-full" tabIndex={-1} disabled>Send Message</button>
          )}
        </Form>
      </div>
    </section>
  );
}