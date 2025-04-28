"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImageUpload from "@/components/ImageUpload";

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
        console.log("Categories response:", response.data); 
        setCategories(response.data.data);  // <-- NOTICE .data here
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
        contactInfo: {
          phone,
          email,
          whatsapp: whatsapp || undefined,
        },
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

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Create New Ad</h1>

      <form onSubmit={handleSubmit}>
        {/* Basic Ad Information */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Basic Information</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>Ad Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <label>Price (KSH) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
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
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Category Information</h2>
          <div style={{ marginBottom: "10px" }}>
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
          <div style={{ marginBottom: "10px" }}>
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
            <div style={{ marginBottom: "10px" }}>
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
          <section style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Extra Details</h2>
            {Object.keys(availableCustomFields).map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={customFields[field] || ""}
                onChange={(e) => handleCustomFieldChange(field, e.target.value)}
                style={{
                  width: "30%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  gap: "10px",
                }}
              />
            ))}
          </section>
        )}

        {/* Location Information */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Location</h2>
          <div style={{ marginBottom: "10px" }}>
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
          <div style={{ marginBottom: "10px" }}>
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
          <div style={{ marginBottom: "10px" }}>
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
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Images</h2>
          <ImageUpload images={images} setImages={setImages} maxImages={8} />
        </div>

        {/* Contact Information */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Contact Information</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>WhatsApp Number (optional)</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "right" }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              backgroundColor: submitting ? "#ccc" : "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Post Ad"}
          </button>
        </div>
      </form>
    </div>
  );
}