export const schema = gql`
  type TagGroup {
    id: Int!
    name: String!
    tags: [Tag]!
  }

  type Query {
    tagGroups: [TagGroup!]! @requireAuth
  }

  input CreateTagGroupInput {
    name: String!
  }

  input UpdateTagGroupInput {
    name: String
  }
`
