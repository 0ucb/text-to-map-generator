import React from 'react';
import { X } from 'lucide-react';

const ValidationPanel = ({ validationResults, onConfirm, onCancel }) => {
  return (
    <div className="bg-yellow-50 border-b p-4 border-l-4 border-yellow-400">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-yellow-800 mb-1">⚠️ Validation Results</h3>
          <p className="text-sm text-yellow-700">Please review the following issues before adding to your map:</p>
        </div>
        <button
          onClick={onCancel}
          className="text-yellow-600 hover:text-yellow-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Critical Issues */}
        {validationResults.issues.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <h4 className="font-medium text-red-800 mb-2">🚫 Critical Issues (Must Fix)</h4>
            <ul className="space-y-1">
              {validationResults.issues.map((issue, index) => (
                <li key={index} className="text-sm text-red-700">
                  • {issue.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Warnings */}
        {validationResults.warnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ Warnings (Review Recommended)</h4>
            <ul className="space-y-1">
              {validationResults.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-700">
                  • {warning.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Duplicates */}
        {validationResults.duplicates.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <h4 className="font-medium text-blue-800 mb-2">🔄 Potential Duplicates</h4>
            <ul className="space-y-1">
              {validationResults.duplicates.map((dup, index) => (
                <li key={index} className="text-sm text-blue-700">
                  • {dup.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onConfirm}
          disabled={validationResults.issues.length > 0}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {validationResults.issues.length > 0 ? 'Fix Issues First' : 'Proceed Anyway'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancel & Edit Text
        </button>
      </div>
      
      <div className="mt-3 text-xs text-gray-600">
        <strong>💡 Tips:</strong> Use specific names ("Rocky Mountains" not "mountains"), 
        connect cities with roads/highways, and place geographic features near relevant locations.
      </div>
    </div>
  );
};

export default ValidationPanel;