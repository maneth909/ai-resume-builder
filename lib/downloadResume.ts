/**
 * Downloads the resume as PDF by creating a print-optimized view
 * @param resumeTitle - The title/filename for the PDF
 */
export async function downloadResumeAsPDF(resumeTitle: string = "Resume") {
  try {
    // Get the resume preview element
    const resumeElement = document.getElementById("resume-preview");

    if (!resumeElement) {
      throw new Error("Resume preview element not found");
    }

    // Clone the resume
    const clone = resumeElement.cloneNode(true) as HTMLElement;

    // Create a temporary container for print
    const printContainer = document.createElement("div");
    printContainer.id = "print-container";
    printContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 9999;
      overflow: hidden;
      display: none;
    `;

    // Style the cloned resume for print
    clone.style.cssText = `
      width: 210mm !important;
      min-height: auto !important;
      margin: 0 auto !important;
      padding: 0 !important;
      background: white !important;
      transform: none !important;
      scale: 1 !important;
      box-shadow: none !important;
      overflow: visible !important;
    `;

    // Get all resume pages
    const pages = clone.querySelectorAll(".w-\\[210mm\\].h-\\[297mm\\]");

    console.log(`Found ${pages.length} pages to print`);

    // Style each page for proper printing - FIXED to maintain full height
    pages.forEach((page, index) => {
      const pageEl = page as HTMLElement;
      pageEl.style.cssText = `
        width: 210mm !important;
        height: 297mm !important;
        min-height: 297mm !important;
        max-height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        transform: none !important;
        scale: 1 !important;
        box-shadow: none !important;
        page-break-after: ${index < pages.length - 1 ? "always" : "auto"} !important;
        break-after: ${index < pages.length - 1 ? "page" : "auto"} !important;
        display: block !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      `;

      // Remove any scaling from child elements
      const allElements = pageEl.querySelectorAll("*");
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (
          htmlEl.style.transform &&
          htmlEl.style.transform.includes("scale")
        ) {
          htmlEl.style.transform = "none";
        }
        if (htmlEl.style.scale) {
          htmlEl.style.scale = "1";
        }
      });
    });

    // Add the clone to the print container
    printContainer.appendChild(clone);

    // Add print container to body
    document.body.appendChild(printContainer);

    // Create print-specific styles
    const printStyles = document.createElement("style");
    printStyles.id = "print-specific-styles";
    printStyles.textContent = `
      @media print {
        /* Hide everything */
        body * {
          visibility: hidden;
        }
        
        /* Show only print container */
        #print-container,
        #print-container * {
          visibility: visible;
        }
        
        /* Remove body scrollbar */
        html, body {
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 210mm !important;
          height: auto !important;
        }
        
        /* Position print container */
        #print-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 210mm !important;
          height: auto !important;
          display: block !important;
          background: white !important;
          overflow: visible !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Style the resume clone */
        #print-container > * {
          width: 210mm !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          scale: 1 !important;
          overflow: visible !important;
        }
        
        /* Ensure all pages maintain full A4 height */
        #print-container .w-\\[210mm\\].h-\\[297mm\\] {
          width: 210mm !important;
          height: 297mm !important;
          min-height: 297mm !important;
          max-height: 297mm !important;
          box-sizing: border-box !important;
        }
        
        /* Ensure page breaks work */
        .print\\:break-after-page,
        #print-container [style*="page-break-after"] {
          page-break-after: always !important;
          break-after: page !important;
        }
        
        /* Configure page */
        @page {
          size: A4 portrait;
          margin: 0;
        }
        
        /* Ensure colors print */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(printStyles);

    // Show the print container
    printContainer.style.display = "block";

    // Set document title
    const originalTitle = document.title;
    document.title = resumeTitle;

    // Small delay to ensure styles are applied
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Trigger print
    window.print();

    // Cleanup after print dialog closes
    setTimeout(() => {
      const container = document.getElementById("print-container");
      if (container && container.parentNode) {
        document.body.removeChild(container);
      }
      const styleEl = document.getElementById("print-specific-styles");
      if (styleEl && styleEl.parentNode) {
        document.head.removeChild(styleEl);
      }
      document.title = originalTitle;
    }, 1000);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Clean up on error
    const container = document.getElementById("print-container");
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
    const styleEl = document.getElementById("print-specific-styles");
    if (styleEl && styleEl.parentNode) {
      document.head.removeChild(styleEl);
    }
    throw error;
  }
}
