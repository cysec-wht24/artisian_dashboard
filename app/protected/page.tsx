"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  ModalDoneButton,
} from "../../components/ui/animated-modal";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { useState, useEffect } from "react";

import AudioDescriptionRecorder from "../../components/audioDescriptionRecorder"; // ✅ CHANGED
import UploadPicture from "../../components/ui/uploadPicture";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const supabase = createClient();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const user = supabase.auth.getUser();

  const fetchProducts = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("❌ Error fetching user:", userError);
      return;
    }

    const { data: sellerData, error: sellerError } = await supabase
      .from("sellers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (sellerError || !sellerData) {
      console.error("❌ Error fetching seller:", sellerError);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", sellerData.id);

    if (error) {
      console.error("❌ Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productPhoto: null as File | null,
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ No authenticated user found:", userError);
        alert("You must be logged in as a seller to delete a product.");
        return;
      }

      const { data: seller, error: sellerError } = await supabase
        .from("sellers")
        .select("id, is_seller")
        .eq("user_id", user.id)
        .single();

      if (sellerError || !seller) {
        console.error("❌ No seller record found:", sellerError);
        alert("You are not registered as a seller.");
        return;
      }

      if (!seller.is_seller) {
        alert("Your seller account is not verified yet.");
        return;
      }

      const { error: deleteError, count } = await supabase
        .from("products")
        .delete({ count: "exact" })
        .eq("id", productId)
        .eq("seller_id", seller.id);

      if (deleteError) {
        console.error("❌ Error deleting product:", deleteError);
        alert("Failed to delete product.");
        return;
      }

      if (count === 0) {
        return;
      }

      alert("✅ Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert("Something went wrong while deleting the product.");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ No authenticated user found:", userError);
        alert("You must be logged in as a seller to add a product.");
        return;
      }

      const { data: seller, error: sellerError } = await supabase
        .from("sellers")
        .select("id, is_seller")
        .eq("user_id", user.id)
        .single();

      if (sellerError || !seller) {
        console.error("❌ No seller record found:", sellerError);
        alert("You are not registered as a seller.");
        return;
      }

      if (!seller.is_seller) {
        alert("Your seller account is not verified yet.");
        return;
      }

      let photoUrl: string | null = null;
      if (formData.productPhoto) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-photos")
          .upload(
            `products/${Date.now()}-${formData.productPhoto.name}`,
            formData.productPhoto
          );

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-photos")
          .getPublicUrl(uploadData.path);

        photoUrl = publicUrlData.publicUrl;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("products")
        .insert([
          {
            name: formData.productName,
            price: parseFloat(formData.productPrice),
            description: formData.description,
            image_url: photoUrl,
            user_id: user.id,
            seller_id: seller.id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      if (inserted) {
        try {
          const res = await fetch("/api/protected", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: inserted.id,
              image_url: inserted.image_url,
            }),
          });

          const result = await res.json();
          console.log("AI route result:", result);
        } catch (err) {
          console.error("❌ Failed to call AI route:", err);
        }
      }

      await fetchProducts();
      setFormData({
        productName: "",
        productPrice: "",
        productPhoto: null,
        description: "",
      });

      alert("✅ Product added successfully!");
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      alert("Failed to add product. Check console for details.");
    }
  };

  return (
    <div className="py-20 flex flex-col items-center justify-start w-full bg-neutral-50 dark:bg-neutral-900 transition-colors">
      {/* Modal Section */}
      <Modal>
        <ModalTrigger className="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black flex justify-top group/modal-btn rounded-lg shadow hover:opacity-90 transition">
          <div className="w-20 h-20 rounded-md flex items-center justify-center">
            <span className="text-6xl font-bold leading-none flex items-center mb-2">
              +
            </span>
          </div>
        </ModalTrigger>

        <ModalBody>
          <ModalContent>
            <form className="flex flex-col items-center gap-6 p-6 w-full max-w-md mx-auto">
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                Let's add a new product
              </h2>

              {/* Product Name */}
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />

              {/* Product Price */}
              <div className="w-full flex items-center rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus-within:ring-2 focus-within:ring-neutral-400">
                <span className="px-3 text-neutral-500">₹</span>
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleChange}
                  placeholder="Enter product price"
                  className="w-full p-2 bg-transparent text-inherit focus:outline-none"
                />
              </div>

              {/* Upload Photo */}
              <div className="flex flex-col items-center">
                <UploadPicture
                  onFileSelect={(file) =>
                    setFormData({ ...formData, productPhoto: file })
                  }
                />
              </div>

              {/* ✅ REPLACED: AudioRecorderButton + separate textarea with AudioDescriptionRecorder */}
              <AudioDescriptionRecorder
                initialDescription={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
              />

            </form>
          </ModalContent>

          <ModalFooter className="gap-4">
            <ModalDoneButton onSubmit={handleSubmit} />
          </ModalFooter>
        </ModalBody>
      </Modal>

      {/* Product Cards Section */}
      <div className="w-full max-w-5xl px-6 mt-12 flex flex-wrap justify-center gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 w-64 shadow-sm hover:shadow-md transition"
          >
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription className="text-neutral-600 dark:text-neutral-400">
                ₹{product.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {product.description}
              </p>
            </CardContent>

            <CardFooter className="flex flex-col justify-between">
              <div className="flex flex-row gap-2 items-end">
                <button
                  className="px-3 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 rounded transition"
                  onClick={() =>
                    router.push(`/protected/product?id=${product.id}`)
                  }
                >
                  Expand
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  Delete
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}