export const schema = gql`
  type Mutation {
    scan: ScanResponse! @requireAuth
  }

  type ScanResponse {
    success: Boolean
  }
`
