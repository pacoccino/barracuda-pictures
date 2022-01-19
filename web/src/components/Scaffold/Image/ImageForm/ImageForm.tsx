import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

const ImageForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.image?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="path"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Path
        </Label>
        <TextField
          name="path"
          defaultValue={props.image?.path}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="path" className="rw-field-error" />

        <Label
          name="dateTaken"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Date taken
        </Label>
        <DatetimeLocalField
          name="dateTaken"
          defaultValue={formatDatetime(props.image?.dateTaken)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="dateTaken" className="rw-field-error" />

        <Label
          name="dateEdited"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Date edited
        </Label>
        <DatetimeLocalField
          name="dateEdited"
          defaultValue={formatDatetime(props.image?.dateEdited)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="dateEdited" className="rw-field-error" />

        <Label
          name="metadataJson"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Metadata json
        </Label>
        <TextField
          name="metadataJson"
          defaultValue={props.image?.metadataJson}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="metadataJson" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ImageForm
