export const schema = gql`
  type Tag {
    id: String!
    name: String!
    tagGroupId: String!
    tagGroup: TagGroup!
    tagsOnImages: [TagsOnImage]!
  }

  type Query {
    tags: [Tag!]! @requireAuth
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag! @requireAuth
    updateTag(id: String!, input: UpdateTagInput!): Tag! @requireAuth
    deleteTag(id: String!): Boolean! @requireAuth
  }

  input CreateTagInput {
    name: String!
    tagGroupId: String!
  }

  input UpdateTagInput {
    name: String
    tagGroupId: String
  }
`
