import React from 'react';
import Barcode from 'react-barcode';

const BarcodeGenerator = ({ value }) => {
  return (
    <div>
      <Barcode 
        value={value} 
        format="CODE128"  // Optional: Specify barcode format
        width={1.5}         // Optional: Width of a single bar
        height={40}      // Optional: Height of the barcode
        displayValue={false} // Show the value text below the barcode
      />
    </div>
  );
};

export default BarcodeGenerator;
