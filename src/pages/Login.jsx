import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const validationSchema = Yup.object({
    username: Yup.string()
        .trim()
        .required('Username tidak boleh kosong.'),
});

function Login() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:5000/login', {
                    username: values.username,
                });

                if (response.data.status === 'success') {
                    const token = response.data.data.token;

                    sessionStorage.setItem('authToken', token);

                    toast.success(response.data.message);

                    navigate('/appointment');
                } else {
                    toast.error(response.data.message || 'Login gagal.');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Terjadi kesalahan. Coba lagi nanti.';
                toast.error(errorMessage);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
            >
                <h1 className="text-3xl font-semibold mb-6 text-center text-green-600">Login</h1>

                {formik.errors.username && formik.touched.username && (
                    <p className="text-red-500 text-sm mb-4">{formik.errors.username}</p>
                )}

                <div className="mb-6">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 ${formik.touched.username && formik.errors.username
                            ? 'border-red-500'
                            : 'border-gray-300'
                            }`}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 w-full"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
