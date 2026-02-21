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
    if (loadingIds[item.id]) return
    
    if (addedIds[item.id]) {
      setAddedIds(prev => ({ ...prev, [item.id]: false }))
      const price = Number(item.price || 0)
      if (!Number.isNaN(price)) {
        setAdditionalCost(prev => Math.max(0, prev - price))
      }
      return
    }
    
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
    if (addedIds[itemId]) return 'Remove'
    return 'Add'
  }

  const isButtonDisabled = (itemId) => {
    return Boolean(loadingIds[itemId])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-br from-orange-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Customize Your Order</h2>
            <p className="text-sm text-gray-600 mt-1">
              Add extras to {baseItem.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-4 pb-6 space-y-5 overflow-y-auto flex-1">
          <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-gray-900">Complimentary Water</span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-green-700 bg-green-200 px-2 py-1 rounded-full">
                  FREE
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white border border-green-200 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">50cl Bottled Water</p>
                  <p className="text-xs text-green-600 font-semibold">Included with order</p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-600 text-white shadow-sm">
                ✓ Included
              </span>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span className="text-base font-bold text-gray-900">Choose Your Drink</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
            </div>
            <div className="space-y-2">
              {drinkItems.length === 0 && (
                <p className="text-xs text-gray-400">No drinks available at the moment.</p>
              )}
              {drinkItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl px-4 py-3 border-2 border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/80x80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-orange-600 font-semibold mt-0.5">
                        +{formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddExtra(item)}
                    disabled={isButtonDisabled(item.id)}
                    className={`min-w-[80px] px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                      addedIds[item.id]
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    } ${loadingIds[item.id] ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {loadingIds[item.id] && (
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>{getButtonLabel(item.id)}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span className="text-base font-bold text-gray-900">Add Extra Sides</span>
              </div>
            </div>
            <div className="space-y-2">
              {sideItems.length === 0 && (
                <p className="text-xs text-gray-400">No extra sides available right now.</p>
              )}
              {sideItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl px-4 py-3 border-2 border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/80x80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-orange-600 font-semibold mt-0.5">
                        +{formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddExtra(item)}
                    disabled={isButtonDisabled(item.id)}
                    className={`min-w-[80px] px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                      addedIds[item.id]
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    } ${loadingIds[item.id] ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {loadingIds[item.id] && (
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>{getButtonLabel(item.id)}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-4 border-t-2 border-gray-100">
            <div className="flex items-center justify-between mb-5 px-1 bg-orange-50 rounded-xl p-4">
              <span className="text-sm font-semibold text-gray-700">Additional Cost:</span>
              <span className="text-lg font-bold text-orange-600">
                {formatPrice(additionalCost)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-3.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3.5 rounded-xl bg-orange-500 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
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
