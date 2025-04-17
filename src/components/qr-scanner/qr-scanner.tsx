// components/QrScanner.tsx
import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box, Button, Typography } from "@mui/material";

interface QrScannerProps {
  onScanSuccess: (text: string) => void;
}
const QrScanner: React.FC<QrScannerProps> = (props) => {
  const { onScanSuccess } = props;
  const qrRef = useRef<Html5Qrcode | null>(null);
  const divId = "qr-reader";

  useEffect(() => {
    const qrCode = new Html5Qrcode(divId);
    qrRef.current = qrCode;
    return () => {
      if (qrRef.current?.isScanning) {
        qrRef.current?.stop?.().catch((err) => {
          console.error("Failed to stop QR scanner", err);
        });
      }
    };
  }, []);

  const onScan = () => {
    const qrCode = qrRef?.current;
    qrCode
      ?.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          qrCode.stop(); // stop scanning after success
          onScanSuccess(decodedText);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_error) => {
          // silently ignore scan errors
          //   console.log("QR scanner failed to scan", error);
        }
      )
      .catch((err) => {
        console.error("QR scanner failed to scan", err);
      });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        component="h1"
        className="w-full bg-gradient-to-r from-red-200 to-red-400 p-3"
      >
        Scan Voucher QR Code
      </Typography>
      <div
        className="my-10 mx-auto"
        id={divId}
        style={{ width: "300px" }}
      ></div>
      <Box className="mt-10">
        <Button variant="contained" color="secondary" onClick={onScan}>
          Start Scan
        </Button>
      </Box>
    </div>
  );
};

export default QrScanner;
