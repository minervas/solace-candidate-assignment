# TODO:
- consider a more robust way of sharing types between frontend and backend that would make it easier to split them into separate repos
- consider using a package manager like bun http://bun.com/package-manager for faster, disk efficient, package isolated builds: https://bun.com/docs/install/isolated
- add a route to let you click in to see a particular advocate's details
- consider trimming the explanatory (in parenthesis text) from specialties as it takes up a fair amount of visual space
  - this would have implications for the search though
- consider showing collapsed specialties in a tool tip
- I would expect that the number of specialties per person would be reasonably constrained to under 10, but if that's not the case we might need to reconsider how that data is stored an queried
- consider adding a "fuzzy search" feature https://www.postgresql.org/docs/current/fuzzystrmatch.html
- trim leading/trailing whitespace from the search term
- add column sorting
- add 404 & internal server error pages
- consider fetching more than 1 page of data at the start and fetching additional pages in the background as the user pages through data to improve user experience
- add individual field filtering controls in a ... collapsible filter bar?
  - with this change we should actually add filtering capabilities to the advocates backend API (which will adjust our postgres query to filter results)

# TODO when productionizing the app:
- add a sign-in with authn/authz
- add redirect to sign-in page for protected parts of the site (can be done by wrapping components with a higher-order component that validates auth then conditionally redirects)
- add a CDN & WAF with rate limiting/DDoS protection
- add a robots.txt page
- host under a custom domain
- add cert rotation for the custom domain
- create a CI pipeline with unit/integration test checks, lint checks, deployment etc
- create a strategy for multi-regional deployment
- create a disaster recovery plan with target recovery objectives
- define availability/performance requirements
- project usage patterns to inform scaling requirements
- create APIs for adding and updating advocates
- choose what cloud provider(s) you intend to host your application on
- containerize the application and choose a container orchestration framework (or use serverless)
- consider what sort of compliance certifications might be relevant for the application (SOC 2, HITRUST, etc)
- deploy and measure how the app conforms to non-functional requirements
- perform threat modeling on a regular cadence and prioritize threat mitigations
- analyze postgres query performance and adust indexes, data types, etc to optimize performance
- consider adding client or server level caching (consider what type of cache would best fit each scenario and whether or not stale data in the cache is acceptable)
- create documentation and tutorials for app usage
- improve logging
- add correlation/trace ids to requests to improve observability
- add app analytics to better track usage and usability

# Note 
- I'm using vitest instead of jest as I've found that it is faster and more scalable than jest. I believe it is due to how jest handles barrel files https://dev.to/fogel/potential-issues-with-barrel-files-in-jest-1nkl and other issues with jest memory usage https://www.reddit.com/r/typescript/comments/1i8bpii/crazy_jest_memory_usage/

# Things to keep in mind with unit testing in React (per Gemini)
- Prioritize User Behavior:
  - Test Outcomes, Not Implementation Details:
    - Focus on what the user sees and interacts with, rather than internal state or props. This makes tests more resilient to refactoring.

- Structure and Maintainability:
  - AAA Pattern (Arrange, Act, Assert):
    - Structure tests clearly.
    - set up the component (Arrange), perform an action (Act), and verify the outcome (Assert).
  - Small, Focused Tests:
    - Each test should ideally verify a single behavior or feature, making them easier to understand and debug.
  - Descriptive Test Names:
    - Use clear and concise names that accurately describe the purpose of each test.
- Mock Dependencies:
  - Isolate the component under test by mocking external services, API calls, and other dependencies to ensure deterministic results.
- Strategic Snapshot Testing:
  - Use snapshot tests cautiously for visual regression, but avoid over-reliance as they can be brittle with frequent UI changes.
- Efficiency and Reliability:
  - Deterministic Tests:
    - Ensure tests produce the same results every time, regardless of external factors or execution order.
  - Test Edge Cases and Error States:
    - Cover unusual scenarios and potential error conditions to ensure robust component behavior.
  - Use screen Object for Queries:
    - Leverage the screen object from RTL for querying elements, promoting better test maintenance and readability.