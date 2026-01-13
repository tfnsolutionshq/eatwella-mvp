import React, { useState } from 'react'
import { FiX, FiDownload } from 'react-icons/fi'
import { sanitizeFilename, openPrintMemo } from '../../utils/exportMemo'
import { exportMemoDocx } from '../../utils/exportDocx'
import logo from '../../assets/SMTLogoBLCK.png'

function ExportModal({ mail, onClose }) {
  const [includeComments, setIncludeComments] = useState(true)
  const [includeReplies, setIncludeReplies] = useState(true)
  const [includeRecipients, setIncludeRecipients] = useState(true)
  const [filename, setFilename] = useState(sanitizeFilename(mail?.subject || 'memo'))
  

  const handleExportPDF = () => {
    openPrintMemo(mail, { includeComments, includeReplies, includeRecipients, logoUrl: logo })
    onClose?.()
  }

  const handleExportDocx = async () => {
    await exportMemoDocx(mail, { includeComments, includeReplies, includeRecipients, filename, logoUrl: logo })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-0 w-full max-w-3xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">EX</div>
            <h3 className="text-sm font-semibold text-gray-900">Export Memo</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File name</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(sanitizeFilename(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Include replies</div>
                    <div className="text-xs text-gray-600">Latest replies thread</div>
                  </div>
                  <button
                    onClick={() => setIncludeReplies(v => !v)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${includeReplies ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}
                  >
                    {includeReplies ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Include comments</div>
                    <div className="text-xs text-gray-600">Reviewer notes</div>
                  </div>
                  <button
                    onClick={() => setIncludeComments(v => !v)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${includeComments ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}
                  >
                    {includeComments ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Include recipients</div>
                    <div className="text-xs text-gray-600">To and CC</div>
                  </div>
                  <button
                    onClick={() => setIncludeRecipients(v => !v)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${includeRecipients ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}
                  >
                    {includeRecipients ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button onClick={handleExportDocx} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 inline-flex items-center gap-2">
                <FiDownload className="w-4 h-4" /> Export DOCX
              </button>
              <button onClick={handleExportPDF} className="px-3 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
                Save as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default ExportModal
