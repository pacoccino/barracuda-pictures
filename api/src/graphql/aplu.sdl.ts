export const schema = gql`
  type Query {
    arbo: ArboPath! @requireAuth
  }

  type ArboPath {
    path: String!
    count: Int!
    children: [ArboPath!]!
  }
`
