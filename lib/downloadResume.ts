// export async function downloadResumeAsPDF(resumeTitle: string = "Resume") {
//   // 1. Get the resume content
//   const resumeElement = document.getElementById("resume-preview");
//   if (!resumeElement) {
//     alert("Resume preview not found");
//     return;
//   }

//   // 2. Open a new window (Popup)
//   // This isolates the print job from your app's CSS conflicts
//   const printWindow = window.open("", "_blank", "width=900,height=800");
//   if (!printWindow) {
//     alert("Please allow popups to print this resume.");
//     return;
//   }

//   // 3. Gather all pages
//   const pages = resumeElement.querySelectorAll(".resume-page");
//   if (pages.length === 0) {
//     printWindow.close();
//     alert(
//       "No pages found. Make sure ModernTemplate has the 'resume-page' class.",
//     );
//     return;
//   }

//   // 4. Copy Styles
//   // We grab all stylesheets (Tailwind, etc.) from your current page
//   // so the resume looks exactly the same in the new window.
//   const styles = Array.from(
//     document.querySelectorAll('link[rel="stylesheet"], style'),
//   )
//     .map((node) => node.outerHTML)
//     .join("");

//   // 5. Build the HTML for the new window
//   // We manually reconstruct the pages to ensure they are A4 and separated correctly
//   let contentHtml = "";
//   pages.forEach((page) => {
//     // We explicitly set styles on the wrapper to ensure A4 compliance
//     // We use outerHTML to copy the entire page content
//     const pageHtml = (page as HTMLElement).outerHTML;
//     contentHtml += pageHtml;
//   });

//   // 6. Write to the new window
//   printWindow.document.write(`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>${resumeTitle}</title>
//         ${styles}
//         <style>
//           /* Force Reset */
//           html, body {
//             margin: 0;
//             padding: 0;
//             background: white;
//             height: auto;
//             overflow: visible;
//           }

//           /* Page Setup */
//           @page {
//             size: A4 portrait;
//             margin: 0;
//           }

//           /* Resume Page Override */
//           /* We ensure these styles take precedence */
//           .resume-page {
//             width: 210mm !important;
//             height: 297mm !important;
//             margin: 0 auto !important;
//             page-break-after: always !important;
//             break-after: page !important;
//             overflow: hidden !important;
//             background: white !important;
//             position: relative !important;
//             box-shadow: none !important;
//           }

//           /* Hide scrollbars */
//           ::-webkit-scrollbar { display: none; }

//           /* Ensure colors print */
//           * {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }
//         </style>
//       </head>
//       <body>
//         ${contentHtml}
//         <script>
//           // Wait a moment for styles/fonts to load, then print
//           window.onload = function() {
//             setTimeout(function() {
//               window.focus();
//               window.print();
//               // Optional: Close window after printing
//               // window.close();
//             }, 500);
//           };
//         </script>
//       </body>
//     </html>
//   `);

//   printWindow.document.close();
// }
