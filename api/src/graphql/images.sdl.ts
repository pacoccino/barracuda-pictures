export const schema = gql`
  type Image {
    id: String!
    path: String!
    dateTaken: DateTime!
    metadata: JSONObject!
    takenAtLng: Float
    takenAtLat: Float
    tagsOnImages: [TagsOnImage]!
  }

  type Query {
    images(
      filter: ImageFilters
      limit: Int
      skip: Int
      sorting: ImageSorting
    ): [Image]! @requireAuth
    image(id: String!): Image @requireAuth
  }

  input ImageFilters {
    tagIds: [String]
  }
  enum ORDER {
    asc
    desc
  }
  input ImageSorting {
    dateTaken: ORDER
  }

  input CreateImageInput {
    path: String!
    dateTaken: DateTime!
    metadata: JSONObject
  }

  input UpdateImageInput {
    path: String
    dateTaken: DateTime
    metadata: JSONObject
  }
`
