"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";

export default function ProductManagement() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'price', headerName: 'Price', width: 150 },
    { field: 'order', headerName: 'Order', width: 150 },
    {
      field: 'Action', headerName: 'Action', width: 150,
      renderCell: (params) => (
        <div>
          <button onClick={() => startEditMode(params.row)}>📝</button>
          <button onClick={() => deleteProduct(params.row)}>🗑️</button>
        </div>
      ),
    },
  ];

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/product`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const products = await response.json();
      const formattedProducts = products.map((product) => ({ ...product, id: product._id }));
      setProductList(formattedProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Form Submission (Add or Update Product)
  const handleProductFormSubmit = async (data) => {
    const method = editMode ? "PUT" : "POST";
    const endpoint = editMode ? `${API_BASE}/product` : `${API_BASE}/product`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit product");
      reset(); // Reset the form after successful submission
      fetchProducts(); // Refetch products after submit
      setEditMode(false); // Exit edit mode if applicable
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit Mode
  const startEditMode = (product) => {
    reset(product);
    setEditMode(true);
  };

  const stopEditMode = () => {
    reset({
      name: '',
      description: '',
      price: '',
      order: ''
    });
    setEditMode(false);
  };

  // Delete Product
  const deleteProduct = async (product) => {
    if (!confirm(`Are you sure to delete [${product.name}]?`)) return;
    const id = product._id;
    try {
      const response = await fetch(`${API_BASE}/product/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Loading and Error States
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main>
      {/* Form */}
      <form onSubmit={handleSubmit(handleProductFormSubmit)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
          <div>Product Name:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: "Name is required", minLength: { value: 3, message: "Minimum 3 characters required" } })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div>Description:</div>
          <div>
            <input
              name="description"
              type="text"
              {...register("description", { required: "Description is required" })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>

          <div>Price:</div>
          <div>
            <input
              name="price"
              type="number"
              {...register("price", { required: "Price is required", min: { value: 0, message: "Price must be a non-negative number" } })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>

          <div>Order:</div>
          <div>
            <input
              name="order"
              type="number"
              {...register("order", { required: "Order is required", min: { value: 1, message: "Order must be greater than 0" } })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.order && <p className="text-red-500">{errors.order.message}</p>}
          </div>

          <div className="col-span-2 text-right">
            {editMode ? (
              <>
                <input
                  type="submit"
                  className="italic bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  value="Update"
                />
                {' '}
                <button
                  onClick={stopEditMode}
                  type="button" // Prevent form submission
                  className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Cancel
                </button>
              </>
            ) : (
              <input
                type="submit"
                value="Add"
                className="w-20 italic bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            )}
          </div>
        </div>
      </form>

      {/* Data Grid */}
      <div className="mx-4">
        <DataGrid
          rows={productList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
        />
      </div>
    </main>
  );
}
