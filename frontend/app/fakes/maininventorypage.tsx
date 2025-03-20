import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { fetchInventories } from "../utils/inventories";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { getStrapiURL } from "../utils/strapi";

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
    productImage: { url: string, alternativeText: string };
};

function InventoriesComponent() {
    const inventories = Route.useLoaderData();

    // State for filters
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");

    // Extract unique values for dropdowns
    const uniqueCategories = [...new Set(inventories.map((item) => item.category))];
    const uniqueSuppliers = [...new Set(inventories.map((item) => item.supplier))];

    // Define table columns
    const columns: ColumnDef<Inventory>[] = [
        { accessorKey: "productID", header: "Product ID", sortingFn: "alphanumeric" },
        { accessorKey: "productName", header: "Product Name", sortingFn: "alphanumeric" },
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
                alt={row.original.productImage?.alternativeText || row.original.productName}
                    // src={row.original.productImage?.url ? `${getStrapiURL()}${row.original.productImage.url}` : "/placeholder-image.jpg"}
                    // alt={row.original.productImage?.alternativeText || row.original.productName}
                    className="w-16 h-16 object-cover rounded"
                />
            ),
        },
    ];

    // Create Table Instance
    const table = useReactTable({
        data: inventories,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    // Search and filter logic
    const filteredRows = table.getRowModel().rows.filter((row) => {
        const matchesSearch =
            row.original.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.original.productID.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryFilter ? row.original.category === categoryFilter : true;
        const matchesSupplier = supplierFilter ? row.original.supplier === supplierFilter : true;

        return matchesSearch && matchesCategory && matchesSupplier;
    });

    // Handle clearing filters
    const clearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("");
        setSupplierFilter("");
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Inventory</h2>

            {/* Search Filter Input */}
            <input
                type="text"
                placeholder="Search by Product ID or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            {/* Clear Filters Button */}
            <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Clear Filters
            </button>

            {/* Table Container */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                <table className="min-w-full border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="p-3 text-left bg-gray-100">
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}

                                            {/* Category Filter beside Category Header */}
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

                                            {/* Supplier Filter beside Supplier Header */}
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
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {filteredRows.length > 0 ? (
                            filteredRows.map((row) => (
                                <tr key={row.id} className="border-b">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-4 text-center text-red-500 font-semibold">
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
