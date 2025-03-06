import React, { useState } from "react";
import axios from "axios";
import "./AdoptTree.css";

const AdoptTree = () => {
  const [formData, setFormData] = useState({
    treeName: "",
    description: "",
    category: "individual",
    contact: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          location: `${position.coords.latitude}, ${position.coords.longitude}`,
        });
      },
      (error) => alert("Location access denied!")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      await axios.post("http://localhost:3000/api/trees/adopt", data);
      alert("Tree Adoption Request Submitted!");
    } catch (err) {
      alert("Error submitting form.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Adopt a Tree</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="treeName"
          placeholder="Tree Name"
          className="w-full p-2 border rounded mb-3"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Describe your motive"
          className="w-full p-2 border rounded mb-3"
          onChange={handleChange}
          required
        ></textarea>
        <select
          name="category"
          className="w-full p-2 border rounded mb-3"
          onChange={handleChange}
        >
          <option value="individual">Individual</option>
          <option value="organization">Organization</option>
        </select>
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          className="w-full p-2 border rounded mb-3"
          onChange={handleChange}
          required
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-3"
          onClick={fetchLocation}
        >
          Fetch Current Location
        </button>
        <input
          type="text"
          name="location"
          placeholder="Location (Auto-filled)"
          className="w-full p-2 border rounded mb-3"
          value={formData.location}
          readOnly
        />
        <input
          type="file"
          name="image"
          className="w-full p-2 border rounded mb-3"
          onChange={handleFileChange}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdoptTree;
