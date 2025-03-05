import { env } from "@/common/utils/envConfig";
import { Client } from "@notionhq/client";

export const notionClient = new Client({ auth: env.NOTION_AUTH_TOKEN });
