export const schema = gql`
  type Query {
    attributesFromFilter(filter: ImageFilters): JSONObject! @requireAuth
  }

  type ArboResponse {
    arboPath: ArboPath!
    arboDate: ArboDate!
    tags: [Tag!]!
  }

  type ArboPath {
    path: String!
    count: Int!
    children: [ArboPath!]!
  }

  type ArboDate {
    path: Int!
    date: DateTime!
    count: Int!
    children: [ArboDate!]!
  }
`
