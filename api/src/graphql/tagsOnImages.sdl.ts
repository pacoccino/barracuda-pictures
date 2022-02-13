export const schema = gql`
  type TagsOnImage {
    id: String!
    tagId: String!
    tag: Tag!
    imageId: String!
    image: Image!
  }

  type UpdateManyResult {
    count: Int!
  }

  type Query {
    tagsOnImages: [TagsOnImage!]! @requireAuth
  }

  type Mutation {
    createTagsOnImage(input: TagsOnImageInput!): TagsOnImage! @requireAuth
    createManyTagsOnImage(input: [TagsOnImageInput!]!): UpdateManyResult!
      @requireAuth
    deleteTagsOnImage(input: TagsOnImageInput!): TagsOnImage! @requireAuth
    deleteManyTagsOnImage(input: [TagsOnImageInput!]!): UpdateManyResult!
      @requireAuth
    applyManyTagsOnImage(input: ApplyManyTagsOnImageInput!): UpdateManyResult!
      @requireAuth
    applyTagOnFilter(input: ApplyTagOnFilterInput!): UpdateManyResult!
      @requireAuth
  }

  input TagsOnImageInput {
    imageId: String!
    tagId: String!
  }

  enum ApplyTagMode {
    ADD
    REMOVE
  }

  input ApplyManyTagsOnImageInput {
    tagsOnImage: [TagsOnImageInput!]!
    applyMode: ApplyTagMode!
  }

  input ApplyTagOnFilterInput {
    filter: ImageFilters!
    tagId: String!
    applyMode: ApplyTagMode!
  }
`
