export const schema = gql`
  type Image {
    id: String!
    path: String!
    dateTaken: DateTime!
    metadataJson: String!
    tagsOnImages: [TagsOnImage]!
  }

  type Query {
    images: [Image!]! @requireAuth
    imagesWithFilter(filter: ImageFilters!): [Image]! @requireAuth
    image(id: String!): Image @requireAuth
  }

  input ImageFilters {
    tagIds: [String]
  }

  input CreateImageInput {
    path: String!
    dateTaken: DateTime!
    metadataJson: String!
  }

  input UpdateImageInput {
    path: String
    dateTaken: DateTime
    metadataJson: String
  }
`
