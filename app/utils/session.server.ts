const session_secret = (() => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be set");
  }
  return secret;
})();

const is_production = process.env.NODE_ENV === "production";

export { session_secret, is_production };