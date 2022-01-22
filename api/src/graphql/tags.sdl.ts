export const schema = gql`
  type Tag {
    id: Int!
    name: String!
    tagGroupId: Int!
    tagGroup: TagGroup!
    tagsOnImages: [TagsOnImage]!
  }

  type Query {
    tags: [Tag!]! @requireAuth
  }

  type Mutation {
    createTag(name: String!, tagGroupId: Int!): Tag! @requireAuth
    updateTag(id: Int!, input: UpdateTagInput!): Tag! @requireAuth
    deleteTag(id: Int!): Boolean! @requireAuth
  }

  input CreateTagInput {
    name: String!
    tagGroupId: Int!
  }

  input UpdateTagInput {
    name: String
  }
`
