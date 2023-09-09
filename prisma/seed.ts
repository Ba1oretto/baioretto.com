import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

enum Permission {
  READ_POST = 1,
  WRITE_POST = 2,
  DELETE_POST = 4,
  VIEW_USERS = 8,
  EDIT_USER = 16,
}

enum PermissionGroup {
  GUEST = Permission.READ_POST,
  CONTRIBUTOR = Permission.READ_POST | Permission.WRITE_POST,
  ADMINISTRATOR = Permission.READ_POST | Permission.WRITE_POST | Permission.DELETE_POST | Permission.VIEW_USERS | Permission.EDIT_USER,
}

const db = new PrismaClient();

(async function () {
  const group_administrator = await db.group.create({
    data: {
      slug: "administrator",
      name: "Administrator",
      permissions: PermissionGroup.ADMINISTRATOR,
    },
  });

  const group_contributor = await db.group.create({
    data: {
      slug: "contributor",
      name: "Contributor",
      permissions: PermissionGroup.CONTRIBUTOR,
    },
  });

  const group_guest = await db.group.create({
    data: {
      slug: "guest",
      name: "Guest",
      permissions: PermissionGroup.GUEST,
    },
  });

  const user_barroit = await db.user.create({
    data: {
      username: "barroit",
      password: await bcrypt.genSalt(10).then(salt => bcrypt.hash("barroit", salt)),
      group_id: group_administrator.id,
    },
  });

  const user_caizii = await db.user.create({
    data: {
      username: "caizii",
      password: await bcrypt.genSalt(10).then(salt => bcrypt.hash("caizii", salt)),
      group_id: group_contributor.id,
    },
  });

  const tag_assignment = await db.tag.create({
    data: {
      slug: "assignment",
      name: "Assignment",
    },
  });

  const tag_japanese = await db.tag.create({
    data: {
      slug: "japanese",
      name: "日本語",
    },
  });

  const tag_daily = await db.tag.create({
    data: {
      slug: "daily",
      name: "Daily",
    },
  });

  const category = await db.category.create({
    data: {
      slug: "presentation",
      name: "Presentation",
    },
  });

  const post = await db.post.create({
    data: {
      title: "深夜の景色",
      slug: "presentation-2023-09-01",
      excerpt: "深夜、世界は静寂に包まれる。",
      content: "<h1 class=\"code-line\">深夜の景色</h1><p class=\"has-line-data\">深夜、街は日中の<ruby> 喧騒 <rt> けんそう </rt> </ruby>から解放され、静寂と神秘に包まれる。街灯の下、<ruby> 霧 <rt> きり </rt> </ruby>に覆われた<ruby> 小路 <rt> こうじ </rt> </ruby>を歩くと、まるで異世界への<ruby> 入口 <rt> いりぐち </rt> </ruby>を潜入するかのような感覚に陥る。その瞬間、現実と夢の境界が曖昧になり、時間の<ruby> 流 <rt> なが </rt> </ruby>れがゆっくりと感じられる。</p><p class=\"has-line-data\"><img src=\"/resource/images/tmp_IMG_3104.jpg\" alt=\"dreamcore\"></p><p class=\"has-line-data\">家の中でも、深夜は特別な時間だ。部屋の灯りを消し、パソコンの明るさだけを頼りにプログラミングをする。この環境は、まるで自分だけの秘密の空間にいるかのごとく感じられる。キーボードの静かな<ruby> 音 <rt> おと </rt> </ruby>、画面に映し出されるコードの論理における美しさ。全てが<ruby> 集中 <rt> しゅうちゅう </rt> </ruby>し、創造力を最大限に引き出す。</p><p class=\"has-line-data\"><img src=\"/resource/images/tmp_IMG_0904.jpg\" alt=\"workspace\"></p><p class=\"has-line-data\">深夜の景色、それは日常の中の小さな<ruby> 逃避 <rt> とうひ </rt> </ruby>。都市の夜景、家の中の静寂、どちらも心を魅了する魅力がある。一度、深夜の世界を体験して、その魅力を感じてみてはいかがだろうか。</p>",
      raw_content: "# 深夜の景色\n" +
        "\n" +
        "深夜、街は日中の<ruby> 喧騒 <rt> けんそう </rt> </ruby>から解放され、静寂と神秘に包まれる。街灯の下、<ruby> 霧 <rt> きり </rt> </ruby>に覆われた<ruby> 小路 <rt> こうじ </rt> </ruby>を歩くと、まるで異世界への<ruby> 入口 <rt> いりぐち </rt> </ruby>を潜入するかのような感覚に陥る。その瞬間、現実と夢の境界が曖昧になり、時間の<ruby> 流 <rt> なが </rt> </ruby>れがゆっくりと感じられる。\n" +
        "\n" +
        "![dreamcore](/resource/images/tmp_IMG_3104.jpg)\n" +
        "\n" +
        "家の中でも、深夜は特別な時間だ。部屋の灯りを消し、パソコンの明るさだけを頼りにプログラミングをする。この環境は、まるで自分だけの秘密の空間にいるかのごとく感じられる。キーボードの静かな<ruby> 音 <rt> おと </rt> </ruby>、画面に映し出されるコードの論理における美しさ。全てが<ruby> 集中 <rt> しゅうちゅう </rt> </ruby>し、創造力を最大限に引き出す。\n" +
        "\n" +
        "![workspace](/resource/images/tmp_IMG_0904.jpg)\n" +
        "\n" +
        "深夜の景色、それは日常の中の小さな<ruby> 逃避 <rt> とうひ </rt> </ruby>。都市の夜景、家の中の静寂、どちらも心を魅了する魅力がある。一度、深夜の世界を体験して、その魅力を感じてみてはいかがだろうか。\n",
      author_id: user_barroit.id,
      category_id: category.id,
      permission: PermissionGroup.GUEST,
    },
  });

  await db.tagOnPost.create({
    data: {
      post_id: post.id,
      tag_id: tag_assignment.id,
    },
  });

  await db.tagOnPost.create({
    data: {
      post_id: post.id,
      tag_id: tag_japanese.id,
    },
  });

  await db.tagOnPost.create({
    data: {
      post_id: post.id,
      tag_id: tag_daily.id,
    },
  });
})().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await db.$disconnect();
});