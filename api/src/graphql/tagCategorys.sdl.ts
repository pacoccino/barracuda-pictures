export const schema = gql`
  type TagCategory {
    id: String!
    name: String!
    tags: [Tag]!
  }

  type Query {
    tagCategorys: [TagCategory!]! @requireAuth
  }

  type Mutation {
    createTagCategory(input: CreateTagCategoryInput!): TagCategory! @requireAuth
    updateTagCategory(
      id: String!
      input: UpdateTagCategoryInput!
    ): TagCategory! @requireAuth
    deleteTagCategory(id: String!): Boolean! @requireAuth
  }

  input CreateTagCategoryInput {
    name: String!
  }

  input UpdateTagCategoryInput {
    name: String
  }
`
