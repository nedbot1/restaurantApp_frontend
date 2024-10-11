"use client";
import { fetchMenu, createMenu, fetchCategory } from "../services/services";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Menu, Category } from "../type/type";


export default function CreateMenuModal({
  params,
}: {
  params: {
    restaurantId: string;
  };
}) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [addMenuForm, setAddMenuForm] = useState(false); // State to control form visibility
  const { id } = useParams() as {id:string};

  // Load the menus and categories when the component mounts
  async function loadMenu() {
    const menus = await fetchMenu(id);
    setMenus(menus.data);
  }

  async function loadCategories() {
    const categories = await fetchCategory(); // Assuming fetchCategory fetches categories
    setCategories(categories.data);
  }

  useEffect(() => {
    loadMenu();
    loadCategories();
  }, []);

  // Create a new dish
  async function createDish() {
    if (!selectedCategoryId) {
      console.error("Category ID is not selected.");
      return;
    }

    const newMenuItem = [
      {
        item_name: itemName,
        item_description: itemDescription,
        price: itemPrice,
        dish_photo_link: itemImage,
        restaurant_id: id as string, // Assuming id is restaurant_id
        category_id: selectedCategoryId, // Use selected category ID
      },
    ];

    try {
      await createMenu(newMenuItem);
      loadMenu(); // Reload the menu after the new dish is created
      // Reset form fields
      setItemName("");
      setItemPrice(0);
      setItemDescription("");
      setItemImage("");
      setSelectedCategoryId(null); // Reset the selected category
      setAddMenuForm(false); // Hide the form after creation
    } catch (error) {
      console.error("Error creating dish:", error);
    }
  }

  return (
    <div className="flex flex-col overflow-auto">
      {/* Display existing menus */}
      <div className="flex gap-6 overflow-x-auto p-4">
        {menus.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className="bg-white/50 flex flex-col rounded-lg shadow-lg p-4 min-w-[300px]" // Set a fixed min-width to control the size of the card
          >
            <h1 className="text-lg font-semibold text-teal-600 mb-2">
              {category.category_name}
            </h1>
            <div className="flex flex-col gap-6 overflow-y-auto">
              {category.menus.map((menu, menuIndex) => (
                <div
                  key={menuIndex}
                  className="border-b py-4 min-w-[250px] w-[250px]"
                >
                  {" "}
                  {/* Set a min-width for each dish item */}
                  <h2 className="text-md font-bold text-gray-800">
                    {menu.item_name}
                  </h2>
                  <p className="text-gray-600">{menu.item_description}</p>
                  <img
                    src={menu.dish_photo_link}
                    alt={menu.item_name}
                    className="rounded-lg my-2 w-full h-60 object-cover
"
                  />
                  <p className="text-lg font-semibold text-teal-500">
                    Price: ${menu.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Button to toggle the form visibility */}

      {/* Show the form to Create New Dish */}
      {addMenuForm && (
        <div className="absolute w-full mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Add a New Dish
          </h2>

          {/* Dropdown to select category */}
          <select
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            value={selectedCategoryId || ""}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 mb-4 bg-gray-50 text-gray-800"
            required
          >
            <option value="" disabled>
              Select a Category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              createDish();
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Dish Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
              required
            />

            <textarea
              placeholder="Dish Description"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
              required
            />

            <input
              type="number"
              placeholder="Dish Price"
              value={itemPrice}
              onChange={(e) => setItemPrice(Number(e.target.value))}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
              required
            />

            <input
              type="url"
              placeholder="Dish Image URL"
              value={itemImage}
              onChange={(e) => setItemImage(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
              required
            />

            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-all"
            >
              Create Dish
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setAddMenuForm((prev) => !prev)}
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 m-6 bg-teal-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-teal-700 transition-all"
      >
        {addMenuForm ? "Cancel" : "Add a New Dish"}
      </button>
    </div>
  );
}
