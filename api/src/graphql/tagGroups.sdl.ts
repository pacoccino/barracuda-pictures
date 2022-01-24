export const schema = gql`
  type TagGroup {
    id: String!
    name: String!
    tags: [Tag]!
  }

  type Query {
    tagGroups: [TagGroup!]! @requireAuth
  }

  type Mutation {
    createTagGroup(input: CreateTagGroupInput!): TagGroup! @requireAuth
    updateTagGroup(id: String!, input: UpdateTagGroupInput!): TagGroup!
      @requireAuth
    deleteTagGroup(id: String!): Boolean! @requireAuth
  }

  input CreateTagGroupInput {
    name: String!
  }

  input UpdateTagGroupInput {
    name: String
  }
`
