import { useForm } from "@tanstack/react-form";
import z from "zod";
import { Inventory } from "../routes/inventories";
import { useState } from "react";


export default function ItemForm({
  onClose,
  onItemAdded,
}: {
  onClose: () => void;
  onItemAdded: (newItem: Inventory) => void;
}) {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm({
    defaultValues: {
      productID: 1,
      productName: "",
      quantity: 1,
      price: 1,
      category: "",
      supplier: "",
      productImage: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch("http://localhost:1337/api/inventories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: value }),
        });

        if (!response.ok) throw new Error("Failed to add item");
        console.log(FormData)

        const newItem = await response.json();
        // onItemAdded(newItem.data);
        onItemAdded(newItem.data.attributes || newItem.data);

        alert("Item added successfully!");
      } catch (error) {
        console.error(error);
        alert("Error adding item.");
      }
    },
    validators: {
      onChange: z.object({
        productID: z.number().int().min(1, "Must include product id"),
        productName: z.string().min(3, "Product name is required"),
        quantity: z.number().int().min(1, "Must input quantity"),
        price: z.number().int().min(1, "Must input unit price"),
        category: z.string().min(5, "Category is required"),
        supplier: z.string().min(3, "Supplier is required"),
        productImage: z.string().url(),
      }),
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* Input Fields */}
        <form.Field
          name="productID"
          children={(field) => (
            <div>
              <label htmlFor="productID">Product ID</label>
              <input
                name="productID"
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )}
        />

        <form.Field
          name="productName"
          children={(field) => (
            <div>
              <label htmlFor="productName">Product Name</label>
              <input
                name="productName"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )}
        />

        <form.Field
          name="quantity"
          children={(field) => (
            <div>
              <label htmlFor="quantity">Quantity</label>
              <input
                name="quantity"
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )}
        />

        <form.Field
          name="price"
          children={(field) => (
            <div>
              <label htmlFor="price">Price</label>
              <input
                name="price"
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )}
        />

        <form.Field
          name="category"
          children={(field) => (
            <div>
              <label htmlFor="category">Category</label>
              <input
                name="category"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )}
        />

        <form.Field
          name="supplier"
          children={(field) => (
            <div>
              <label htmlFor="supplier">Supplier</label>
              <input
                name="supplier"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )}
        />

        {/* <form.Field
          name="productImage"
          children={(field) => (
            <div>
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                name="productImage"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )}
        /> */}

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}






// import { useForm } from "@tanstack/react-form";
// import { useState } from "react";
// import { z } from "zod";

// const schema = z.object({
//   productName: z.string().min(3, "Product name is required"),
//   productID: z.number().int().min(1, "Must input product ID"),
//   quantity: z.number().int().min(1, "Must input quantity"),
//   price: z.number().int().min(1, "Must input unit price"),
//   category: z.string().min(3, "Category is required"),
//   supplier: z.string().min(3, "Supplier is required"),
// });

// export default function ItemForm({ onClose, onItemAdded }) {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const form = useForm({
//     defaultValues: {
//       productName: "",
//       productID: 1,
//       quantity: 1,
//       price: 1,
//       category: "",
//       supplier: "",
//     },
//   });

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     // Validate form data
//     const result = schema.safeParse(form.values);
//     if (!result.success) {
//       alert("Please correct the validation errors before submitting.");
//       return;
//     }

//     try {
//       const formData = new FormData();

//       formData.append("data", JSON.stringify(result.data)); // Using validated data

//       if (selectedFile) {
//         formData.append("files.productImage", selectedFile);
//       }

//       const response = await fetch("http://localhost:1337/api/inventories", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to add item");

//       const newItem = await response.json();
//       onItemAdded(newItem.data);
//       alert("Item added successfully!");
//       onClose();
//     } catch (error) {
//       console.error("Upload Error:", error);
//       alert("Error adding item.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <form.Field
//         name="productName"
//         validation={schema.shape.productName}
//         children={(field) => (
//           <div>
//             <label>Product Name</label>
//             <input {...field.props} />
//             {field.state.meta.errors.length > 0 && (
//               <p style={{ color: "red" }}>{field.state.meta.errors[0]}</p>
//             )}
//           </div>
//         )}
//       />

//       <form.Field
//         name="productID"
//         validation={schema.shape.productID}
//         children={(field) => (
//           <div>
//             <label>Product ID</label>
//             <input type="number" {...field.props} />
//             {field.state.meta.errors.length > 0 && (
//               <p style={{ color: "red" }}>{field.state.meta.errors[0]}</p>
//             )}
//           </div>
//         )}
//       />

//       <form.Field
//         name="quantity"
//         validation={schema.shape.quantity}
//         children={(field) => (
//           <div>
//             <label>Quantity</label>
//             <input type="number" {...field.props} />
//             {field.state.meta.errors.length > 0 && (
//               <p style={{ color: "red" }}>{field.state.meta.errors[0]}</p>
//             )}
//           </div>
//         )}
//       />

//       <form.Field
//         name="price"
//         validation={schema.shape.price}
//         children={(field) => (
//           <div>
//             <label>Price</label>
//             <input type="number" {...field.props} />
//             {field.state.meta.errors.length > 0 && (
//               <p style={{ color: "red" }}>{field.state.meta.errors[0]}</p>
//             )}
//           </div>
//         )}
//       />

//       <form.Field
//         name="category"
//         validation={schema.shape.category}
//         children={(field) => (
//           <div>
//             <label>Category</label>
//             <input {...field.props} />
//             {field.state.meta.errors.length > 0 && (
//               <p style={{ color: "red" }}>{field.state.meta.errors[0]}</p>
//             )}
//           </div>
//         )}
//       />

//       <form.Field
//         name="supplier"
//         validation={schema.shape.supplier}
//         children={(field) => (
//           <div>
//             <label>Supplier</label>
//             <input {...field.props} />
//             {field.state.meta.errors.length > 0 && (
//               <p style={{ color: "red" }}>{field.state.meta.errors[0]}</p>
//             )}
//           </div>
//         )}
//       />

//       {/* File Upload Input */}
//       <div>
//         <label>Product Image</label>
//         <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
//       </div>

//       <button type="submit">Submit</button>
//     </form>
//   );
// }
