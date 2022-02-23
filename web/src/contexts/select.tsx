import type { Image } from 'types/graphql'
import { useContext, useState, useCallback, useMemo } from 'react'

export enum SelectMode {
  VIEW,
  MULTI_SELECT,
}
interface SelectContextType {
  addImageToSelection: (i: { id: string }) => void
  removeImageFromSelection: (i: { id: string }) => void
  clearSelection: () => void
  isImageSelected: (i: { id: string }) => boolean
  selectedImages: Image[]
  selectMode: SelectMode
  setSelectMode: (sm: SelectMode) => void
  setAllSelected: (b: boolean) => void
  allSelected: boolean
  isSelectionActive: boolean
}

export const SelectContext = React.createContext<SelectContextType>({
  addImageToSelection: (i: Image) => 0,
  removeImageFromSelection: (i: Image) => 0,
  clearSelection: () => 0,
  isImageSelected: () => false,
  selectedImages: [],
  selectMode: SelectMode.VIEW,
  setSelectMode: (sm: SelectMode) => 0,
  setAllSelected: (b: boolean) => 0,
  allSelected: false,
  isSelectionActive: false,
})

export const SelectContextProvider = ({ children }) => {
  const [allSelected, setAllSelected] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [selectMode, setSelectMode] = useState<SelectMode>(SelectMode.VIEW)
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
        selectMode,
        setSelectMode,
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
