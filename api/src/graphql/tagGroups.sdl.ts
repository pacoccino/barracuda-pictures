export const schema = gql`
  type TagGroup {
    id: Int!
    name: String!
    tags: [Tag]!
  }

  type Query {
    tagGroups: [TagGroup!]! @requireAuth
  }

  type Mutation {
    createTagGroup(name: String!): TagGroup! @requireAuth
    updateTagGroup(id: Int!, input: UpdateTagGroupInput!): TagGroup!
      @requireAuth
    deleteTagGroup(id: Int!): Boolean! @requireAuth
  }

  input CreateTagGroupInput {
    name: String!
  }

  input UpdateTagGroupInput {
    name: String
  }
`
