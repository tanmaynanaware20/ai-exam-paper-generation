import PDFDocument from 'pdfkit';

export const generatePDF = async (req, res) => {
  try {
    const { text } = req.body;

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=exam-paper.pdf'
    );

    doc.pipe(res);

    doc.fontSize(18).text('Generated Exam Paper', {
      align: 'center'
    });

    doc.moveDown();

    doc.fontSize(12).text(text);

    doc.end();

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};