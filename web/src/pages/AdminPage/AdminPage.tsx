import { MetaTags, useMutation } from '@redwoodjs/web'
import { Button, useToast } from '@chakra-ui/react'

const SCAN_MUTATION = gql`
  mutation scan {
    scan {
      success
    }
  }
`

const AdminPage = () => {
  const toast = useToast()
  const [scan, { loading }] = useMutation(SCAN_MUTATION, {
    onCompleted: () => {
      toast({
        title: 'Scan completed',
        description: "We've scanned the pictures.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    },
    onError: (error) => {
      toast({
        title: 'Scan error',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    },
  })

  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      <h1>AdminPage</h1>
      <Button onClick={() => scan()} disabled={loading}>
        Scan
      </Button>
    </>
  )
}

export default AdminPage
