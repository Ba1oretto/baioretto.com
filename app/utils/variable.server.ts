const COOKIE_SECRET = getValue("COOKIE_SECRET");
const GITHUB_TOKEN = getValue("GITHUB_TOKEN");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function getValue(key: string) {
  let value;
  if (!(value = process.env[key]))
    throw new Error(`${key} must be set`);
  return value;
}

export {
  COOKIE_SECRET,
  GITHUB_TOKEN,
  IS_PRODUCTION,
};