import * as yup from "yup"

export const validationSchema = yup.object({
    name : yup.string().required(),
    brand : yup.string().required(),
    type : yup.string().required(),
    price : yup.number().required().moreThan(100),
    quantityInStock : yup.number().required().min(0).max(200),
    description : yup.string().required(),
    file: yup.mixed().when('pictureUrl', {
        is: (value:string) => !value,
        then: (validationSchema) => validationSchema.required('Please upload a picture'),
        otherwise: (schema) => schema.notRequired()
      })
      
})