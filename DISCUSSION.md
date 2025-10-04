# TODO:
- consider a more robust way of sharing types between frontend and backend that would make it easier to split them into separate repos
- consider using a package manager like bun http://bun.com/package-manager for faster, disk efficient, package isolated builds: https://bun.com/docs/install/isolated
- add a route to let you click in to see a particular advocate's details
- consider trimming the explanatory (in parenthesis text) from specialties as it takes up a fair amount of visual space
  - this would have implications for the search though
- consider showing collapsed specialties in a tool tip
- I would expect that the number of specialties per person would be reasonably constrained to under 10, but if that's not the case we might need to reconsider how that data is stored an queried
- consider adding a "fuzzy search" feature https://www.postgresql.org/docs/current/fuzzystrmatch.html

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