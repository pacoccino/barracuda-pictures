export const schema = gql`
  type Image {
    id: String!
    path: String!
    dateTaken: DateTime!
    metadata: JSONObject!
    tagsOnImages: [TagsOnImage]!
  }

  type Query {
    images(
      filter: ImageFilters
      take: Int
      skip: Int
      sorting: ImageSorting
      cursor: String
    ): [Image]! @requireAuth

    moreImages(
      filter: ImageFilters
      take: Int
      skip: Int
      sorting: ImageSorting
      cursor: String
    ): [Image]! @requireAuth

    image(id: String!): Image @requireAuth
  }

  type DeleteManyResult {
    count: Int!
  }

  type Mutation {
    deleteManyImages(imageIds: [String!]!): DeleteManyResult! @requireAuth
    deleteManyImagesWithFilter(filter: ImageFilters!): DeleteManyResult!
      @requireAuth
    editImageBasePath(imageId: String!, basePath: String!): Boolean!
      @requireAuth
  }

  input ImageFilters {
    tagLists: [FilterByTagList!]
    dateRange: DateRange
    path: String
  }

  input FilterByTagList {
    tagGroupId: String!
    tagIds: [String]!
    condition: TagListCondition!
  }

  input DateRange {
    from: DateTime
    to: DateTime
  }

  enum TagListCondition {
    AND
    OR
  }

  input ImageSorting {
    dateTaken: ORDER
  }

  enum ORDER {
    asc
    desc
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
