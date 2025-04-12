'use client';
import { useEffect, useState } from 'react';
import { Upload, X, Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import '@/styles/DynamicForm.css';

export default function DynamicForm() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    negotiable: '',
    sellerName: '',
    phoneNumber: '',
    email: '',
    categoryId: '',
    subcategoryId: '',
    brandId: '',
    countyId: '',
    subcountyId: '',
    package: 'Free Ad',
  });

  // Data options
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  
  // Image handling
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form flow
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info',
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, countiesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/counties')
        ]);
        
        setCategories(await categoriesRes.json());
        setCounties(await countiesRes.json());
      } catch (error) {
        showErrorModal('Initialization Error', 'Failed to load form data. Please refresh the page.');
      }
    };
    
    fetchData();
  }, []);

  // Fetch subcategories and brands when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const fetchSubData = async () => {
        try {
          const [subRes, brandsRes] = await Promise.all([
            fetch(`/api/subcategories?categoryId=${formData.categoryId}`),
            fetch(`/api/brands?categoryId=${formData.categoryId}`)
          ]);
          
          setSubcategories(await subRes.json());
          setBrands(await brandsRes.json());
        } catch (error) {
          showErrorModal('Data Error', 'Failed to load category details.');
        }
      };
      
      fetchSubData();
    } else {
      setSubcategories([]);
      setBrands([]);
    }
  }, [formData.categoryId]);

  // Fetch subcounties when county changes
  useEffect(() => {
    if (formData.countyId) {
      fetch(`/api/subcounties?countyId=${formData.countyId}`)
        .then(res => res.json())
        .then(setSubcounties)
        .catch(() => showErrorModal('Data Error', 'Failed to load location details.'));
    } else {
      setSubcounties([]);
    }
  }, [formData.countyId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      showErrorModal('Upload Error', 'Maximum 5 images allowed.');
      e.target.value = null;
      return;
    }
    
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showErrorModal('Upload Error', `Some files exceed 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      e.target.value = null;
      return;
    }
    
    const fileArray = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages(fileArray);
  };

  const removeImage = index => {
    URL.revokeObjectURL(images[index].preview);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (images.length === 0) return [];
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      images.forEach(img => formData.append('images', img.file));
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      images.forEach(img => URL.revokeObjectURL(img.preview));
      
      return data.urls || [];
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const showErrorModal = (title, message) => {
    setModalContent({
      title,
      message,
      type: 'error'
    });
    setShowModal(true);
  };

  const showSuccessModal = (title, message) => {
    setModalContent({
      title,
      message,
      type: 'success'
    });
    setShowModal(true);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.description || !formData.price) {
          showErrorModal('Missing Information', 'Please fill in all basic information fields.');
          return false;
        }
        return true;
      case 2:
        if (!formData.condition || !formData.negotiable) {
          showErrorModal('Missing Information', 'Please specify condition and negotiability.');
          return false;
        }
        return true;
      case 3:
        if (!formData.sellerName || !formData.phoneNumber || !formData.email) {
          showErrorModal('Missing Information', 'Please fill in all seller information fields.');
          return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          showErrorModal('Invalid Email', 'Please enter a valid email address.');
          return false;
        }
        return true;
      case 4:
        if (!formData.categoryId || !formData.countyId) {
          showErrorModal('Missing Information', 'Please select at least a category and county.');
          return false;
        }
        return true;
      case 5:
        if (images.length === 0) {
          showErrorModal('Missing Images', 'Please upload at least one image for your ad.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateStep(5)) return;
    
    try {
      setIsUploading(true);
      
      const imageUrls = await uploadImages();
      
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, images: imageUrls })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }
      
      setFormData({
        title: '',
        description: '',
        price: '',
        condition: '',
        negotiable: '',
        sellerName: '',
        phoneNumber: '',
        email: '',
        categoryId: '',
        subcategoryId: '',
        brandId: '',
        countyId: '',
        subcountyId: '',
        package: 'Free Ad',
      });
      setImages([]);
      setCurrentStep(1);
      
      showSuccessModal('Success!', 'Your ad has been posted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      showErrorModal('Submission Failed', error.message || 'Failed to post your ad. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Create New Listing</h1>
        <p>Fill out the form below to list your item for sale</p>
      </div>
      
      <div className="form-steps">
        {[1, 2, 3, 4, 5].map(step => (
          <div 
            key={step}
            className={`step ${currentStep > step ? 'completed' : ''} ${currentStep === step ? 'active' : ''}`}
          >
            <div className="step-number">
              {currentStep > step ? <Check size={16} /> : step}
            </div>
            <span className="step-label">
              {['Basic Info', 'Details', 'Contact', 'Category', 'Images'][step - 1]}
            </span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="form-section">
            <div className="section-header">
              <h2>Basic Information</h2>
              <p>Tell us about the item you're selling</p>
            </div>
            
            <div className="form-group">
              <label className="required">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Samsung Galaxy S21 Ultra"
                maxLength={100}
              />
            </div>
            
            <div className="form-group">
              <label className="required">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Provide detailed description of your item"
                maxLength={1000}
              />
            </div>
            
            <div className="form-group">
              <label className="required">Price (KSh)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter price"
                min="0"
                step="100"
              />
            </div>
          </div>
        )}
        
        {/* Step 2: Item Details */}
        {currentStep === 2 && (
          <div className="form-section">
            <div className="section-header">
              <h2>Item Details</h2>
              <p>Specify the condition and negotiability</p>
            </div>
            
            <div className="form-group">
              <label className="required">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="required">Negotiable</label>
              <select
                name="negotiable"
                value={formData.negotiable}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Slightly">Slightly negotiable</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Step 3: Contact Information */}
        {currentStep === 3 && (
          <div className="form-section">
            <div className="section-header">
              <h2>Contact Information</h2>
              <p>How buyers can reach you</p>
            </div>
            
            <div className="form-group">
              <label className="required">Your Name</label>
              <input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                className="form-control"
                placeholder="Your full name"
              />
            </div>
            
            <div className="form-group">
              <label className="required">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="form-control"
                placeholder="Phone number"
              />
            </div>
            
            <div className="form-group">
              <label className="required">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Your email address"
              />
            </div>
          </div>
        )}
        
        {/* Step 4: Category & Location */}
        {currentStep === 4 && (
          <div className="form-section">
            <div className="section-header">
              <h2>Category & Location</h2>
              <p>Help buyers find your item</p>
            </div>
            
            <div className="form-group">
              <label className="required">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Subcategory</label>
              <select
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleChange}
                className="form-control"
                disabled={!subcategories.length}
              >
                <option value="">{subcategories.length ? "Select subcategory" : "No subcategories available"}</option>
                {subcategories.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Brand</label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                className="form-control"
                disabled={!brands.length}
              >
                <option value="">{brands.length ? "Select brand" : "No brands available"}</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="required">County</label>
              <select
                name="countyId"
                value={formData.countyId}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select county</option>
                {counties.map(county => (
                  <option key={county._id} value={county._id}>{county.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Subcounty</label>
              <select
                name="subcountyId"
                value={formData.subcountyId}
                onChange={handleChange}
                className="form-control"
                disabled={!subcounties.length}
              >
                <option value="">{subcounties.length ? "Select subcounty" : "No subcounties available"}</option>
                {subcounties.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* Step 5: Images & Package */}
        {currentStep === 5 && (
          <div className="form-section">
            <div className="section-header">
              <h2>Images & Package</h2>
              <p>Add photos and select your ad package</p>
            </div>
            
            <div className="form-group">
              <label className="required">Images</label>
              <div className="file-upload">
                <label className="file-upload-label">
                  <Upload className="file-upload-icon" />
                  <span className="file-upload-text">Click to upload or drag and drop</span>
                  <span className="file-upload-hint">JPG, PNG (Max 5MB each)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="image-previews">
                  {images.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={img.preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Package</label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Free Ad">Free Ad</option>
                <option value="Class">Class - 10 Ksh / Day</option>
                <option value="Prime">Prime - 40 Ksh / Day</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Form Navigation */}
        <div className="form-actions">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={prevStep}
              disabled={isUploading}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          
          {currentStep < 5 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={nextStep}
              disabled={isUploading}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Processing...
                </>
              ) : (
                'Submit Ad'
              )}
            </button>
          )}
        </div>
      </form>
      
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">{modalContent.title}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>{modalContent.message}</p>
            </div>
            <div className="modal-footer">
              <button
                className={`btn ${modalContent.type === 'error' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => setShowModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}