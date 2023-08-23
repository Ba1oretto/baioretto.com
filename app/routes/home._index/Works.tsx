type WorkList = {
  name: string,
  description: string,
};

const _WorkList: WorkList[] = [
  {
    name: "Web Development",
    description: "Proficient in using Remix, Vue, and React. Use javascript and typescript (preferred). Make a separate Frontend and Backend, or Backend for your Frontend.",
  },
  {
    name: "Minecraft Plugin Dev",
    description: "2 years of development experience, familiar with NMS, bukkit API. Have a bunch of solutions, like VersionCompatible, BaseLib, GUI, or DataPersistent",
  },
];

export default function () {
  return (
    <section id="works">
      <h2>What I'm Doing</h2>
      <ul className="grid md:grid-cols-2 gap-2">
        { _WorkList.map(({ name, description }) => (
          <li key={ name } className="CardBg">
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