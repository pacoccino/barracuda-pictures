import type { Image } from 'types/graphql'
import { useContext, useState, useCallback, useMemo } from 'react'

interface SelectContextType {
  addImageToSelection: (i: { id: string }) => void
  removeImageFromSelection: (i: { id: string }) => void
  clearSelection: () => void
  isImageSelected: (i: { id: string }) => boolean
  selectedImages: Image[]
  setAllSelected: (b: boolean) => void
  allSelected: boolean
  isSelectionActive: boolean
}

export const SelectContext = React.createContext<SelectContextType>({
  addImageToSelection: (_i: Image) => 0,
  removeImageFromSelection: (_i: Image) => 0,
  clearSelection: () => 0,
  isImageSelected: () => false,
  selectedImages: [],
  setAllSelected: (_b: boolean) => 0,
  allSelected: false,
  isSelectionActive: false,
})

export const SelectContextProvider = ({ children }) => {
  const [allSelected, setAllSelected] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const isSelectionActive = useMemo(
    () => allSelected || selectedImages.length > 0,
    [allSelected, selectedImages]
  )

  const addImageToSelection = useCallback(
    (image: Image) => {
      if (selectedImages.findIndex((i) => i.id === image.id) === -1)
        setSelectedImages(selectedImages.concat(image))
    },
    [selectedImages]
  )
  const removeImageFromSelection = useCallback(
    (image: Image) => {
      setSelectedImages(selectedImages.filter((i) => i.id !== image.id))
    },
    [selectedImages]
  )
  const clearSelection = useCallback(() => {
    setSelectedImages([])
    setAllSelected(false)
  }, [])

  const isImageSelected = useCallback(
    (image) => {
      if (allSelected) return true
      return selectedImages.findIndex((i) => i.id === image.id) !== -1
    },
    [selectedImages, allSelected]
  )

  return (
    <SelectContext.Provider
      value={{
        addImageToSelection,
        removeImageFromSelection,
        clearSelection,
        selectedImages,
        isImageSelected,
        allSelected,
        setAllSelected,
        isSelectionActive,
      }}
    >
      {children}
    </SelectContext.Provider>
  )
}

export const useSelectContext = () => useContext(SelectContext)
