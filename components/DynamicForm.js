"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImageUpload from "@/components/ImageUpload";
import { useSession } from "next-auth/react";

export default function CreateAdForm() {
  const router = useRouter();

  // States for form data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [customFields, setCustomFields] = useState({});
  const [county, setCounty] = useState("");
  const [subcounty, setSubcounty] = useState("");
  const [town, setTown] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [images, setImages] = useState([]);
  const [paymentPlan, setPaymentPlan] = useState("Free Ad");

  // States for dropdown options
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [towns, setTowns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [availableCustomFields, setAvailableCustomFields] = useState({});

  // State for submission
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  // Get NextAuth session
  const { data: session, status } = useSession();
  
  // Check user authentication and prefill data
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser(session.user);
      
      // Fetch extended user data from your database to get phone number
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${session.user.id}`);
          const userData = response.data;
          
          // Pre-fill email from session
          if (session.user.email) {
            setEmail(session.user.email);
          }
          
          // Pre-fill phone if available from extended user data
          if (userData?.phoneNumber) {
            setPhone(userData.phoneNumber);
            // If WhatsApp isn't set and user has phone, pre-fill it too
            if (!whatsapp) {
              setWhatsapp(userData.phoneNumber);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Still set email from session even if extended data fetch fails
          if (session.user.email) {
            setEmail(session.user.email);
          }
        }
      };
      
      fetchUserData();
    }
  }, [status, session, whatsapp]);

  // Fetch counties data
  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await axios.get("/api/counties");
        setCounties(response.data);
      } catch (error) {
        console.error("Error fetching counties:", error);
        alert("Failed to load location data");
      }
    };

    fetchCounties();
  }, []);

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load category data");
      }
    };

    fetchCategories();
  }, []);

  // Update subcounties when county changes
  useEffect(() => {
    if (county) {
      const selectedCounty = counties.find((c) => c.name === county);
      if (selectedCounty) {
        setSubcounties(selectedCounty.subcounties || []);
        setSubcounty("");
        setTown("");
      }
    } else {
      setSubcounties([]);
      setSubcounty("");
      setTown("");
    }
  }, [county, counties]);

  // Update towns when subcounty changes
  useEffect(() => {
    if (subcounty && subcounties.length > 0) {
      const selectedSubcounty = subcounties.find((sc) => sc.name === subcounty);
      if (selectedSubcounty) {
        setTowns(selectedSubcounty.towns || []);
        setTown("");
      }
    } else {
      setTowns([]);
      setTown("");
    }
  }, [subcounty, subcounties]);

  // Update subcategories when category changes
  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find((c) => c.name === category);
      if (selectedCategory) {
        setSubcategories(selectedCategory.subcategories || []);
        setSubcategory("");
        setBrand("");
        setCustomFields({});
      }
    } else {
      setSubcategories([]);
      setSubcategory("");
      setBrand("");
      setCustomFields({});
    }
  }, [category, categories]);

  // Update brands and custom fields when subcategory changes
  useEffect(() => {
    if (subcategory && subcategories.length > 0) {
      const selectedSubcategory = subcategories.find((sc) => sc.name === subcategory);
      if (selectedSubcategory) {
        setBrands(selectedSubcategory.brands || []);
        setAvailableCustomFields(selectedSubcategory.customFields || {});
        setBrand("");
        setCustomFields({});
      }
    } else {
      setBrands([]);
      setAvailableCustomFields({});
      setBrand("");
      setCustomFields({});
    }
  }, [subcategory, subcategories]);

  // Handle custom field changes
  const handleCustomFieldChange = (fieldName, value) => {
    setCustomFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status !== "authenticated" || !session?.user) {
      alert("You must be logged in to create an ad.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setSubmitting(true);

    try {
      const adData = {
        title,
        description,
        price: parseFloat(price),
        negotiable,
        category,
        subcategory,
        brand: brand || undefined,
        customFields,
        location: {
          county,
          subcounty,
          town,
        },
        images,
        userId: session.user.id, // Using the session user ID
        contactInfo: {
          phone,
          email,
          whatsapp: whatsapp || undefined,
        },
        paymentPlan, // <-- Include paymentPlan here
      };

      const response = await axios.post("/api/ads", adData);

      alert("Ad created successfully!");
      router.push(`/ads/${response.data.ad._id}`);
    } catch (error) {
      console.error("Error creating ad:", error);
      alert("Failed to create ad");
    } finally {
      setSubmitting(false);
    }
  };

  // Determine the appropriate input type for each custom field
  const renderCustomFieldInput = (fieldName, options) => {
    // If options is an array, render a select dropdown
    if (Array.isArray(options)) {
      return (
        <div key={fieldName} style={{ marginBottom: "15px" }}>
          <label>{fieldName}</label>
          <select
            value={customFields[fieldName] || ""}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          >
            <option value="">Select {fieldName}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }
    
    // If options is an object with type property
    if (options && typeof options === 'object' && options.type) {
      switch (options.type) {
        case 'number':
          return (
            <div key={fieldName} style={{ marginBottom: "15px" }}>
              <label>{fieldName}</label>
              <input
                type="number"
                value={customFields[fieldName] || ""}
                min={options.min || 0}
                max={options.max || undefined}
                step={options.step || 1}
                onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
                placeholder={`Enter ${fieldName}`}
              />
            </div>
          );
          
        case 'boolean':
          return (
            <div key={fieldName} style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                id={`custom-${fieldName}`}
                checked={!!customFields[fieldName]}
                onChange={(e) => handleCustomFieldChange(fieldName, e.target.checked)}
              />
              <label htmlFor={`custom-${fieldName}`} style={{ marginLeft: "5px" }}>
                {fieldName}
              </label>
            </div>
          );
          
        case 'date':
          return (
            <div key={fieldName} style={{ marginBottom: "15px" }}>
              <label>{fieldName}</label>
              <input
                type="date"
                value={customFields[fieldName] || ""}
                onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              />
            </div>
          );
      }
    }
    
    // Default: text input
    return (
      <div key={fieldName} style={{ marginBottom: "15px" }}>
        <label>{fieldName}</label>
        <input
          type="text"
          value={customFields[fieldName] || ""}
          onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
          style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          placeholder={`Enter ${fieldName}`}
        />
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Create New Ad</h1>
      
      {!user && (
        <div style={{ 
          backgroundColor: "#fff3cd", 
          color: "#856404", 
          padding: "12px", 
          borderRadius: "5px", 
          marginBottom: "20px",
          border: "1px solid #ffeeba"
        }}>
          <p>You need to be logged in to post an ad. Please log in or sign up first.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Ad Information */}
        <div style={{ 
          marginBottom: "20px", 
          backgroundColor: "#fff", 
          padding: "20px", 
          borderRadius: "8px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Basic Information</h2>
          <div style={{ marginBottom: "15px" }}>
            <label>Ad Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              placeholder="Enter a catchy title for your ad"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              placeholder="Provide detailed description of what you're selling"
            />
          </div>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "150px" }}>
              <label>Price (KSH) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
                placeholder="Enter price"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "25px" }}>
              <input
                type="checkbox"
                id="negotiable"
                checked={negotiable}
                onChange={(e) => setNegotiable(e.target.checked)}
              />
              <label htmlFor="negotiable" style={{ marginLeft: "5px" }}>
                Price is negotiable
              </label>
            </div>
          </div>
        </div>

        {/* Category Information */}
        <div style={{ 
          marginBottom: "20px", 
          backgroundColor: "#fff", 
          padding: "20px", 
          borderRadius: "8px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Category Information</h2>
          <div style={{ marginBottom: "15px" }}>
            <label>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Subcategory *</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
              disabled={!category}
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((subcat) => (
                <option key={subcat._id} value={subcat.name}>
                  {subcat.name}
                </option>
              ))}
            </select>
          </div>
          {brands.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <label>Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              >
                <option value="">Select Brand</option>
                {brands.map((brandName) => (
                  <option key={brandName} value={brandName}>
                    {brandName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Custom Fields */}
        {availableCustomFields && Object.keys(availableCustomFields).length > 0 && (
          <div style={{ 
            marginBottom: "20px", 
            backgroundColor: "#fff", 
            padding: "20px", 
            borderRadius: "8px", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Extra Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              {Object.entries(availableCustomFields).map(([fieldName, options]) => 
                renderCustomFieldInput(fieldName, options)
              )}
            </div>
          </div>
        )}

        {/* Location Information */}
        <div style={{ 
          marginBottom: "20px", 
          backgroundColor: "#fff", 
          padding: "20px", 
          borderRadius: "8px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Location</h2>
          <div style={{ marginBottom: "15px" }}>
            <label>County *</label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            >
              <option value="">Select County</option>
              {counties.map((countyItem) => (
                <option key={countyItem._id} value={countyItem.name}>
                  {countyItem.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Subcounty *</label>
            <select
              value={subcounty}
              onChange={(e) => setSubcounty(e.target.value)}
              required
              disabled={!county}
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            >
              <option value="">Select Subcounty</option>
              {subcounties.map((subcountyItem) => (
                <option key={subcountyItem.name} value={subcountyItem.name}>
                  {subcountyItem.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Town *</label>
            <select
              value={town}
              onChange={(e) => setTown(e.target.value)}
              required
              disabled={!subcounty}
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            >
              <option value="">Select Town</option>
              {towns.map((townName) => (
                <option key={townName} value={townName}>
                  {townName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Images */}
        <div style={{ 
          marginBottom: "20px", 
          backgroundColor: "#fff", 
          padding: "20px", 
          borderRadius: "8px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Images</h2>
          <p style={{ marginBottom: "10px" }}>Upload at least one image of your item (max 8)</p>
          <ImageUpload images={images} setImages={setImages} maxImages={8} />
        </div>

        {/* Contact Information */}
        <div style={{ 
          marginBottom: "20px", 
          backgroundColor: "#fff", 
          padding: "20px", 
          borderRadius: "8px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Contact Information</h2>
          <div style={{ marginBottom: "15px" }}>
            <label>Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              placeholder="e.g., 0712 345 678"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              placeholder="your@email.com"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>WhatsApp Number (optional)</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              placeholder="e.g., 0712 345 678"
            />
          </div>
        </div>

        {/* Payment Plan */}
        <div style={{ 
          marginBottom: "20px", 
          backgroundColor: "#fff", 
          padding: "20px", 
          borderRadius: "8px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Payment Plan</h2>
          <div style={{ marginBottom: "15px" }}>
            <label>Choose a payment plan *</label>
            <select
              value={paymentPlan}
              onChange={(e) => setPaymentPlan(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            >
              <option value="Free Ad">Free Ad</option>
              <option value="Premium Ad">Premium Ad</option>
              <option value="Featured Ad">Featured Ad</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "right" }}>
          <button
            type="submit"
            disabled={submitting || !user}
            style={{
              backgroundColor: submitting || !user ? "#ccc" : "#007bff",
              color: "white",
              padding: "12px 25px",
              border: "none",
              borderRadius: "5px",
              cursor: submitting || !user ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {submitting ? "Submitting..." : "Post Ad"}
          </button>
        </div>
      </form>
    </div>
  );
}