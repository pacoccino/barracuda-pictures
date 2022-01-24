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
    createTagsOnImage(imageId: String!, tagId: String!): TagsOnImage!
      @requireAuth
    deleteTagsOnImage(imageId: String!, tagId: String!): Boolean! @requireAuth
  }
`
