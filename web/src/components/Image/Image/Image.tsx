import {
  Badge,
  Box,
  Image as ImageChakra,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { getImageUrl } from 'src/lib/static'
import { useMemo } from 'react'
import { CellSuccessProps } from '@redwoodjs/web'
import { FindImageWithTagsById } from 'types/graphql'

const Image = ({ image }: CellSuccessProps<FindImageWithTagsById>) => {
  const imageUrl = useMemo(() => getImageUrl(image), [])

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Image {image.id} Detail
          </h2>
        </header>
        <Box>
          <ImageChakra src={imageUrl} alt={image.path} />
        </Box>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{image.id}</td>
            </tr>
            <tr>
              <th>Path</th>
              <td>{image.path}</td>
            </tr>
            <tr>
              <th>Date taken</th>
              <td>{image.dateTaken}</td>
            </tr>
            <tr>
              <th>Date edited</th>
              <td>{image.dateEdited}</td>
            </tr>
            <tr>
              <th>Tags</th>
              <td>
                {image.tagsOnImages.map((tagsOnImage) => (
                  <Wrap key={tagsOnImage.id}>
                    <WrapItem>
                      <Badge>{tagsOnImage.tag.name}</Badge>
                    </WrapItem>
                  </Wrap>
                ))}
              </td>
            </tr>
            <tr>
              <th>Metadata json</th>
              <td>{image.metadataJson}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Image
