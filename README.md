# Weather-Driven Activity Desirability Planner

A production-grade system written in TypeScript that fetches geospatial parameters and processes 7-day weather matrices against configurable rules matrices to determine destination suitability rankings.

## Architectural Deep-Dive
1. **Strategy Design Pattern Matrix**: The scoring engine (`scoringEngine.ts`) rejects fragile nested conditional `if-else` block configurations. Instead, activities map declaratively to rule vectors where decoupled functions score individual weather variables independently. This keeps addition tasks frictionless.
2. **Sequential API Orchestration Pipelines**: Data transitions predictably from Geocoding lookup parameters directly to downstream multi-variable forecasts. The backend encapsulates integration workflows completely away from presentation UI boundaries.
3. **GraphQL Payload Abstraction Layers**: Exposing a typed strict GraphQL schema minimizes bandwidth expenditure. It packages processed multi-element daily numerical metrics efficiently in a single trip.

## AI Engine Assistance & Application Judgment
- **Assistance Map**: AI helped scaffold boilerplate type properties for the weather schemas and configured structural GraphQL types.
- **Human Architectural Judgment**: Manual intervention restructured the scoring mechanics into weighted configuration maps, ensuring that expanding the system with alternative locations or activities does not break existing application behavior.

Execute Below step to run application"
For frontent execute below command
npm i
npm run dev

For Backend
npm i
npm run build
npm run start