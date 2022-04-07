https://github.com/awesome-selfhosted/awesome-selfhosted/blob/master/README.md#photo-and-video-galleries

### TODO

:: Important
- auth S3/image function
- hidden
- public

:: necessary but not urgent
- detect people
- download zip of filter (hash filter)
- load infinite scroll from /photos/{photoId} position

:: optional
- Create tag from metadata
- duplicate category
- Refacto ApplyTags like deleteManyImages

:: ??

- Edit date
- upload images
- sync db to image metadata (and test reverse)
- select range
- tag colors

### BUGS

add tag to filter > remove tag, tag still in filter so no images ?

Select 2 images, apply tag, filter with this tag, unapply tags to images => images still in selection (if I apply they will reappear)
choose filter => select image => remove filter >>> image still into selectio n

image page => gallery >>> should go on image

tags in selected filters and on image edit tags

scroll, when add tag it moves back to top
