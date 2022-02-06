import { GraphQLClientConfigProp } from '@redwoodjs/web/apollo'

export const graphQLClientConfig: GraphQLClientConfigProp = {
  cacheConfig: {
    typePolicies: {
      Query: {
        fields: {
          images: {
            // query variables which clears cache data
            keyArgs: ['filter'],
            merge(existing = [], incoming) {
              return [...existing, ...incoming]
            },
          },
        },
      },
    },
  },
}
