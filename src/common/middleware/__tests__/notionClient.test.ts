import { Client } from "@notionhq/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the Notion client
vi.mock("@notionhq/client", () => {
  return { Client: vi.fn() };
});

describe("Notion Client", () => {
  const originalEnv = process.env;

  beforeEach(async () => {
    // Clear module cache to ensure fresh import with new environment variables
    vi.resetModules();
    // Mock environment variables
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    vi.unstubAllEnvs();
  });

  it("should initialize with the correct auth token", async () => {
    // Set the environment variable
    const mockToken = "mock-notion-auth-token";
    vi.doMock("@/common/utils/envConfig", () => {
      return { env: { NOTION_AUTH_TOKEN: mockToken } };
    });

    const notionClient = (await import("../notionClient")).notionClient;

    // Verify Client was called with the correct options
    expect(Client).toHaveBeenCalled();
    expect(Client).toHaveBeenCalledWith({ auth: mockToken });

    // Verify the client was exported correctly
    expect(notionClient).toBeDefined();
  });

  it("should initialize with undefined auth if token is not provided", async () => {
    vi.doMock("@/common/utils/envConfig", () => {
      return { env: { NOTION_AUTH_TOKEN: undefined } };
    });

    const notionClient = (await import("../notionClient")).notionClient;
    // Verify Client was called with undefined auth
    expect(Client).toHaveBeenCalledWith({ auth: undefined });

    // The client should still be defined
    expect(notionClient).toBeDefined();
  });
});
