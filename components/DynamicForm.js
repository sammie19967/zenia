import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdForm() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    brand: '',
    images: [],
    location: { county: '', subcounty: '' },
    video: '',
    customFields: {},
  });

  useEffect(() => {
    // Fetch categories
    axios.get('/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Fetch subcategories based on selected category
      axios.get(`/api/categories/${selectedCategory}/subcategories`)
        .then(response => {
          setSubcategories(response.data);
        })
        .catch(error => console.error('Error fetching subcategories:', error));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubcategory) {
      // Fetch brands based on selected subcategory
      axios.get(`/api/subcategories/${selectedSubcategory}/brands`)
        .then(response => {
          setBrands(response.data);
        })
        .catch(error => console.error('Error fetching brands:', error));
    }
  }, [selectedSubcategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory('');
    setAdData({ ...adData, brand: '', customFields: {} });
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
    // Fetch custom fields based on the subcategory
    axios.get(`/api/subcategories/${event.target.value}/customFields`)
      .then(response => {
        setAdData(prevData => ({
          ...prevData,
          customFields: response.data,
        }));
      })
      .catch(error => console.error('Error fetching custom fields:', error));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCustomFieldChange = (name, value) => {
    setAdData(prevData => ({
      ...prevData,
      customFields: { ...prevData.customFields, [name]: value },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = {
        ...adData,
        category: selectedCategory,
        subcategory: selectedSubcategory,
      };
      const response = await axios.post('/api/ads', formData);
      console.log('Ad created:', response.data);
    } catch (error) {
      console.error('Error creating ad:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Category</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div>
          <label>Subcategory</label>
          <select value={selectedSubcategory} onChange={handleSubcategoryChange}>
            <option value="">Select Subcategory</option>
            {subcategories.map(subcategory => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubcategory && (
        <div>
          <label>Brand</label>
          <select name="brand" value={adData.brand} onChange={handleInputChange} required>
            <option value="">Select Brand</option>
            {brands.map(brand => (
              <option key={brand._id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label>Title</label>
        <input type="text" name="title" value={adData.title} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Description</label>
        <textarea name="description" value={adData.description} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Location</label>
        <input
          type="text"
          name="location[county]"
          value={adData.location.county}
          onChange={handleInputChange}
          placeholder="County"
          required
        />
        <input
          type="text"
          name="location[subcounty]"
          value={adData.location.subcounty}
          onChange={handleInputChange}
          placeholder="Subcounty"
          required
        />
      </div>

      {/* Custom fields rendering dynamically */}
      {Object.keys(adData.customFields).map(field => (
        <div key={field}>
          <label>{adData.customFields[field].label}</label>
          <input
            type="text"
            value={adData.customFields[field] || ''}
            onChange={(e) => handleCustomFieldChange(field, e.target.value)}
            required
          />
        </div>
      ))}

      <div>
        <label>Images</label>
        <input type="file" multiple onChange={(e) => setAdData({ ...adData, images: e.target.files })} />
      </div>

      <div>
        <label>Video (optional)</label>
        <input
          type="url"
          name="video"
          value={adData.video}
          onChange={handleInputChange}
          placeholder="Video URL"
        />
      </div>

      <button type="submit">Create Ad</button>
    </form>
  );
}

export default AdForm;
