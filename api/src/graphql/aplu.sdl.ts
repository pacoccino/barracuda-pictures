export const schema = gql`
  type Query {
    arboPath: ArboPath! @requireAuth
    arboDate: ArboDate! @requireAuth
  }

  type ArboPath {
    path: String!
    count: Int!
    children: [ArboPath!]!
  }

  type ArboDate {
    path: Integer!
    count: Int!
    children: [ArboDate!]!
  }
`
