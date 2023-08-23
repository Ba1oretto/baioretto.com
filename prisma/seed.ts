import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

(async function () {
  const password_hash = await bcrypt.genSalt(10).then(salt => bcrypt.hash("barroit", salt));
  const barroit = await db.user.create({
    data: {
      username: "barroit",
      password: password_hash,
    },
  });

  const tags = await Promise.all([ "Tag Test 1", "Tag Test 2" ].map(tag_name => db.tag.create({
    data: {
      name: tag_name,
    },
  })));

  const category = await db.category.create({
    data: {
      name: "Category Test",
    },
  });

  const post = await db.post.create({
    data: {
      title: "Test Post",
      content: "Some random content",
      raw_content: "Some random content",
      author_id: barroit.id,
      category_id: category.id,
    },
  });

  await Promise.all(tags.map(tag => db.postTag.create({
    data: {
      post_id: post.id,
      tag_id: tag.id,
    },
  })));
})().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await db.$disconnect();
});