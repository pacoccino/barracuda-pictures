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

  type Mutation {
    deleteManyImages(select: ImagesSelect!): ManyResult! @requireAuth
    editImagesBasePath(
      select: ImagesSelect!
      input: EditImagesBasePath!
    ): ManyResult! @requireAuth
    editImages(select: ImagesSelect!, input: EditImages!): ManyResult!
      @requireAuth
  }

  type ManyResult {
    count: Int!
  }

  input ImageFilters {
    tagLists: [FilterByTagList!]
    dateRange: DateRange
    path: String
    rating: FilterByRating
  }

  input FilterByTagList {
    tagCategoryId: String!
    tagIds: [String]!
    condition: TagListCondition!
  }

  input FilterByRating {
    value: Int!
    condition: IntCondition
  }

  input ImagesSelect {
    imageIds: [String!]
    filter: ImageFilters
  }

  input DeleteManyImagesInput {
    imageIds: [String!]
    filter: ImageFilters
  }

  input EditImages {
    rating: Int
  }
  input EditImagesBasePath {
    basePath: String!
  }

  input DateRange {
    from: DateTime
    to: DateTime
  }

  enum TagListCondition {
    AND
    OR
  }

  enum IntCondition {
    equals
    lte
    gte
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
