import useTranslation from "./useTranslation";
import { useCallback, useEffect, useState } from "react";


const deployedTime = 1669014734912;
const second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;

export default function () {
  const { language, t } = useTranslation();
  const [ since, setSince ] = useState("");

  const getDeployedSince = useCallback(() => {
    let time = Date.now() - deployedTime;
    const days = Math.floor(time / day), dayMS = days * day;
    const hours = Math.floor((time -= dayMS) / hour), hourMS = hours * hour;
    const minutes = Math.floor((time -= hourMS) / minute), minuteMS = minutes * minute;
    const seconds = Math.floor((time - minuteMS) / second);
    return `${days}${t("date.day")} ${hours}${t("date.hour")} ${minutes}${t("date.minute")} ${seconds}${t("date.second")}`;
  }, [ language ]);

  useEffect(() => {
    const timerId = setInterval(function set() {
      setSince(getDeployedSince());
      return set;
    }(), 1000);
    return () => clearInterval(timerId);
  }, [ language ]);

  return since;
}