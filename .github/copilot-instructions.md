# Copilot Instructions for Server Boilerplate

## General Guidelines
- **Language**: Use TypeScript for all code.
- **Framework**: Follow Express.js conventions for routing, middleware, and error handling.
- **Validation**: Use Zod for input validation and schema definitions.
- **API Documentation**: Generate OpenAPI documentation using `@asteasolutions/zod-to-openapi`.

## File Structure
- Organize files by feature (e.g., `api/user`, `api/healthCheck`).
- Place shared utilities and middleware in the `src/common` directory.
- Use `__tests__` folders for test files colocated with the feature being tested.

## Code Style
- Use Biome for formatting and linting. Ensure code adheres to the rules defined in `biome.json`.
- Maintain a line width of 120 characters and use 2-space indentation.
- Use path aliases (`@`) for imports from the `src` directory.

## Logging
- Use the custom Pino logger (`customLogger.ts`) for all logging.
- For production, enable Telegram logging by setting the appropriate environment variables.

## Testing
- Write tests using Vitest and Supertest.
- Mock external dependencies (e.g., Firebase, Notion) in tests.
- Use `describe` and `it` blocks for test organization.

## API Design
- Use the `ServiceResponse` class for consistent API responses.
- Validate all incoming requests using Zod schemas and the `validateRequest` middleware.
- Document all API endpoints using `@asteasolutions/zod-to-openapi`.

## Environment Variables
- Define all environment variables in `.env.template` and validate them using Envalid.
- Use `envConfig.ts` for accessing environment variables in the code.

## Rate Limiting
- Use the `rateLimiter.ts` middleware to limit requests. Configure limits via environment variables.

## Error Handling
- Use the centralized error handler (`errorHandler.ts`) for all unhandled errors and unexpected routes.