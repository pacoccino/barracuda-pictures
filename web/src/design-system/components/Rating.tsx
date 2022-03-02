import { ButtonGroup, IconButton } from '@chakra-ui/react'
import { MdStar, MdStarOutline } from 'react-icons/md'

interface RatingProps {
  value: number
  onChange?: (v: number) => void
  loading?: boolean
}
export const Rating = ({ value, onChange, loading }: RatingProps) => (
  <ButtonGroup isAttached size="sm" variant="ghost" isDisabled={loading}>
    {[1, 2, 3, 4, 5].map((i) => (
      <IconButton
        aria-label="lte"
        key={i}
        icon={i <= value ? <MdStar size={20} /> : <MdStarOutline size={20} />}
        color={i <= value ? 'yellow.400' : 'black'}
        onClick={() => onChange && onChange(i)}
      />
    ))}
  </ButtonGroup>
)
