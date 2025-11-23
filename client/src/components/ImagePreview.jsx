import { X } from 'lucide-react';

const ImagePreview = ({ src, onRemove, isStaged = false, className = "" }) => {
  return (
    <div className={`relative group ${className}`}>
      <img 
        src={src} 
        alt="Preview"
        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-700 group-hover:border-accent transition-colors" 
      />
      
      {isStaged && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-primary text-xs px-2 py-1 rounded-br font-bold">
          Pending
        </div>
      )}
      
      <button
        onClick={onRemove}
        type="button"
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        title="Remove image"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ImagePreview;
