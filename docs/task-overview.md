# About Knostic Inventory management app

## Key Non Functional Requirements

1. Good code architecture
2. Performance
3. Good user experience

## About the Application.

A simple scalable inventory management system for stores and their products.

### Non Technical Requirements

1. A store can have multiple products
2. A product will will have the ff details:
   1. name
   2. category
   3. stock quantity
   4. price
3. User should be able to manage stores and products
   1. Add a new store
   2. Add products to a store
4. User Should be able to view and manage products across all stores with the ff viewing features:
   1. filtering
   2. pagination

### Technical Requirements

1. Build a scalable frontend and backend for the system

#### Backend Requirements

1. Build a nodejs RESTful server
2. Include data persistence with a db
3. Include basic CRUD operations

#### Frontend Requirements

1. Build a scalable sophisticated frontend with React
2. Implement robust state management
3. Design at least 3-4 well structured screens
   1. Dashboard or home screen
   2. stores page for store and store products management; including data manipulation (filtering, search)
   3. product page with advanced data manipulation (filtering, search)
      1. Include product edit component to update a product's details

###### UI Feature requirement

1. Data manipulation
   1. must be able to filter on all product fields
   2. include url state persistence for each table
   3. Include column sorting
   4. include dynamic column selection
2. Search
   1. search must be debounced
   2. search must be optimized
3. Loading:
   1. include loading views and components
4. Error handling
   1. Include graceful error handling components and mechanisms
5. Data placeholders
   1. Include empty data components
6. Optimistic Updates
   1. Implement optimistic updates on the client
7. Design and Styling
   1. include multi theming
   2. Include consistent design and components across all pages

#### Infrastructure Requirements

1. User Docker to containerise the application
2. Include a single bootstrap command in the application container to run the system

#### Submission Requirements

1. Submit a repository with the ff content:
   1. server folder: server code
   2. web: frontend code
   3. Docker file: Infrastructure setup and execution
2. Include a ReadMe with:
   1. project setup instructions
   2. project execution/run instructions
   3. Include architecture decisions reasoning
   4. Include tradeoffs in architecture decisions
   5. Include 3-5 improvements that can be made such as
      1. Additional features
      2. Performance
      3. UX improvements
      4. Technical debt
