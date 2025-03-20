<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\PdfToImage\Pdf;
use GuzzleHttp\Client;
use Libern\QRCodeReader\QRCodeReader;

class ScrapingController extends Controller
{
    public function processFiscalDocument(Request $request)
    {
        try {
            $request->validate([
                'constancia_fiscal' => 'required|file|mimes:pdf|max:10000', // Max 10MB
            ]);

            $pdfFile = $request->file('constancia_fiscal');
            $pdfPath = $pdfFile->store('temp_pdfs');

            // Convert PDF to image (first page only)
            $pdf = new Pdf(storage_path('app/' . $pdfPath));
            $imagePath = storage_path('app/temp_images/' . uniqid() . '.jpg');
            $pdf->setPage(1)->saveImage($imagePath);

            // Look for QR code in the image
            $qrResult = $this->scanForQrCode($imagePath);

            // Clean up temporary files
            unlink(storage_path('app/' . $pdfPath));
            unlink($imagePath);

            if ($qrResult && filter_var($qrResult, FILTER_VALIDATE_URL)) {
                // Fetch content from URL
                $pageContent = $this->fetchUrlContent($qrResult);
                return response()->json([
                    'success' => true,
                    'url' => $qrResult,
                    'content' => $pageContent,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No valid QR code with URL found in the document',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing document: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function scanForQrCode($imagePath)
    {
        try {
            $qrCodeReader = new QRCodeReader();
            $qrText = $qrCodeReader->decode($imagePath);
            return $qrText ?: null; // Returns null if no QR code is found
        } catch (\Exception $e) {
            return null;
        }
    }

    private function fetchUrlContent($url)
    {
        $client = new Client();
        try {
            $response = $client->get($url);
            return (string) $response->getBody();
        } catch (\Exception $e) {
            return "Error fetching URL content: " . $e->getMessage();
        }
    }
}