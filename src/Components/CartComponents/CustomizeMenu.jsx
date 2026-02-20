import React, { useMemo, useState } from 'react'

function CustomizeMenu({ isOpen, onClose, baseItem, allMenus = [], onAddExtra }) {
  const [additionalCost, setAdditionalCost] = useState(0)
  const [loadingIds, setLoadingIds] = useState({})
  const [addedIds, setAddedIds] = useState({})

  const { drinkItems, sideItems } = useMemo(() => {
    if (!allMenus || allMenus.length === 0) {
      return { drinkItems: [], sideItems: [] }
    }

    const withCategory = allMenus.filter((item) => item && (item.category || item.category_name))

    const isDrink = (item) => {
      const name =
        (item.category && item.category.name) ||
        item.category_name ||
        ''
      return name.toLowerCase().includes('drink')
    }

    const drinks = withCategory.filter(isDrink).slice(0, 3)

    const nonDrinks = withCategory.filter((item) => !isDrink(item))

    const shuffledSides = [...nonDrinks].sort(() => 0.5 - Math.random())
    const sides = shuffledSides.slice(0, 5)

    return { drinkItems: drinks, sideItems: sides }
  }, [allMenus])

  if (!isOpen || !baseItem) {
    return null
  }

  const handleAddExtra = async (item) => {
    if (!item || !onAddExtra) return
    if (loadingIds[item.id] || addedIds[item.id]) return
    setLoadingIds(prev => ({ ...prev, [item.id]: true }))
    try {
      const result = await onAddExtra(item)
      if (result) {
        setAddedIds(prev => ({ ...prev, [item.id]: true }))
        const price = Number(item.price || 0)
        if (!Number.isNaN(price)) {
          setAdditionalCost(prev => prev + price)
        }
      }
    } finally {
      setLoadingIds(prev => ({ ...prev, [item.id]: false }))
    }
  }

  const formatPrice = (price) => {
    const value = Number(price || 0)
    return `₦${value.toFixed(2)}`
  }

  const getButtonLabel = (itemId) => {
    if (loadingIds[itemId]) return 'Adding...'
    if (addedIds[itemId]) return 'Added'
    return 'Add'
  }

  const isButtonDisabled = (itemId) => {
    return Boolean(loadingIds[itemId] || addedIds[itemId])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Customize Your Order</h2>
            <p className="text-xs text-gray-500 mt-1">
              Select accompanying items for {baseItem.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none px-1"
          >
            ×
          </button>
        </div>

        <div className="px-6 pt-4 pb-6 space-y-4">
          <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">Water</span>
                <span className="text-[10px] uppercase tracking-wide font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  Complimentary
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-orange-50 border border-orange-100 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">50cl Bottled Water</p>
                <p className="text-xs text-gray-500">Free</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-orange-500 text-white">
                Selected
              </span>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">Choose Your Drink</span>
              <span className="text-[11px] text-gray-400">Select one</span>
            </div>
            <div className="space-y-3">
              {drinkItems.length === 0 && (
                <p className="text-xs text-gray-400">No drinks available at the moment.</p>
              )}
              {drinkItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl px-3 py-3 border border-gray-100 hover:border-orange-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/80x80'}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {formatPrice(item.price)}
                    </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddExtra(item)}
                    disabled={isButtonDisabled(item.id)}
                    className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center justify-center gap-1 ${
                      addedIds[item.id]
                        ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'border-orange-500 text-orange-500 hover:bg-orange-50'
                    } ${loadingIds[item.id] ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {loadingIds[item.id] && (
                      <span className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>{getButtonLabel(item.id)}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">Add Extra Sides</span>
            </div>
            <div className="space-y-3">
              {sideItems.length === 0 && (
                <p className="text-xs text-gray-400">No extra sides available right now.</p>
              )}
              {sideItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl px-3 py-3 border border-gray-100 hover:border-orange-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/80x80'}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {formatPrice(item.price)}
                    </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddExtra(item)}
                    disabled={isButtonDisabled(item.id)}
                    className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center justify-center gap-1 ${
                      addedIds[item.id]
                        ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'border-orange-500 text-orange-500 hover:bg-orange-50'
                    } ${loadingIds[item.id] ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {loadingIds[item.id] && (
                      <span className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>{getButtonLabel(item.id)}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs text-gray-500">Additional Cost:</span>
              <span className="text-sm font-bold text-orange-500">
                {formatPrice(additionalCost)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 rounded-full bg-orange-500 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomizeMenu
