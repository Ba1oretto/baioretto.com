import AboutMe from "./AboutMe";
import Preview from "./Preview";
import Skills from "./Skills";
import Works from "./Works";
import ContactMe from "./ContactMe";

import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAuthedUser, getTopLanguages } from "~/utils/octokit.server";

export const meta: V2_MetaFunction = () => ([
  {
    title: "Home",
  },
]);

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
  return {
    top_languages: await getTopLanguages(),
    user: await getAuthedUser(),
  };
};

export default function () {
  const { top_languages } = useLoaderData<typeof loader>();

  return (
    <main className="[&>section:not(:first-child)]:container [&>section:not(:first-child)]:mx-auto flex flex-col gap-y-16 mb-32">
      <Preview />
      <AboutMe />
      <Skills top_languages={ top_languages } />
      <Works />
      <ContactMe />
    </main>
  );
}
