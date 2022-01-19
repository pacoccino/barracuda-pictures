export const schema = gql`
  type TagImage {
    tagId: Int!
    tag: Tag!
    imageId: Int!
    image: Image!
  }

  type Query {
    tagImages: [TagImage!]! @requireAuth
  }

  input CreateTagImageInput {
    tagId: Int!
    imageId: Int!
  }

  input UpdateTagImageInput {
    tagId: Int
    imageId: Int
  }
`
