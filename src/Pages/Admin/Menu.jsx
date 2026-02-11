import React, { useState } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import AddCategoryModal from '../../Components/Modals/AddCategoryModal'
import AddMenuItemModal from '../../Components/Modals/AddMenuItemModal'
import EditMenuItemModal from '../../Components/Modals/EditMenuItemModal'
import { FiPlus, FiFolderPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'

const Menu = () => {
    const [activeTab, setActiveTab] = useState('All Items')
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
    const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false)
    const [isEditMenuItemOpen, setIsEditMenuItemOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    const categories = [
        { name: 'All Items', count: 6 },
        { name: 'Mains', count: 2 },
        { name: 'Salads', count: 2 },
        { name: 'Pasta', count: 1 },
        { name: 'Desserts', count: 1 },
    ]

    const menuItems = [
        {
            id: 1,
            name: "Grilled Salmon Bowl",
            price: "14.99",
            description: "Fresh Atlantic salmon with quinoa, roasted vegetables, and lemon herb",
            category: "Mains",
            image: "https://images.unsplash.com/photo-1564946928948-51111a41f940?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            status: "Available"
        },
        {
            id: 2,
            name: "Mediterranean Chicken Salad",
            price: "12.99",
            description: "Grilled chicken breast with mixed greens, feta, olives, and balsamic dressing",
            category: "Salads",
            image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            status: "Available"
        },
        {
            id: 3,
            name: "Penne Arrabbiata",
            price: "11.99",
            description: "Spicy tomato sauce with fresh basil and parmesan cheese",
            category: "Pasta",
            image: "https://images.unsplash.com/photo-1626844131082-256783844137?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            status: "Unavailable"
        },
        {
            id: 4,
            name: "Steak Frites",
            price: "24.99",
            description: "Prime sirloin steak served with crispy french fries and herb butter",
            category: "Mains",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            status: "Available"
        },
        {
            id: 5,
            name: "Classic Caesar Salad",
            price: "10.99",
            description: "Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing",
            category: "Salads",
            image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            status: "Available"
        },
        {
            id: 6,
            name: "Chocolate Lava Cake",
            price: "8.99",
            description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
            category: "Desserts",
            image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            status: "Available"
        }
    ]

    const filteredItems = activeTab === 'All Items'
        ? menuItems
        : menuItems.filter(item => item.category === activeTab)

    return (
        <>
            <AddCategoryModal isOpen={isAddCategoryOpen} onClose={() => setIsAddCategoryOpen(false)} />
            <AddMenuItemModal isOpen={isAddMenuItemOpen} onClose={() => setIsAddMenuItemOpen(false)} />
            <EditMenuItemModal
                isOpen={isEditMenuItemOpen}
                onClose={() => {
                    setIsEditMenuItemOpen(false)
                    setEditingItem(null)
                }}
                item={editingItem}
            />
            <DashboardLayout>
                <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsAddCategoryOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FiFolderPlus className="w-4 h-4" />
                                Add Category
                            </button>
                            <button
                                onClick={() => setIsAddMenuItemOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                            >
                                <FiPlus className="w-4 h-4" />
                                Add Menu Item
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                        <div className="flex items-center gap-2 min-w-max">
                            {categories.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.name
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {tab.name} ({tab.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm ${item.status === 'Available' ? 'bg-green-500' : 'bg-gray-500'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={item.name}>{item.name}</h3>
                                        <span className="text-lg font-bold text-orange-500">${item.price}</span>
                                    </div>

                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1" title={item.description}>
                                        {item.description}
                                    </p>

                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                            {item.category}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors group/btn">
                                            {item.status === 'Available' ? (
                                                <>
                                                    <FiEyeOff className="w-4 h-4" />
                                                    <span>Deactivate</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiEye className="w-4 h-4" />
                                                    <span>Activate</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingItem(item)
                                                setIsEditMenuItemOpen(true)
                                            }}
                                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        </>
    )
}

export default Menu
