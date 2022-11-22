import React, { useCallback, useEffect, useState } from "react";
import { BilibiliIcon, DiscordIcon, GearIcon, GithubIcon, SteamIcon, TwitterIcon } from "../../api/Icon";
import "./footer.css";
import useTranslation from "../../hook/useTranslation";
import type { ComponentEntry } from "../../type";

const deployedTime = 1669014734912;
const second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;

export function DeployTime() {
  const { language, t } = useTranslation();
  const [ since, setSince ] = useState<string>();

  const getDeployedSince = useCallback(() => {
    let time = Date.now() - deployedTime;
    const days = Math.floor(time / day), dayMS = days * day;
    const hours = Math.floor((time -= dayMS) / hour), hourMS = hours * hour;
    const minutes = Math.floor((time -= hourMS) / minute), minuteMS = minutes * minute;
    const seconds = Math.floor((time - minuteMS) / second);
    return `${days}${t("date.day")} ${hours}${t("date.hour")} ${minutes}${t("date.minute")} ${seconds}${t("date.second")}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ language ]);

  useEffect(() => {
    const timerId = setInterval(function set() {
      setSince(getDeployedSince());
      return set;
    }(), 1000);
    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ language ]);

  return (
    <div className="mobile:hidden flex font-bold justify-center lg:items-stretch select-none">
      <div className="bg-yellow-600 rounded-md tracking-wide py-2 px-3 flex items-center mr-2 uppercase">
        <GearIcon />
        <span className="ml-2 uppercase">{t("date.deploy")}</span>
      </div>
      <div className="flex items-center px-3 tracking-wide bg-yellow-600 rounded-md">{since}</div>
    </div>
  );
}

const SocialList: ({ url: string } & ComponentEntry)[] = [
  { name: "bilibili", url: "https://space.bilibili.com/361996128", component: <BilibiliIcon /> },
  { name: "twitter", url: "https://twitter.com/barro1t", component: <TwitterIcon /> },
  { name: "discord", url: "https://discord.gg/fw5B6Q8sGj", component: <DiscordIcon /> },
  { name: "github", url: "https://github.com/Ba1oretto", component: <GithubIcon /> },
  { name: "steam", url: "https://steamcommunity.com/id/baioretto", component: <SteamIcon /> },
];

export function SocialMedia() {
  return (
    <div className="flex flex-wrap justify-center mt-4 md:mt-0">
      {SocialList.map(({ name, url, component }) => (
        <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name}
           className="block p-3 transition-opacity hover:opacity-50">
          {component}
        </a>
      ))}
    </div>
  );
}