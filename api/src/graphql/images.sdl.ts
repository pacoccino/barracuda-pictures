export const schema = gql`
  type Image {
    id: Int!
    path: String!
    dateTaken: DateTime!
    dateEdited: DateTime!
    metadataJson: String!
    tags: [TagImage]!
  }

  type Query {
    images: [Image!]! @requireAuth
    image(id: Int!): Image @requireAuth
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
