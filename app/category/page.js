"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";

export default function Home() {

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'order', headerName: 'Order', width: 150 },
    {
      field: 'Action', headerName: 'Action', width: 150,
      renderCell: (params) => (
        <div>
          <button onClick={() => startEditMode(params.row)}>📝</button>
          <button onClick={() => deleteCategory(params.row)}>🗑️</button>
        </div>
      )
    },
  ];

  // Fetch Categories
  async function fetchCategory() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetch(`${API_BASE}/category`);
      const c = await data.json();
      const c2 = c.map((category) => ({ ...category, id: category._id }));
      setCategoryList(c2);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  // Form Submission (Add or Update Category)
  function handleCategoryFormSubmit(data) {
    if (editMode) {
      // Updating a category
      fetch(`${API_BASE}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchCategory();
      });
      return;
    }

    // Creating a new category
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchCategory());
  }

  // Edit Mode
  function startEditMode(category) {
    reset(category);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: '',
      order: ''
    });
    setEditMode(false);
  }

  // Delete Category
  async function deleteCategory(category) {
    if (!confirm(`Are you sure to delete [${category.name}]`)) return;
    const id = category._id;
    await fetch(`${API_BASE}/category/${id}`, { method: "DELETE" });
    fetchCategory();
  }

  // Handle Loading and Error States
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      {/* Form */}
      <form onSubmit={handleSubmit(handleCategoryFormSubmit)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
          <div>Category name:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: "Name is required", minLength: { value: 3, message: "Minimum 3 characters required" } })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
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
          rows={categoryList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
        />
      </div>
    </main>
  );
}
