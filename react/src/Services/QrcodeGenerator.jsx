import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeGenerator = ({ value }) => {
  return (
    <div>
      <QRCodeCanvas
        value={value}        // Data to encode in the QR code
        size={100}           // Optional: Size of the QR code
        bgColor="#ffffff"    // Optional: Background color
        fgColor="#000000"    // Optional: Foreground (QR code color)
        level="Q"            // Optional: Error correction level ("L", "M", "Q", "H")
        includeMargin={true} // Optional: Include margin around the QR code
      />
    </div>
  );
};

export default QRCodeGenerator;
