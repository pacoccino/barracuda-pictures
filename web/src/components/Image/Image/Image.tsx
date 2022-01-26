import {
  Box,
  Button,
  HStack,
  Image as ImageChakra,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { getImageUrl } from 'src/lib/static'
import { useMemo, useState } from 'react'
import { CellSuccessProps } from '@redwoodjs/web'
import { FindImageWithTagsById } from 'types/graphql'
import TagsModalCell from 'src/components/Tag/TagsModalCell/TagsModalCell'
import { TagItemWithGroup } from 'src/components/Tag/TagItem/TagItem'

const Image = ({ image }: CellSuccessProps<FindImageWithTagsById>) => {
  const imageUrl = useMemo(() => getImageUrl(image), [])
  const [editTagOpen, setEditTagOpen] = useState(false)

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
              <th>Location</th>
              <td>
                {image.takenAtLat && image.takenAtLat ? (
                  <Box>
                    <p>
                      <b>Lat:</b> {image.takenAtLat}
                    </p>
                    <p>
                      <b>Lng:</b> {image.takenAtLng}
                    </p>
                  </Box>
                ) : (
                  'Unknonwn'
                )}
              </td>
            </tr>
            <tr>
              <th>Tags</th>
              <td>
                <HStack>
                  <Box>
                    {image.tagsOnImages.map((tagsOnImage) => (
                      <Wrap key={tagsOnImage.id}>
                        <WrapItem>
                          <TagItemWithGroup
                            tag={tagsOnImage.tag}
                          ></TagItemWithGroup>
                        </WrapItem>
                      </Wrap>
                    ))}
                  </Box>
                  <Box>
                    <Button onClick={() => setEditTagOpen(true)}>Edit</Button>
                  </Box>
                </HStack>
              </td>
            </tr>
            <tr>
              <th>Metadata json</th>
              <td>{JSON.stringify(image.metadata)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <TagsModalCell
        imageId={image.id}
        isOpen={editTagOpen}
        onClose={() => setEditTagOpen(false)}
      />
    </>
  )
}

export default Image
