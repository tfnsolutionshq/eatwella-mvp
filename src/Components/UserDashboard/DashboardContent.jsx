import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="">
      <main className="flex-1 px-4 md:px-6 py-10">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
            <p className="text-sm text-gray-500 mb-4">
              You do not have any recent orders yet.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold"
            >
              Start an Order
            </Link>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold mb-1">Track an Order</h3>
              <p className="text-xs text-gray-500 mb-3">
                Already ordered? Track the status in real time.
              </p>
              <Link
                to="/track-order"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-orange-500 text-orange-500 text-xs font-semibold hover:bg-orange-50"
              >
                Track Order
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold mb-1">Account</h3>
              <p className="text-xs text-gray-500 mb-3">
                Update your details and manage preferences.
              </p>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}

export default Dashboard

