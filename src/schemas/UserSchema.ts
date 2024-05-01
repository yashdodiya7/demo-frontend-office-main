import * as yup from 'yup'

const registerSchema = yup.object().shape({
	name: yup.string().required('Please Enter your name'),
	email: yup.string()
		.email('Invalid email address format')
		.required('Please Enter your email'),
	gender: yup.string()
	.required('Please select your gender')
	.oneOf(['male', 'female'], 'Invalid gender selection'),
	password: yup.string()
		.required('Please Enter your password')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
			'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
		),
	password2: yup.string()
		.oneOf([yup.ref('password')], 'Passwords must match')
		.required('Please Enter your Confirm password'),
	age: yup.number()
        .required('Please Enter your age')
        .positive('Age must be a positive number')
        .integer('Age must be an integer')
		.max(100, 'Age can not be greater than 100')
        .min(18, 'You must be at least 18 years old'),
})

const loginValidation = yup.object().shape({
	email: yup.string()
		.email('Invalid email address format')
		.required('Please Enter your email'),
	password: yup.string().required('Please Enter your password'),
})

// const PHONE_REGEX = "^\+?91\d{10}$"

const phoneVerifySchema = yup.object().shape({
	phone_no: yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number should be in 6353355512 format'),
})

const otpVerifySchema = yup.object().shape({
	otp: yup.string()
    .required('OTP is required')
    .length(4, 'OTP must be 4 digits long')
    .matches(/^\d+$/, 'OTP must contain only digits'),
})

const updateUser = yup.object().shape({
	name: yup.string()
        .required('Name is required'),
    email: yup.string()
        .email('Invalid email')
        .required('Email is required'),
    gender: yup.string()
        .required('Gender is required'),
    occupation: yup.string()
        .required('Occupation is required'),
    age: yup.number()
        .typeError('Age must be a number')
        .required('Age is required')
        .positive('Age must be a positive number')
        .integer('Age must be an integer'),
})

export { registerSchema, loginValidation, updateUser, phoneVerifySchema, otpVerifySchema }