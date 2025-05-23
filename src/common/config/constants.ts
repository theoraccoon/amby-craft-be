export const CONTENT_TYPES = {
  // Text types
  PARAGRAPH_BLOCK: 'paragraph',
  PARAGRAPH_WITH_HEADING_BLOCK: 'paragraph_with_heading',
  PARAGRAPH_WITH_SUBHEADING_BLOCK: 'paragraph_with_subheading',
  HEADING_BLOCK: 'heading',
  SUBHEADING_BLOCK: 'subheading',
  COLUMNS_BLOCK: 'columns',
  TABLE_BLOCK: 'table',
  // Statement types
  STATEMENT_A_BLOCK: 'statement_a',
  STATEMENT_B_BLOCK: 'statement_b',
  STATEMENT_C_BLOCK: 'statement_c',
  STATEMENT_D_BLOCK: 'statement_d',
  NOTE_BLOCK: 'note',
  // Quote types
  QUOTE_A_BLOCK: 'quote_a',
  QUOTE_B_BLOCK: 'quote_b',
  QUOTE_C_BLOCK: 'quote_c',
  QUOTE_D_BLOCK: 'quote_d',
  QUOTE_ON_IMAGE_BLOCK: 'quote_on_image',
  QUOTE_CAROUSEL_BLOCK: 'quote_carousel',
  // List types
  NUMBERED_LIST_BLOCK: 'numbered_list',
  CHECKBOX_LIST_BLOCK: 'checkbox_list',
  BULLETED_LIST_BLOCK: 'bulleted_list',
  // Image types
  IMAGE_CENTERED_BLOCK: 'image_centered',
  IMAGE_FULL_WIDTH_BLOCK: 'image_full_width',
  IMAGE_AND_TEXT_BLOCK: 'image_and_text',
  TEXT_ON_IMAGE_BLOCK: 'text_on_image',
  // Gallery types
  CAROUSEL_BLOCK: 'carousel',
  TWO_COLUMN_GRID_BLOCK: 'two_column_grid',
  THREE_COLUMN_GRID_BLOCK: 'three_column_grid',
  FOUR_COLUMN_GRID_BLOCK: 'four_column_grid',
  // Multimedia types
  AUDIO_BLOCK: 'audio',
  VIDEO_BLOCK: 'video',
  EMBED_BLOCK: 'embed',
  ATTACHMENT_BLOCK: 'attachment',
  CODE_SNIPPET_BLOCK: 'code_snippet',
  // Interactive types
  ACCORDION_BLOCK: 'accordion',
  TABS_BLOCK: 'tabs',
  LABELLED_GRAPHICS_BLOCK: 'labelled_graphics',
  PROCESS_BLOCK: 'process',
  SCENARIO_BLOCK: 'scenario',
  SORTING_ACTIVITY_BLOCK: 'sorting_activity',
  TIMELINE_BLOCK: 'timeline',
  FLASHCARD_GRID_BLOCK: 'flashcard_grid',
  FLASHCARD_STACK_BLOCK: 'flashcard_stack',
  BUTTON_BLOCK: 'button',
  BUTTON_STACK_BLOCK: 'button_stack',
  STORYLINE_BLOCK: 'storyline',
  // Knowledge check types
  MULTIPLE_CHOICE_BLOCK: 'multiple_choice',
  MULTIPLE_RESPONSE_BLOCK: 'multiple_response',
  FILL_IN_THE_BLANK_BLOCK: 'fill_in_the_blank',
  MATCHING_BLOCK: 'matching',
  DRAW_FROM_QUESTION_BANK_BLOCK: 'draw_from_question_bank',
  // Chart types
  BAR_CHART_BLOCK: 'bar_chart',
  LINE_CHART_BLOCK: 'line_chart',
  PIE_CHART_BLOCK: 'pie_chart',
  // Divider types
  CONTINUE_BLOCK: 'continue',
  DIVIDER_BLOCK: 'divider',
  NUMBERED_DIVIDER_BLOCK: 'numbered_divider',
  SPACER_BLOCK: 'spacer',

  //tokens
  ACCESS_EXPIRY: '1h',
  ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000,
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000,

  // user
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_INFO: 'User Info',
};

export const API_CONSTANTS = {
  GOOGLE_API_TAG: 'Google Auth',
  GOOGLE_AUTH: 'google',
  GOOGLE_AUTH_CALLBACK: 'google/callback',
  GOOGLE: 'google',
  JWT: 'jwt',
  API_GLOBAL_PREFIX: '/api/v1',
  HEALTH_CHECK: 'Health Check',
  PING: 'ping',
  PONG: 'pong!',
  PATH: '/api/v1/auth',
};

export const TEXTS = {
  EMAIL: 'email',
  PROFILE: 'profile',
};

export const SESSION = {
  SESSION_SECRET_UNDEFINED: 'SESSION_SECRET is not defined in the environment variables',
};

export const ERRORS = {
  ERROR_STARTING_APPLICATION: 'Error starting the application:',
  ERROR_STARTING_APPLICATION_MESSAGE: 'Error starting the application:',
  ERROR_VALIDATING_OAUTH_LOGIN: 'Error validating OAuth login.',
  ERROR_GOOGLE_PROFILE_MISSING_EMAIL: 'Google profile missing email.',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  USER_NOT_FOUND: 'User not found or created',
  DEFAULT_ROLE_NOT_FOUND: 'Default role Content Creator not found.',
  ERROR_CREATINF_NEW_USER: 'Error creating new user.',
  ERROR_GENERATING_TOKENS: 'Error generating tokens.',
};

export const RUNNINGS = {
  RUNNING_ON: 'Application is running on:',
  LISTENING_ON: 'Listening on port:',
  LISTENING_ON_HOST: 'Listening on host:',
  LISTENING_ON_PORT: 'Listening on port:',
  BASE_HOST: '0.0.0.0',
};

const description = `
**Ambylon Craft** is a modular, scalable content authoring platform designed for creating rich, interactive educational experiences. Inspired by tools like Rise 360, it enables content creators to structure learning materials through a flexible hierarchy of **Courses**, **Lessons**, and **Blocks** — each supporting multiple content types including text, images, video, quizzes, and embedded components.

The backend is built using **NestJS** with a robust **CQRS architecture**, **Prisma ORM**, and a **MariaDB** database. Authentication is powered by **JWTs** with secure **cookie-based session management**, and includes support for **Google OAuth login**.

---

## ✨ Key Features

- 📚 **Course Builder**: Authors can create and manage courses with nested lessons and dynamic blocks.
- 🔒 **Authentication**: Secure login with JWT, refresh tokens, and Google social login.
- ⚙️ **CQRS Pattern**: Clean separation of commands, queries, and handlers for maintainable domain logic.
- 🛡️ **Session Management**: Access and refresh tokens handled via secure cookies.
- 🧩 **Block-Based Authoring**: Modular content support (text, images, videos, quizzes, embeds).
- 🔄 **Swagger-Enabled API**: Fully documented endpoints with secure JWT integration and social login redirect.
- 📦 **Docker-Ready**: Containerized with support for production builds and Prisma migrations.
- 🔍 **Validation, Interceptors, Filters**: Structured error handling and consistent API responses.

---

## 🧱 Architecture Overview

- **Framework**: NestJS + TypeScript
- **Design Pattern**: CQRS + DI + Modular DDD-inspired layers
- **ORM**: Prisma with MariaDB (Dockerized)
- **Authentication**: Passport.js with JWT + Google OAuth
- **API Docs**: Swagger UI with JWT preauthorization and cookie token support
- **Content Model**:
  - \`User\` → \`Course\` → \`Lesson\` → \`Block\`
  - Each block supports structured content, order, and optional styling

---

## 🐳 Dev Environment

- MariaDB via Docker
- Prisma ORM + CLI for schema and migrations
- \`.env.docker\` for Docker runtime configs
- \`entrypoint.sh\` to apply migrations and start the app

---

## 📄 License

MIT © 2025 — Crafted for modern learning platforms.
`;

export const SWAGGER = {
  SWAGGER_API: 'Ambylon Craft API',
  SWAGGER_API_DESCRIPTION: description,
  SWAGGER_API_VERSION: '1.0.0',
  SWAGGER_API_PATH: 'docs',
};

export const AUTH_LITERALS = {
  REFRESHTOKENMISSING: 'Refresh token is missing',
  REFRESHTOKEN: 'refreshToken',
  ACCESSTOKEN: 'accessToken',
  REFRESHTOKENEXPIRY: 'refreshTokenExpiry',
  UNAUTHORIZEDEXCEPTION: 'User not found or no stored refresh token',
  REFRESHTOKENEXPIRED: 'Refresh token has expired',
  INVALIDREFRESHTOKEN: 'Invalid refresh token',
  INVALIDREFRESHTOKENFROMDB: 'Invalid refresh token from db',
  WRONGCREDENTIALS: 'Wrong credentials provided',
  INVALIDCREDENTIALS: 'Invalid credentials provided',
  FRONTEND_URL: 'http://localhost:4000',
  REDIRECT_URL: 'http://127.0.0.1:4000/dashboard',
  JWT_SECRET_NOT_FOUND: 'JWT_SECRET is not defined in the environment configuration.',
  USERNOTCREATED: 'User not created',
};
