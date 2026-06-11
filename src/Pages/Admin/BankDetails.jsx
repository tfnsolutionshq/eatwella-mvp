import React, { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import { FiCreditCard, FiSave, FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";

const BankDetails = () => {
  const [bankDetails, setBankDetails] = useState([
    { bank_name: "", account_name: "", account_number: "" }
  ]);
  const [existingBankDetails, setExistingBankDetails] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingBank, setEditingBank] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    fetchExistingBankDetails();
  }, []);

  const fetchExistingBankDetails = async () => {
    try {
      setFetchLoading(true);
      const { data } = await api.get("/delivery-agent/bank-details");
      setExistingBankDetails(data.data || []);
    } catch (err) {
      console.error("Failed to fetch existing bank details:", err);
      // Don't show error for initial fetch, might be no existing details
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...bankDetails];
    updatedDetails[index][field] = value;
    setBankDetails(updatedDetails);
  };

  const addBankDetail = () => {
    setBankDetails([...bankDetails, { bank_name: "", account_name: "", account_number: "" }]);
  };

  const removeBankDetail = (index) => {
    if (bankDetails.length > 1) {
      const updatedDetails = bankDetails.filter((_, i) => i !== index);
      setBankDetails(updatedDetails);
    }
  };

  const validateForm = () => {
    const errors = [];
    
    bankDetails.forEach((detail, index) => {
      if (!detail.bank_name.trim()) {
        errors.push(`Bank ${index + 1}: Bank name is required`);
      }
      if (!detail.account_name.trim()) {
        errors.push(`Bank ${index + 1}: Account name is required`);
      }
      if (!detail.account_number.trim()) {
        errors.push(`Bank ${index + 1}: Account number is required`);
      } else if (!/^\d{10}$/.test(detail.account_number)) {
        errors.push(`Bank ${index + 1}: Account number must be 10 digits`);
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => showToast(error, "error"));
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Filter out empty entries
      const validDetails = bankDetails.filter(
        detail => detail.bank_name.trim() && detail.account_name.trim() && detail.account_number.trim()
      );      

      // Send the first (and only) bank detail as an object
      await api.post("/delivery-agent/bank-details", validDetails[0]);

      showToast("Bank details saved successfully!", "success");
      
      // Reset form after successful submission
      setBankDetails([{ bank_name: "", account_name: "", account_number: "" }]);
      
      // Refresh existing bank details
      await fetchExistingBankDetails();
      
    } catch (err) {
      console.error("Failed to save bank details:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Failed to save bank details. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditBank = (bank) => {
    setEditingBank(bank);
    setBankDetails([{
      bank_name: bank.bank_name,
      account_name: bank.account_name,
      account_number: bank.account_number
    }]);
  };

  const handleUpdateBank = async (e) => {
    e.preventDefault();
    
    if (!editingBank) return;
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => showToast(error, "error"));
      return;
    }

    try {
      setSubmitLoading(true);
      
      const updatedDetail = bankDetails[0];
      
      await api.put(`/delivery-agent/bank-details/${editingBank.id}`, {
        bank_name: updatedDetail.bank_name,
        account_name: updatedDetail.account_name,
        account_number: updatedDetail.account_number
      });

      showToast("Bank details updated successfully!", "success");
      
      // Reset form and editing state
      setBankDetails([{ bank_name: "", account_name: "", account_number: "" }]);
      setEditingBank(null);
      
      // Refresh existing bank details
      await fetchExistingBankDetails();
      
    } catch (err) {
      console.error("Failed to update bank details:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Failed to update bank details. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteBank = async (bankId) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) {
      return;
    }

    try {
      setDeleteLoading(prev => ({ ...prev, [bankId]: true }));
      
      await api.delete(`/delivery-agent/bank-details/${bankId}`);
      
      showToast("Bank account deleted successfully!", "success");
      
      // Refresh existing bank details
      await fetchExistingBankDetails();
      
    } catch (err) {
      console.error("Failed to delete bank details:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Failed to delete bank details. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [bankId]: false }));
    }
  };

  const handleCancelEdit = () => {
    setEditingBank(null);
    setBankDetails([{ bank_name: "", account_name: "", account_number: "" }]);
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50/50 min-h-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bank Details</h1>
            <p className="text-gray-600">
              Add your bank account information to receive payments for completed deliveries.
            </p>
          </div>

          {/* Existing Bank Details */}
          {fetchLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="p-8 text-center text-gray-500">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiCreditCard className="w-6 h-6 text-gray-400" />
                </div>
                <p>Loading existing bank details...</p>
              </div>
            </div>
          ) : existingBankDetails.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Existing Bank Accounts</h2>
                    <p className="text-sm text-gray-500">Your currently saved bank details</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {existingBankDetails.map((bank, index) => (
                  <div
                    key={bank.id || index}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {bank.bank_name}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Account Name: {bank.account_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Account Number: {bank.account_number}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Added{" "}
                          {new Date(bank.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditBank(bank)}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                          title="Edit bank details"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBank(bank.id)}
                          disabled={deleteLoading[bank.id]}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete bank account"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={editingBank ? handleUpdateBank : handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiCreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {editingBank ? "Update Bank Account" : "Account Information"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {editingBank ? "Edit your bank account details" : "Add one or more bank accounts"}
                      </p>
                    </div>
                  </div>
                  {!editingBank && (
                    <button
                      type="button"
                      onClick={addBankDetail}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium transition"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Another Account
                    </button>
                  )}
                  {editingBank && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {bankDetails.map((detail, index) => (
                  <div key={index} className="relative">
                    {!editingBank && bankDetails.length > 1 && (
                      <div className="absolute -top-2 -right-2">
                        <button
                          type="button"
                          onClick={() => removeBankDetail(index)}
                          className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 hover:bg-red-200 transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Bank Account {index + 1}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            value={detail.bank_name}
                            onChange={(e) => handleInputChange(index, "bank_name", e.target.value)}
                            placeholder="e.g., First Bank, GTBank"
                            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            required
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Account Name
                          </label>
                          <input
                            type="text"
                            value={detail.account_name}
                            onChange={(e) => handleInputChange(index, "account_name", e.target.value)}
                            placeholder="Account holder name"
                            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            required
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Account Number
                          </label>
                          <input
                            type="text"
                            value={detail.account_number}
                            onChange={(e) => handleInputChange(index, "account_number", e.target.value.replace(/\D/g, ""))}
                            placeholder="10-digit account number"
                            maxLength={10}
                            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                <FiSave className="w-4 h-4" />
                {submitLoading ? "Saving..." : (editingBank ? "Update Bank Details" : "Save Bank Details")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BankDetails;
