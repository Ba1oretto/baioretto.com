import { useId } from "react";

function RankBar({ language, percentage }: { language: string, percentage: number }) {
  const bar_id = useId();
  return (
    <li key={ language } className="mb-3 last:mb-0">
      <h3>
        <label htmlFor={ bar_id }>{ language } </label>
        <span className="font-normal">{ percentage }%</span>
      </h3>
      <progress id={ bar_id } max="100" value={ percentage } className="LanguageRank w-full rounded-2/4" />
    </li>
  );
}

export default function ({ top_languages }: { top_languages: [ string, number ][] }) {
  return (
    <section id="skills">
      <h2>My Skills</h2>
      <ul className="grid md:grid-cols-2 gap-x-10 CardBg">
        { top_languages.map(([ language, percentage ]) => (
          <RankBar language={ language } percentage={ percentage } key={ language } />
        )) }
      </ul>
    </section>
  );
}