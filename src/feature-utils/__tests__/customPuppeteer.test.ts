import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PuppeteerConnection } from "../customPuppeteer";

// Mock puppeteer-real-browser
vi.mock("puppeteer-real-browser", () => {
  const mockCDPSession = {
    send: vi.fn().mockResolvedValue(undefined),
  };

  const mockPage = {
    createCDPSession: vi.fn().mockResolvedValue(mockCDPSession),
    goto: vi.fn().mockResolvedValue(undefined),
    waitForSelector: vi.fn().mockResolvedValue(undefined),
    evaluate: vi.fn().mockResolvedValue(undefined),
  };

  const mockBrowser = {
    newPage: vi.fn().mockResolvedValue(mockPage),
    close: vi.fn().mockResolvedValue(undefined),
  };

  return {
    connect: vi.fn().mockImplementation((options) => {
      return Promise.resolve({
        browser: mockBrowser,
        page: mockPage,
        options,
      });
    }),
  };
});

// Mock stealth plugin
vi.mock("puppeteer-extra-plugin-stealth", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      name: "stealth",
    })),
  };
});

describe("PuppeteerConnection", async () => {
  const puppeteerRealBrowser = await import("puppeteer-real-browser");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a connection with default options when no options provided", async () => {
    const connection = await PuppeteerConnection({});

    expect(puppeteerRealBrowser.connect).toHaveBeenCalledTimes(1);
    expect(puppeteerRealBrowser.connect).toHaveBeenCalledWith(
      expect.objectContaining({
        args: [],
        headless: false,
        customConfig: {},
        turnstile: false,
        connectOption: {},
        disableXvfb: false,
        ignoreAllFlags: false,
        plugins: [expect.anything()],
      }),
    );

    expect(connection).toHaveProperty("browser");
    expect(connection).toHaveProperty("page");
    expect(connection).toHaveProperty("setDownloadPath");
  });

  it("should merge custom options with default options", async () => {
    const customOptions = {
      headless: true,
      args: ["--no-sandbox"],
    };

    await PuppeteerConnection(customOptions);

    expect(puppeteerRealBrowser.connect).toHaveBeenCalledWith(
      expect.objectContaining({
        args: ["--no-sandbox"],
        headless: true,
        customConfig: {},
        turnstile: false,
        connectOption: {},
        disableXvfb: false,
        ignoreAllFlags: false,
      }),
    );
  });

  it("should set download path correctly", async () => {
    const connection = await PuppeteerConnection({});
    const testDownloadPath = "/test/downloads";

    await connection.setDownloadPath(testDownloadPath);

    // Get the mock CDP session
    const cdpSession = await connection.page.createCDPSession();

    // Verify the CDP session send method was called with the right parameters
    expect(cdpSession.send).toHaveBeenCalledWith("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: resolve(testDownloadPath),
    });
  });
});
