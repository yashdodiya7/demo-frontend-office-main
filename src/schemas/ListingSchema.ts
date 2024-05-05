import * as Yup from 'yup';

export const PostCreationSchema = Yup.object().shape({
    property_type: Yup.string().required('Property type is required'),
    lease_term: Yup.string()
    .required('Lease term is required')
    .matches(/^\d{1,2}$/, 'Lease term must be a number with maximum two digits'),
    approx_rent: Yup.string().required('Approximate rent is required'),
    pet_policy: Yup.string().required('Pet policy is required'),
    smoking_policy: Yup.string().required('Smoking policy is required'),
    occupancy: Yup.string().required('Occupancy is required'),
    looking_for: Yup.string().required('Looking for is required'),
    description: Yup.string().required('Description is required'),
    max_vacancy: Yup.number().max(6, 'You can add a maximum of 6 vacancies').required('Max Vacancy is required'),
});

export const PostUpdationSchema = Yup.object().shape({
    property_type: Yup.string().required('Property type is required'),
    lease_term: Yup.string()
    .required('Lease term is required')
    .matches(/^\d{1,2}$/, 'Lease term must be a number with maximum two digits'),
    approx_rent: Yup.string().required('Approximate rent is required'),
    pet_policy: Yup.string().required('Pet policy is required'),
    smoking_policy: Yup.string().required('Smoking policy is required'),
    occupancy: Yup.string().required('Occupancy is required'),
    looking_for: Yup.string().required('Looking for is required'),
    description: Yup.string().required('Description is required'),
    max_vacancy: Yup.number().max(6, 'You can add a maximum of 6 vacancies').required('Max Vacancy is required'),
});

// export  {PostCreationSchema, PostUpdationSchema};