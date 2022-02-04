import type { Image } from 'types/graphql'
import { useContext, useState, useCallback } from 'react'

export enum SelectMode {
  VIEW,
  MULTI_SELECT,
}
interface SelectContextType {
  addImageToSelection: (i: Image) => void
  removeImageFromSelection: (i: Image) => void
  clearSelection: () => void
  selectedImages: Image[]
  selectMode: SelectMode
  setSelectMode: (sm: SelectMode) => void
}

export const SelectContext = React.createContext<SelectContextType>({
  addImageToSelection: (i: Image) => 0,
  removeImageFromSelection: (i: Image) => 0,
  clearSelection: () => 0,
  selectedImages: [],
  selectMode: SelectMode.VIEW,
  setSelectMode: (sm: SelectMode) => 0,
})

export const SelectContextProvider = ({ children }) => {
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [selectMode, setSelectMode] = useState<SelectMode>(SelectMode.VIEW)

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
  }, [])

  return (
    <SelectContext.Provider
      value={{
        addImageToSelection,
        removeImageFromSelection,
        clearSelection,
        selectedImages,
        selectMode,
        setSelectMode,
      }}
    >
      {children}
    </SelectContext.Provider>
  )
}

export const useSelectContext = () => useContext(SelectContext)
