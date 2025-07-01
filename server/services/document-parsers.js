/**
 * Document Parsers for ShatziiOS Curriculum Transformer
 * 
 * This module provides parsers for extracting text content from various file formats:
 * - PDF documents
 * - Word documents (DOCX)
 * - HTML content
 * - Images (using OCR)
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const { exec } = require('child_process');
const execAsync = util.promisify(exec);

// For HTML parsing
const { parse } = require('node-html-parser');
// For DOCX parsing
const mammoth = require('mammoth');
// For PDF parsing
const { PDFExtract } = require('pdf-extract');
const pdfExtract = new PDFExtract();
const extractPDFAsync = util.promisify(pdfExtract.extract.bind(pdfExtract));

/**
 * Extract text from PDF document
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
async function parsePdf(filePath) {
  try {
    const options = {
      type: 'text',  // extract text (as opposed to images)
    };
    
    const data = await extractPDFAsync(filePath, options);
    
    // Combine text from all pages with page breaks
    const textContent = data.pages
      .map((page, index) => {
        return `--- Page ${index + 1} ---\n${page.content.trim()}`;
      })
      .join('\n\n');
    
    return textContent;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Extract text from DOCX document
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<string>} - Extracted text content
 */
async function parseDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({
      path: filePath
    });
    
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
}

/**
 * Extract text from HTML document
 * @param {string} filePath - Path to the HTML file
 * @returns {Promise<string>} - Extracted text content
 */
async function parseHtml(filePath) {
  try {
    const htmlContent = await fs.promises.readFile(filePath, 'utf8');
    const root = parse(htmlContent);
    
    // Remove script and style elements
    root.querySelectorAll('script, style').forEach(el => el.remove());
    
    // Try to extract main content
    const mainContent = root.querySelector('article') || 
                       root.querySelector('main') || 
                       root.querySelector('.content') ||
                       root.querySelector('#content') ||
                       root.querySelector('body');
    
    if (mainContent) {
      return mainContent.textContent.trim().replace(/\\s+/g, ' ');
    }
    
    return root.textContent.trim().replace(/\\s+/g, ' ');
  } catch (error) {
    console.error('Error parsing HTML:', error);
    throw new Error(`Failed to parse HTML: ${error.message}`);
  }
}

/**
 * Extract text from image using OCR (requires Tesseract)
 * @param {string} filePath - Path to the image file
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromImage(filePath) {
  try {
    // Check if Tesseract is installed
    try {
      await execAsync('tesseract --version');
    } catch (error) {
      throw new Error('Tesseract OCR is not installed or not in PATH. Please install Tesseract OCR to extract text from images.');
    }
    
    // Create temporary output file
    const outputFile = path.join(
      path.dirname(filePath),
      `temp_ocr_${path.basename(filePath, path.extname(filePath))}`
    );
    
    // Run Tesseract OCR
    await execAsync(`tesseract ${filePath} ${outputFile}`);
    
    // Read the output text file
    const textFile = `${outputFile}.txt`;
    const text = await fs.promises.readFile(textFile, 'utf8');
    
    // Clean up the temporary file
    await fs.promises.unlink(textFile).catch(() => {});
    
    return text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error(`Failed to extract text from image: ${error.message}`);
  }
}

module.exports = {
  parsePdf,
  parseDocx,
  parseHtml,
  extractTextFromImage
};