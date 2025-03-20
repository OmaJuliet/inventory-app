import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { fetchInventories } from "../utils/inventories";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { getStrapiURL } from "../utils/strapi";
import SearchInput from "../components/SearchInput";


export const Route = createFileRoute("/inventories")({
  loader: async () => fetchInventories(),
  component: InventoriesComponent,
});

export type Inventory = {
  id: number;
  productID: string;
  productName: string;
  quantity: number;
  price: number;
  category: string;
  supplier: string;
  productImage: { url: string; alternativeText: string };
};

function InventoriesComponent() {
  const inventories = Route.useLoaderData();

  // State for global filter
  const [globalFilter, setGlobalFilter] = useState("");

  // Define table columns
  const columns: ColumnDef<Inventory>[] = [
    {
      accessorKey: "productID",
      header: "Product ID",
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      sortingFn: "alphanumeric",
    },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "supplier", header: "Supplier" },
    { accessorKey: "quantity", header: "Quantity", sortingFn: "basic" },
    { accessorKey: "price", header: "Unit Price ($)", sortingFn: "basic" },
    {
      accessorKey: "productImage",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.original.productImage?.url}
          alt={
            row.original.productImage?.alternativeText ||
            row.original.productName
          }
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
  ];

  // Create Table Instance
  const table = useReactTable({
    data: inventories,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // State for filter values
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");

  // Extract unique categories and suppliers for dropdowns
  const uniqueCategories = [
    ...new Set(inventories.map((item) => item.category)),
  ];
  const uniqueSuppliers = [
    ...new Set(inventories.map((item) => item.supplier)),
  ];

  // Filter data based on category and supplier
  const filteredData = inventories.filter((item) => {
    return (
      (categoryFilter ? item.category === categoryFilter : true) &&
      (supplierFilter ? item.supplier === supplierFilter : true)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Inventory</h2>

      {/* Global Search Filter Input */}
      <div className="flex justify-between mb-4">
        <div className="w-full flex items-center gap-1">
          {/* <SearchIcon /> */}
          <SearchInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500"
            placeholder="Search all columns..."
          />
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            setCategoryFilter("");
            setSupplierFilter("");
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full border-collapse">
          <thead className="bg-indigo-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="capitalize px-3.5 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {/* Category filter beside Category header */}
                    {header.column.id === "category" && (
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="p-1 border border-gray-300 rounded text-sm bg-white"
                      >
                        <option value="">All</option>
                        {uniqueCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Supplier filter beside Supplier header */}
                    {header.column.id === "supplier" && (
                      <select
                        value={supplierFilter}
                        onChange={(e) => setSupplierFilter(e.target.value)}
                        className="p-1 border border-gray-300 rounded text-sm bg-white"
                      >
                        <option value="">All</option>
                        {uniqueSuppliers.map((sup) => (
                          <option key={sup} value={sup}>
                            {sup}
                          </option>
                        ))}
                      </select>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b">
                  {table
                    .getRowModel()
                    .rows.find((row) => row.original.id === item.id)
                    ?.getVisibleCells()
                    .map((cell) => (
                      <td key={cell.id} className="p-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-red-500 font-semibold"
                >
                  Oops! No item matching your search was found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Outlet />
    </div>
  );
}

export default InventoriesComponent;
