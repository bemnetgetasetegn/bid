"use client";

import * as React from "react";
import { FolderTree, Plus, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { slugify } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState([
    { id: "1", name: "Smartphones", slug: "smartphones", display_order: 1, is_active: true },
    { id: "2", name: "Computers", slug: "computers", display_order: 2, is_active: true },
    { id: "3", name: "Electronics", slug: "electronics", display_order: 3, is_active: true },
    { id: "4", name: "Gaming", slug: "gaming", display_order: 4, is_active: true },
    { id: "5", name: "Vehicles", slug: "vehicles", display_order: 5, is_active: true },
    { id: "6", name: "Home & Lifestyle", slug: "home-lifestyle", display_order: 6, is_active: true },
    { id: "7", name: "Other Products", slug: "other-products", display_order: 7, is_active: true },
  ]);

  const [newName, setNewName] = React.useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const cat = {
      id: String(Date.now()),
      name: newName.trim(),
      slug: slugify(newName),
      display_order: categories.length + 1,
      is_active: true,
    };
    setCategories([...categories, cat]);
    setNewName("");
    toast({
      title: "Category Added",
      description: `Category "${cat.name}" has been created.`,
      variant: "success",
    });
  };

  const toggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b-2 border-[#111111]">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
          Catalog Organization
        </span>
        <h1 className="text-3xl font-black uppercase text-[#111111]">
          Manage Categories
        </h1>
      </div>

      {/* Add New Category */}
      <form onSubmit={handleAdd} className="bg-white border-2 border-[#111111] p-4 flex gap-3 shadow-sm">
        <Input
          placeholder="New Category Name (e.g. Luxury Watches)..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="bg-[#F5F5F3] text-xs font-semibold"
          required
        />
        <Button type="submit" className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-bold uppercase text-xs shrink-0">
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </form>

      <div className="bg-white border-2 border-[#111111] shadow-md divide-y divide-[#E5E5E5]">
        {categories.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-extrabold text-sm text-[#111111] block">
                {c.name}
              </span>
              <span className="text-[10px] text-[#686868] font-mono">
                Slug: /{c.slug} • Order: {c.display_order}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                className={
                  c.is_active
                    ? "bg-[#16803C] text-white text-[9px] font-bold"
                    : "bg-[#686868] text-white text-[9px] font-bold"
                }
              >
                {c.is_active ? "ACTIVE" : "INACTIVE"}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleActive(c.id)}
                className="text-[10px] uppercase font-bold h-7 px-2"
              >
                {c.is_active ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
