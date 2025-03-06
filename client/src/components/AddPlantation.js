// client/src/components/AddPlantation.jsx
import React from 'react';
import PlantationForm from './PlantationForm';
import './AddPlantation.css';

function AddPlantation() {
  return (
    <div className="add-plantation-container container my-5">
      <h2 className="text-success mb-4 text-center">Add a New Plantation</h2>
      <div className="form-wrapper">
        <PlantationForm setPlantations={() => {}} />
      </div>
    </div>
  );
}

export default AddPlantation;