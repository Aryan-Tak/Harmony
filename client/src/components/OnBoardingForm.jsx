import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function OnboardingForm({ code }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    bio: '',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      if (file) {
        setPhotoPreview(URL.createObjectURL(file));
        setFormData({
          ...formData,
          [name]: file,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`http://localhost:5174/onboarding?{code}`);
      const spotifyId = data.id;
      const userData = new FormData();
      userData.append('firstName', formData.firstName);
      userData.append('lastName', formData.lastName);
      userData.append('dob', formData.dob);
      userData.append('gender', formData.gender);
      userData.append('bio', formData.bio);
      userData.append('spotifyId', spotifyId);
      userData.append('photo', formData.photo);

      await axios.post('http://localhost:5174/onboarding', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      console.log('Error in Account Creation Form', error);
    }
    
    console.log(formData);
  };

  return (
    
    <div className="flex justify-center items-center min-h-screen bg-[#ffc564] p-6">
      <div>{code}</div>
      <form
        className="bg-[#ffffffc8] p-6 rounded-lg shadow-lg w-full max-w-4xl neumorphism"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Welcome to Harmony!</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-4 neumorphism-input">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border-none rounded neumorphism-input"
                required
              />
            </div>
            <div className="mb-4 neumorphism-input">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border-none rounded neumorphism-input"
                required
              />
            </div>
            <div className="mb-4 neumorphism-input">
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 p-2 w-full border-none rounded neumorphism-input"
                required
              />
            </div>
            <div className="mb-4 neumorphism-input">
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 p-2 w-full border-none rounded neumorphism-input"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="mb-4 neumorphism-input">
              <label className="block text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 p-2 w-full border-none rounded neumorphism-input"
                required
              ></textarea>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 neumorphism-input">
              <label className="block text-gray-700">Photo</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 p-2 w-full border-none rounded neumorphism-input"
                required
              />
            </div>
            {photoPreview && (
              <div className="mb-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white hover:bg-white hover:text-blue-500 rounded font-bold neumorphism-input"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default OnboardingForm;
