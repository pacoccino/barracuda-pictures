export const schema = gql`
  type Image {
    id: String!
    path: String!
    dateTaken: DateTime!
    dateEdited: DateTime!
    metadataJson: String!
    tagsOnImages: [TagsOnImage]!
  }

  type Query {
    images: [Image!]! @requireAuth
    image(id: String!): Image @requireAuth
  }

  input CreateImageInput {
    path: String!
    dateTaken: DateTime!
    dateEdited: DateTime!
    metadataJson: String!
  }

  input UpdateImageInput {
    path: String
    dateTaken: DateTime
    dateEdited: DateTime
    metadataJson: String
  }
`
