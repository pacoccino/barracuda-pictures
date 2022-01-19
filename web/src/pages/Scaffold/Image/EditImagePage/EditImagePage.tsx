import EditImageCell from 'src/components/Scaffold/Image/EditImageCell'

type ImagePageProps = {
  id: number
}

const EditImagePage = ({ id }: ImagePageProps) => {
  return <EditImageCell id={id} />
}

export default EditImagePage
