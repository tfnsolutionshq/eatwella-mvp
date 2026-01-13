import React, { useRef, useState } from 'react'
import { FiArrowLeft, FiChevronRight, FiUpload, FiCheck, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function RecordExternalAttachments() {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const inputRef = useRef(null)

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).map((f) => ({ name: f.name, size: f.size, type: f.type }))
    setFiles((prev) => [...prev, ...arr])
  }

  const onDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e) => { e.preventDefault() }
  const removeFile = (name) => { setFiles((prev) => prev.filter((f) => f.name !== name)) }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-4 lg:py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4">
        <FiArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Record External Memo</h1>
      <p className="text-gray-600 text-sm mt-1">Record incoming memo from external organization</p>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center sm:flex-nowrap flex-wrap gap-4 sm:gap-6 overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center"><FiCheck className="w-3.5 h-3.5" /></span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Metadata</p>
                <p className="text-xs text-gray-600">Basic information</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-green-600">
              <span className="w-8 h-px bg-green-600"></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Attachments</p>
                <p className="text-xs text-gray-600">Upload files (optional)</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-gray-400">
              <span className="w-8 h-px bg-gray-200"></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center">3</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Assignment</p>
                <p className="text-xs text-gray-600">Department & officer</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-green-600">
              <span className="w-8 h-px bg-green-600"></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center">4</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Review</p>
                <p className="text-xs text-gray-600">Confirm details</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 h-1 rounded-full">
          <div className="bg-black h-1 rounded-full" style={{ width: '50%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div>
          <p className="text-sm font-semibold text-gray-900">Attachments</p>
          <p className="text-xs text-gray-600">Upload files (optional)</p>
        </div>

        <div onDrop={onDrop} onDragOver={onDragOver} className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 bg-[#F3F3F5] flex flex-col items-center justify-center text-center">
          <FiUpload className="w-8 h-8 text-gray-500" />
          <p className="mt-2 text-sm font-medium text-gray-900">Upload Attachments</p>
          <p className="text-xs text-gray-600">Drag and drop files here, or click to browse</p>
          <button className="mt-4 px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg" onClick={() => inputRef.current?.click()}>
            Choose Files
          </button>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          <p className="mt-2 text-xs text-gray-500">Supports: PDF, DOC, DOCX, XLS, XLSX, images</p>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-900">Attached Files ({files.length})</p>
            <div className="mt-2 space-y-2">
              {files.map((f) => (
                <div key={f.name} className="flex items-center justify-between bg-[#F3F3F5] rounded-lg px-3 py-2">
                  <div className="text-sm text-gray-900">{f.name}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600">{(f.size / 1024).toFixed(2)} KB</span>
                    <button className="text-gray-600 hover:text-gray-900" onClick={() => removeFile(f.name)}>
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg" onClick={() => navigate('/record-external-memo')}>Previous</button>
          <button className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg flex items-center gap-2" onClick={() => navigate('/record-external-assignment')}>
            Next
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
