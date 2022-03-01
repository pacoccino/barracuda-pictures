import { useFilterContext } from 'src/contexts/filter'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import {
  Box,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { MdClear, MdSearch } from 'react-icons/md'

export const PathPanel = () => {
  const {
    filter: { path: filterPath },
    setPath,
  } = useFilterContext()

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      path: '',
    },
  })
  const path = watch('path')

  useEffect(() => {
    reset({ path: filterPath || '' })
  }, [reset, filterPath])

  const onSubmit = ({ path }) => {
    setPath(path)
  }
  const clear = () => {
    reset({ path: '' })
    handleSubmit(onSubmit)()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <Input
          placeholder="argentique/2021/"
          type="text"
          onKeyDown={(e) => e.code === 'Escape' && clear()}
          {...register('path')}
        />
        <InputRightElement>
          {path.length > 0 ? (
            <IconButton
              aria-label="clear"
              variant="ghost"
              icon={<MdClear />}
              onClick={clear}
            />
          ) : (
            <MdSearch />
          )}
        </InputRightElement>
      </InputGroup>
    </form>
  )
}
