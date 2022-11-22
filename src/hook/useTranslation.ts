import * as languages from "../lang";
import { useLocalStorage } from "usehooks-ts";
import type { Lang } from "../type";

// TODO bad code I've ever seen, please use types :(
function getNestedTranslation(lang: Lang, keys: string[]): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return keys.reduce((obj, key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return obj?.[key];
  }, languages[lang]);
}

export default function useTranslation(): { t: <S extends string>(p: DeepKeys<typeof languages["en"], S>) => GetDictValue<S, typeof languages["en"]>; setFallbackLanguage: (value: (((prevState: ("en" | "zhCN" | "zhTW" | "ja")) => ("en" | "zhCN" | "zhTW" | "ja")) | "en" | "zhCN" | "zhTW" | "ja")) => void; language: "en" | "zhCN" | "zhTW" | "ja"; fallbackLanguage: "en" | "zhCN" | "zhTW" | "ja"; setLanguage: (value: (((prevState: ("en" | "zhCN" | "zhTW" | "ja")) => ("en" | "zhCN" | "zhTW" | "ja")) | "en" | "zhCN" | "zhTW" | "ja")) => void } {
  const [language, setLanguage] = useLocalStorage<Lang>("language", "en");
  const [fallbackLanguage, setFallbackLanguage] = useLocalStorage<Lang>("fallbackLanguage", "en");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const translation: t = key => {
    const keys = key.split(".");
    return (
      getNestedTranslation(language, keys) ??
      getNestedTranslation(fallbackLanguage, keys) ??
      key
    );
  };

  return {
    language,
    setLanguage,
    fallbackLanguage,
    setFallbackLanguage,
    t: translation,
  };
}

type DeepKeys<T, S extends string> =
  T extends object
    ? S extends `${infer I1}.${infer I2}`
      ? I1 extends keyof T
        // fix issue allowed last dot
        ? T[I1] extends object
          ? `${I1}.${DeepKeys<T[I1], I2>}`
          : keyof T & string
        : keyof T & string
      : S extends keyof T
        ? `${S}`
        : keyof T & string
    : ""

type GetDictValue<T extends string, O> =
  T extends `${infer A}.${infer B}` ?
    A extends keyof O ? GetDictValue<B, O[A]> : never
    : T extends keyof O ? O[T] : never

type t = <S extends string>(p: DeepKeys<typeof languages["en"], S>) => GetDictValue<S, typeof languages["en"]>
