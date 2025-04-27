"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import ImageUpload from "@/components/ImageUpload"; // You'll need to create this component

export default function CreateAdForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";

  // States for form data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [county, setCounty] = useState("");
  const [subcounty, setSubcounty] = useState("");
  const [town, setTown] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // States for dropdown options
  const [counties, setCounties] = useState<any[]>([]);
  const [subcounties, setSubcounties] = useState<any[]>([]);
  const [towns, setTowns] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [availableCustomFields, setAvailableCustomFields] = useState<any>({});

  // State for submission
  const [submitting, setSubmitting] = useState(false);

  // Fetch user data when session is available
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  // Fetch counties data
  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await axios.get("/api/locations/counties");
        setCounties(response.data);
      } catch (error) {
        console.error("Error fetching counties:", error);
        toast.error("Failed to load location data");
      }
    };

    fetchCounties();
  }, []);

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load category data");
      }
    };

    fetchCategories();
  }, []);

  // Update subcounties when county changes
  useEffect(() => {
    if (county) {
      const selectedCounty = counties.find(c => c.name === county);
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
      const selectedSubcounty = subcounties.find(sc => sc.name === subcounty);
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
      const selectedCategory = categories.find(c => c.name === category);
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
      const selectedSubcategory = subcategories.find(sc => sc.name === subcategory);
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
  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setCustomFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("You must be logged in to post an ad");
      return;
    }
    
    if (images.length === 0) {
      toast.error("Please upload at least one image");
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
          town
        },
        images,
        contactInfo: {
          phone,
          email,
          whatsapp: whatsapp || undefined
        }
      };
      
      const response = await axios.post("/api/ads", adData);
      
      toast.success("Ad created successfully!");
      router.push(`/ads/${response.data.ad._id}`);
    } catch (error: any) {
      console.error("Error creating ad:", error);
      toast.error(error.response?.data?.error || "Failed to create ad");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">You must be logged in to post an ad</p>
        <button 
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          onClick={() => router.push("/auth/signin")}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Ad</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Ad Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ad Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border rounded"
                placeholder="Enter a descriptive title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Provide details about your item"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (KSH) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  className="w-full p-2 border rounded"
                  placeholder="Enter price"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="negotiable" className="text-sm">Price is negotiable</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Category Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subcategory *</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                required
                disabled={!category}
                className="w-full p-2 border rounded"
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
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2 border rounded"
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
            
            {/* Render Custom Fields based on selected subcategory */}
            {Object.entries(availableCustomFields).length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Additional Details</h3>
                
                {Object.entries(availableCustomFields).map(([fieldName, options]) => (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium mb-1">
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                    </label>
                    <select
                      value={customFields[fieldName] || ""}
                      onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select {fieldName}</option>
                      {(options as string[]).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Location Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">County *</label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select County</option>
                {counties.map((countyItem) => (
                  <option key={countyItem._id} value={countyItem.name}>
                    {countyItem.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subcounty *</label>
              <select
                value={subcounty}
                onChange={(e) => setSubcounty(e.target.value)}
                required
                disabled={!county}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Subcounty</option>
                {subcounties.map((subcountyItem) => (
                  <option key={subcountyItem.name} value={subcountyItem.name}>
                    {subcountyItem.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Town *</label>
              <select
                value={town}
                onChange={(e) => setTown(e.target.value)}
                required
                disabled={!subcounty}
                className="w-full p-2 border rounded"
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
        </div>
        
        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <p className="text-sm text-gray-500 mb-4">Upload at least one image (maximum 8)</p>
          
          <ImageUpload 
            images={images} 
            setImages={setImages} 
            maxImages={8} 
          />
        </div>
        
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-2 border rounded"
                placeholder="e.g. 0700123456"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded"
                placeholder="Your email address"
                readOnly={!!session?.user?.email}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Number (optional)</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g. 0700123456"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Post Ad"}
          </button>
        </div>
      </form>
    </div>
  );
}