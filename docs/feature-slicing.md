# INVENTORY MANAGEMENT APP FEATURE SLICES

## Project Overall Setup

1. Repo name
2. Version Control strategies:
   1. branching:
      1. For features: feature/<github_issue_number>-<feature_name>
      2. For bugs: fix/<github_issue_number>-<bug_name>
      3. For updates and other tasks: chore/<github_issue_number>-<task_name>
3. Technologies
   1. Linting, code formatting and code validation
      1. eslint
      2. prettier
      3. husky
      4. ts internal (tsconfig rules)
   2. Frontend
      1. language: ts
      2. framework: React + Vite
      3. state management: React Context
      4. data validation: Zod
      5. routing: React Router Dom
      6. styling: mui
      7. table rendering: material react table
      8. test: cypress + vitest
      9. logging: custom logger implementation
      10. alerts: React Toastify
   3. Backend
      1. data validation: Zod
      2. language: ts
      3. server framework: express
      4. testing: supertest
      5. persistence: sqlite3
   4. Infrastructure
      1. docker
   5. Product UI/UX Prototyping
      1. chatgpt AI
4. Architecture
   1. type: layered with clear separation of concerns
   2. Folder structure
      1. Frontend
         1. app
            1. providers
               1. ...<provider_defined_here>
         2. core
            1. ports
            2. models
            3. consts
         3. infrastructure
            1. LocalStorage: for an abstraction layer on top of local storage
            2. APIClient
            3.
         4. pages
            1. Dashboard
            2. Stores
            3. Product
            - <each_page>
              1. ui
              2. repository
              3. hooks
              4. services
              5. consts.ts
              6. types.
         5. lib
      2. Backend
         1. core
         2. infrastructure
         3. application
            1. dashboard
            2. products
            3. stores
