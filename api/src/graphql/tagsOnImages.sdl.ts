export const schema = gql`
  type TagsOnImage {
    id: String!
    tagId: String!
    tag: Tag!
    imageId: String!
    image: Image!
  }

  type Query {
    tagsOnImages: [TagsOnImage!]! @requireAuth
  }

  type Mutation {
    createTagsOnImage(input: TagsOnImageInput!): TagsOnImage! @requireAuth
    createManyTagsOnImage(input: [TagsOnImageInput!]!): [TagsOnImage!]!
      @requireAuth
    deleteTagsOnImage(input: TagsOnImageInput!): Boolean! @requireAuth
  }

  input TagsOnImageInput {
    imageId: String!
    tagId: String!
  }
`
