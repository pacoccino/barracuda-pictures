import { GraphQLClientConfigProp } from '@redwoodjs/web/apollo'

export const graphQLClientConfig: GraphQLClientConfigProp = {
  connectToDevTools: true,
  cacheConfig: {
    typePolicies: {
      Query: {
        fields: {
          moreImages: {
            // query variables which clears cache data
            keyArgs: ['filter'],

            merge(existing, incoming, { readField, args, variables }) {
              const merged = { ...existing }
              incoming.forEach((item) => {
                merged[readField('id', item)] = item
              })
              return merged
            },
            read(existing, { args }) {
              if (!existing) return
              return Object.values(existing)
            },
          },
        },
      },
    },
  },
}
