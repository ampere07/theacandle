import React from 'react';
import { Check } from 'lucide-react';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ isOpen, onClose, productName }) => {
  if (!isOpen) return null;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 transform transition-all">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 rounded-full p-2">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Added to Cart!</h3>
            <p className="text-sm text-gray-500">{productName} has been added to your cart</p>
          </div>
        </div>
      </div>
    </div>
  );
}