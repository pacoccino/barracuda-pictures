export const schema = gql`
  type Tag {
    id: Int!
    name: String!
    groupId: Int!
    tagGroup: TagGroup!
    tagsOnImages: [TagsOnImage]!
  }

  type Query {
    tags: [Tag!]! @requireAuth
  }

  input CreateTagInput {
    name: String!
    groupId: Int!
  }

  input UpdateTagInput {
    name: String
    groupId: Int
  }
`
