export const schema = gql`
  type TagsOnImage {
    id: Int!
    tagId: Int!
    tag: Tag!
    imageId: Int!
    image: Image!
  }

  type Query {
    tagsOnImages: [TagsOnImage!]! @requireAuth
  }

  type Mutation {
    addTagsOnImage(imageId: Int!, tagId: Int!): TagsOnImage! @requireAuth
    deleteTagsOnImage(imageId: Int!, tagId: Int!): Boolean! @requireAuth
  }

  input CreateTagsOnImageInput {
    tagId: Int!
    imageId: Int!
  }

  input UpdateTagsOnImageInput {
    tagId: Int
    imageId: Int
  }
`
