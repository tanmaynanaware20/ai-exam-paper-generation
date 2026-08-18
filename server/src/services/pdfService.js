import pdfParse from 'pdf-parse';
import fs from 'fs';

/**
 * Extract clean text from PDF file buffer or path
 */
export async function extractTextFromPDF(filePathOrBuffer) {
  try {
    let dataBuffer;
    if (typeof filePathOrBuffer === 'string') {
      dataBuffer = fs.readFileSync(filePathOrBuffer);
    } else {
      dataBuffer = filePathOrBuffer;
    }

    const pdfData = await pdfParse(dataBuffer);
    const rawText = pdfData.text || '';

    // Clean text: remove excessive whitespace and unprintable characters
    const cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Scanned PDF detection heuristic: if page count > 0 but text character count is extremely low
    const pageCount = pdfData.numpages || 1;
    const isScanned = cleanedText.length < (pageCount * 50);

    return {
      text: cleanedText,
      pageCount,
      isScanned,
      info: pdfData.info
    };
  } catch (error) {
    console.error('PDF Parsing Error:', error.message);
    throw new Error('Failed to parse PDF document: ' + error.message);
  }
}
