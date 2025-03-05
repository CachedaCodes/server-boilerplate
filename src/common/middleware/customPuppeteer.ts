import { resolve } from "node:path";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { type ConnectResult, type Options, connect } from "puppeteer-real-browser";

type EnrichedPuppeteerConnection = ConnectResult & {
  setDownloadPath: (downloadPath: string) => Promise<void>;
};

/**
 * Creates and returns a new puppeteer connection
 *
 * @param connectionOptions Configuration options for the browser connection
 * @param pluginOptions Plugin configuration options
 * @returns The puppeteer connection result with browser and page
 */
export async function PuppeteerConnection(connectionOptions: Partial<Options>): Promise<EnrichedPuppeteerConnection> {
  const defaultOptions = {
    args: [],
    headless: false,
    customConfig: {},
    turnstile: false,
    connectOption: {},
    disableXvfb: false,
    ignoreAllFlags: false,
    plugins: [StealthPlugin()],
  };

  const connection = (await connect({ ...defaultOptions, ...connectionOptions })) as EnrichedPuppeteerConnection;

  const setDownloadPath = async (downloadPath: string) => {
    const client = await connection.page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: resolve(downloadPath),
    });
  };

  connection.setDownloadPath = setDownloadPath;

  return connection;
}
