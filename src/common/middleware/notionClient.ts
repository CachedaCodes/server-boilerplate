import { Client } from "@notionhq/client";
import { env } from "@/common/utils/envConfig";

export const notionClient = new Client({ auth: env.NOTION_AUTH_TOKEN });
