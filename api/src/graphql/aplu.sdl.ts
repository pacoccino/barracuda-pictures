export const schema = gql`
  type Query {
    arbo: JSONObject! @requireAuth
  }

  type ArboResponse {
    arboPath: ArboPath!
    arboDate: ArboDate!
  }

  type ArboPath {
    path: String!
    count: Int!
    children: [ArboPath!]!
  }

  type ArboDate {
    path: Int!
    count: Int!
    children: [ArboDate!]!
  }
`
