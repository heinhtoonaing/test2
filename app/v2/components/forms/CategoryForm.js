"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CategoryForm({ onSubmit, defaultValues }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues,
  });

  const submitForm = (data) => {
    onSubmit(data); // Call the passed handler with form data
    reset(); // Reset form after submission
  };

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Category Form
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-2 gap-4 w-fit m-4">
            <div>Category:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>Order:</div>
            <div>
              <input
                name="order"
                type="number"
                {...register("order", { required: true, valueAsNumber: true })}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div className="col-span-2">
              <input
                type="submit"
                value="Add"
                className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              />
            </div>
          </div>
        </form>
      </Typography>
    </Box>
  );
}
