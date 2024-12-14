import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import moment from 'moment';
import 'flatpickr/dist/themes/material_green.css';

function Appointment() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        title: '',
        start: '',
        end: '',
        invitedUsers: [],
    });
    const [users, setUsers] = useState([]);

    const fetchAppointments = async () => {
        try {
            const token = sessionStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5000/appointments', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                setAppointments(response.data.data);
            } else {
                toast.error(response.data.message || 'Gagal mengambil janji temu.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan. Coba lagi nanti.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = sessionStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5000/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const usersData = response.data.data.map((user) => ({
                value: user.id,
                label: user.username,
            }));

            setUsers(usersData);
        } catch (error) {
            toast.error('Gagal mengambil daftar pengguna.');
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('authToken');

            const formattedStart = moment(newAppointment.start).format('YYYY-MM-DD HH:mm');
            const formattedEnd = moment(newAppointment.end).format('YYYY-MM-DD HH:mm');

            const appointmentToCreate = {
                ...newAppointment,
                start: formattedStart,
                end: formattedEnd,
            };

            const response = await axios.post('http://localhost:5000/appointments', appointmentToCreate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                toast.success(response.data.message);
                fetchAppointments();
                setAppointments((prev) => [...prev, response.data.data]);
                setNewAppointment({
                    title: '',
                    start: '',
                    end: '',
                    invitedUsers: [],
                })
                setIsModalOpen(false);
            } else {
                toast.error(response.data.message || 'Gagal membuat janji temu.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan. Coba lagi nanti.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-green-500 mb-6">Welcome to Appointment Page!</h1>

            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 text-white py-2 px-4 rounded mb-6 hover:bg-green-600"
            >
                Create Appointment
            </button>

            {loading ? (
                <p className="text-lg text-gray-700">Loading appointments...</p>
            ) : (
                <div className="w-full max-w-4xl px-4">
                    {appointments.length === 0 ? (
                        <p className="text-lg text-gray-700">No appointments found.</p>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                                >
                                    <h2 className="text-xl font-semibold text-green-600">{appointment.title}</h2>
                                    <p className="text-gray-700">Start: {appointment.start}</p>
                                    <p className="text-gray-700">End: {appointment.end}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold text-green-500 mb-4">Create Appointment</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newAppointment.title}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded border-gray-300"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="start" className="block text-sm font-medium">
                                    Start Time
                                </label>
                                <Flatpickr
                                    value={newAppointment.start}
                                    onChange={(date) => setNewAppointment({ ...newAppointment, start: date[0] })}
                                    className="mt-1 p-2 w-full border rounded border-gray-300"
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        time_24hr: true
                                    }}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="end" className="block text-sm font-medium">
                                    End Time
                                </label>
                                <Flatpickr
                                    value={newAppointment.end}
                                    onChange={(date) => setNewAppointment({ ...newAppointment, end: date[0] })}
                                    className="mt-1 p-2 w-full border rounded border-gray-300"
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        time_24hr: true
                                    }}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="invitedUsers" className="block text-sm font-medium">
                                    Invited Users
                                </label>
                                <Select
                                    isMulti
                                    options={users}
                                    value={newAppointment.invitedUsers.map((id) => users.find((user) => user.value === id))}
                                    onChange={(selected) => setNewAppointment({
                                        ...newAppointment,
                                        invitedUsers: selected.map((user) => user.value),
                                    })}
                                    className="mt-1 w-full"
                                    placeholder="Select users"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white py-2 px-4 rounded"
                                >
                                    Create Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Appointment;
