import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import AddCategoryModal from '../../Components/Modals/AddCategoryModal'
import EditCategoryModal from '../../Components/Modals/EditCategoryModal'
import AddMenuItemModal from '../../Components/Modals/AddMenuItemModal'
import EditMenuItemModal from '../../Components/Modals/EditMenuItemModal'
import { FiPlus, FiFolderPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'
import api from '../../utils/api'

const Menu = () => {
    const [activeTab, setActiveTab] = useState('all')
    const [categories, setCategories] = useState([])
    const [menuItems, setMenuItems] = useState([])
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
    const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false)
    const [isEditMenuItemOpen, setIsEditMenuItemOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    useEffect(() => {
        fetchCategories()
        fetchMenuItems()
    }, [])

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/admin/categories')
            setCategories(data.data)
        } catch (err) {
            console.error('Failed to fetch categories:', err)
        }
    }

    const fetchMenuItems = async () => {
        try {
            const { data } = await api.get('/admin/menus')
            console.log('Menu items:', data.data)
            setMenuItems(data.data)
        } catch (err) {
            console.error('Failed to fetch menu items:', err)
        }
    }

    const handleDeleteCategory = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return
        try {
            await api.delete(`/admin/categories/${id}`)
            fetchCategories()
            if (activeTab === id) setActiveTab('all')
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete category')
        }
    }

    const handleDeleteMenuItem = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return
        try {
            await api.delete(`/admin/menus/${id}`)
            fetchMenuItems()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete item')
        }
    }

    const handleToggleAvailability = async (item) => {
        try {
            await api.put(`/admin/menus/${item.id}`, { is_available: item.is_available ? 0 : 1 })
            fetchMenuItems()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update item')
        }
    }

    const filteredItems = activeTab === 'all' ? menuItems : menuItems.filter(item => item.category_id === activeTab)

    return (
        <>
            <AddCategoryModal isOpen={isAddCategoryOpen} onClose={() => setIsAddCategoryOpen(false)} onSuccess={fetchCategories} />
            <EditCategoryModal isOpen={isEditCategoryOpen} onClose={() => { setIsEditCategoryOpen(false); setEditingCategory(null) }} category={editingCategory} onSuccess={fetchCategories} />
            <AddMenuItemModal isOpen={isAddMenuItemOpen} onClose={() => setIsAddMenuItemOpen(false)} categories={categories} onSuccess={fetchMenuItems} />
            <EditMenuItemModal isOpen={isEditMenuItemOpen} onClose={() => { setIsEditMenuItemOpen(false); setEditingItem(null) }} item={editingItem} categories={categories} onSuccess={fetchMenuItems} />
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
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all' ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
                            >
                                All Items
                            </button>
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center gap-1">
                                    <button
                                        onClick={() => setActiveTab(cat.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === cat.id ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        {cat.name}
                                    </button>
                                    <button onClick={() => { setEditingCategory(cat); setIsEditCategoryOpen(true) }} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors">
                                        <FiEdit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                        <FiTrash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
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
                                        src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400x300'}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300' }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm ${item.is_available ? 'bg-green-500' : 'bg-gray-500'}`}>
                                        {item.is_available ? 'Available' : 'Unavailable'}
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
                                            {item.category?.name}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                        <button onClick={() => handleToggleAvailability(item)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors group/btn">
                                            {item.is_available ? (
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
                                        <button onClick={() => { setEditingItem(item); setIsEditMenuItemOpen(true) }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors">
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteMenuItem(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors">
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
