const _InfoList = [
  {
    name: "Location",
    href: "Japan",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="inline">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    name: "Nationality",
    href: "Chinese",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="inline">
        <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
  {
    name: "Age",
    href: "18",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="inline">
        <path d="M7 11h2v2H7v-2zm14-5v14c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z" />
      </svg>
    ),
  },
  {
    name: "Employment",
    href: "GonerAge",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="inline">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
      </svg>
    ),
  },
];

export default function () {
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
        { _InfoList.map(({ name, href, svg }) => (
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