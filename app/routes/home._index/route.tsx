import type { ActionArgs, LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { defer, json } from "@remix-run/node";

import { _ContactionList, _InformationList, _ResumeList, _WorkList } from "./ExternalLink";

import { Suspense, useId } from "react";
import { getTopLanguages } from "~/utils/octokit.server";
import { Await, Form, useActionData, useLoaderData } from "@remix-run/react";

import home_styles from "~/css/home.css";
import classNames from "classnames";

export const meta: V2_MetaFunction = () => ([
  { title: "Home" },
]);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: home_styles },
];

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const form_data = {
    name: form.get("name"),
    mail: form.get("mail"),
    message: form.get("message"),
  };
  console.log({ form_data });
  return json({ error: "This submission logic is not implemented yet." });
};

export const loader = async () => {
  return defer({
    top_languages: getTopLanguages(),
  });
};

export default function Home() {
  const { top_languages } = useLoaderData<typeof loader>();

  return (
    <main className="[&>section:not(:first-child)]:container [&>section:not(:first-child)]:mx-auto flex flex-col gap-y-16 mb-32">
      <Resume />
      <Information />
      <Suspense fallback={ <Languages /> }>
        <Await resolve={ top_languages } errorElement={
          <section>
            <p className="text-2xl font-bold text-red-100/90">Error loading top languages... 😅</p>
          </section>
        }>
          { data =>
            <Languages top_languages={ data } />
          }
        </Await>
      </Suspense>
      <Project />
      <Contaction />
    </main>
  );
}

function Resume() {
  function handleClick() {
    document.getElementById("about_me")?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  return (
    <section className="relative h-screen w-screen Center text-white-500">
      <figure>
        <img alt="background" src="/home_bg.jpg" className="absolute inset-0 min-w-full max-w-full min-h-full max-h-full object-cover brightness-75 blur-[1px]" />
      </figure>
      <article className="max-w-screen-lg z-10 Center flex-col text-center gap-y-8 p-6 mx-4 rounded-xl bg-blue-950/40 shadow-lg backdrop-blur-sm [&>p]:md:text-2xl">
        <h1 className="!text-white-100">I'm Barroit.</h1>
        <p>
          A <strong>Developer</strong>, <strong>Student</strong>, <s>Caffeine Addiction</s>, Mikufan. I enjoy programming.
        </p>
        <p>
          You can catch me playing <strong>Dota</strong>, petting my <strong>Cat</strong>, or exploring beautiful <strong>Midnight City</strong> in my free time.
        </p>
        <footer className="hidden md:flex">
          { _ResumeList.map(({ name, href, svg }) => (
            <a aria-label={ name } href={ href } key={ name } target="_blank" rel="noreferrer" className="circle-button hover:bg-transparent hover:text-amber-400 -mx-1">
              { svg }
            </a>
          )) }
        </footer>
      </article>
      <button onClick={ handleClick } className="absolute inset-x-0 mx-auto bottom-6 max-w-min bg-blue-300 rounded-2/4 hover:bg-amber-200 hover:text-amber-800 transition-all duration-200 outline-amber-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="60" width="60" fill="currentColor">
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>
    </section>
  );
}

function Information() {
  return (
    <section id="about_me" className="grid md:grid-cols-[2fr_.8fr] gap-y-6">
      <figure className="justify-self-center md:justify-self-start self-end md:col-start-2">
        {/* TODO replace with data.avatar_url */ }
        <img alt="avatar" src="/avatar.jfif" className="rounded-2/4 max-h-20" />
      </figure>
      <article className="justify-self-end md:row-start-1 md:col-start-1 md:pr-10">
        <h2>About Me</h2>
        <p>OCD, Procrastination. Programming occupies a large part of my life (although it makes me a little lonely). So why don't we play some Dota or ARAM?</p>
      </article>
      <ul className="grid md:grid-cols-[2fr_1fr] gap-4 md:col-span-2">
        { _InformationList.map(({ name, href, svg }) => (
          <li key={ name } className="flex items-center gap-x-2">
            { svg }
            <span className="font-bold dark:text-white-200">{ name }: </span>
            <span className="dark:text-white-500">{ href }</span>
          </li>
        )) }
      </ul>
    </section>
  );
}

function Languages({ top_languages }: { top_languages?: [ string, number ][] }) {
  const is_loading = !top_languages;

  if (is_loading) {
    top_languages = [];
    for (let i = 0; i < 6; i++) {
      top_languages.push([ "", i ]);
    }
  }

  return (
    <section id="skills">
      <h2>My Skills</h2>
      <ul className="relative grid md:grid-cols-2 gap-x-10 p-5 rounded-2xl dark:shadow-blue dark:shadow-blue-900">
        { top_languages!.map(([ language, percentage ]) => (
          <RankBar language={ language } percentage={ percentage } key={ language } />
        )) }
        <div className={ classNames(is_loading && "lds-roller") }>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </ul>
    </section>
  );
}

function Project() {
  return (
    <section id="works">
      <h2>What I'm Doing</h2>
      <ul className="grid md:grid-cols-2 gap-2">
        { _WorkList.map(({ name, description }) => (
          <li key={ name } className="p-5 rounded-2xl dark:shadow-blue dark:shadow-blue-900">
            <article className="flex flex-col">
              <h3 className="flex items-center">{ name }</h3>
              <p>{ description }</p>
            </article>
          </li>
        )) }
      </ul>
    </section>
  );
}

function Contaction() {
  const data = useActionData<typeof action>();

  return (
    <section id="contact_me">
      <h2>Get in touch</h2>
      <div className="grid md:grid-cols-2">
        <article>
          <p className="mb-6">Have a project for me? Any questions about something I've built? I'd love to hear from you. Give me a shout by email or using the form below if you'd like to contact me.</p>
          <dl className="[&>*]:mb-2 last:[&>*]:mb-10 md:last:[&>*]:mb-0">
            { _ContactionList.map(({ name, href, content, icon }) => (
              <div key={ name }>
                <dt className="sr-only">{ name }</dt>
                <dd className="max-w-min">
                  <a href={ href } target="_blank" rel="noreferrer" className="flex items-center gap-x-2">
                    { icon }
                    <p>{ content }</p>
                  </a>
                </dd>
              </div>
            )) }
          </dl>
        </article>
        {/* TODO Implement: submission logic and remove class "readOnly tabIndex={-1} disabled" */ }
        <Form method="post" className="grid grid-rows-[1fr_1fr_3fr_1fr] gap-y-4 [&>label>span]:sr-only [&>label>*:nth-child(2)]:rounded-md [&>label>*:nth-child(2)]:placeholder-blue-1100/70 [&>label>*:nth-child(2)]:dark:placeholder-white-500/70 [&>label>*:nth-child(2)]:w-full [&>label>*:nth-child(2)]:h-full [&>label>*:nth-child(2)]:p-2 [&>label>*:nth-child(2)]:shadow-blue [&>label>*:nth-child(2)]:shadow-blue-900 [&>label>*:nth-child(2)]:bg-transparent">
          <label>
            <span>name</span>
            <input name="name" placeholder="Name" required readOnly tabIndex={ -1 } disabled />
          </label>
          <label>
            <span>mail</span>
            <input name="mail" placeholder="Mail" required readOnly tabIndex={ -1 } disabled />
          </label>
          <label>
            <span>message</span>
            <textarea name="message" placeholder={ "Message\nThis form logic is not implemented yet." } required readOnly tabIndex={ -1 } disabled />
          </label>
          { data?.error ? (
            <p className="text-amber-400">{ data.error }</p>
          ) : (
            <button type="submit" className="w-max px-4 py-2 border-2 border-blue-400 rounded-full" tabIndex={ -1 } disabled>Send Message</button>
          ) }
        </Form>
      </div>
    </section>
  );
}

function RankBar({ language, percentage }: { language?: string, percentage?: number }) {
  const uid = useId();

  if (!language || !percentage) {
    return (
      <li key={ percentage } className="mb-3">
        <h3>&nbsp;</h3>
        <progress className="invisible" />
      </li>
    );
  }

  return (
    <li key={ language } className="mb-3">
      <h3>
        <label htmlFor={ uid }>{ language } </label>
        <span className="font-normal">{ percentage }%</span>
      </h3>
      <progress id={ uid } max="100" value={ percentage } className="w-full rounded-2/4" />
    </li>
  );
}
