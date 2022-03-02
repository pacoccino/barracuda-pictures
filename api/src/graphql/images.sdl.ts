export const schema = gql`
  type Image {
    id: String!
    path: String!
    dateTaken: DateTime!
    rating: Int!
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

  type EditManyResult {
    count: Int!
  }
  type DeleteManyResult {
    count: Int!
  }

  type Mutation {
    deleteManyImages(input: DeleteManyImagesInput!): DeleteManyResult!
      @requireAuth
    editImagesBasePath(input: EditImagesBasePath!): EditManyResult! @requireAuth
    editImages(select: ImagesSelect!, input: EditImages!): EditManyResult!
      @requireAuth
  }

  input ImageFilters {
    tagLists: [FilterByTagList!]
    dateRange: DateRange
    path: String
    rating: FilterByRating
  }

  input ImagesSelect {
    imageIds: [String!]
    filter: ImageFilters
  }

  input FilterByTagList {
    tagGroupId: String!
    tagIds: [String]!
    condition: TagListCondition!
  }

  enum IntCondition {
    equals
    lte
    gte
  }

  input FilterByRating {
    value: Int!
    condition: IntCondition
  }

  input DeleteManyImagesInput {
    imageIds: [String!]
    filter: ImageFilters
  }
  input EditImagesBasePath {
    imageIds: [String!]
    filter: ImageFilters
    basePath: String!
  }

  input EditImages {
    rating: Int
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
