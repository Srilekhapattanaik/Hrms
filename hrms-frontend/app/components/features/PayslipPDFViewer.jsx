"use client";

// T-19  Payslip preview in a modal, rendered with the "react-pdf" library.
// IMPORTANT: this file must be loaded with next/dynamic and ssr:false (EmployeePayslipHistory does that),
// because react-pdf needs the browser.
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// pdf.js worker (does the PDF parsing in a background thread)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PayslipPDFViewer({ url, title, fileName, onClose }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState(640);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fit = () => setWidth(Math.min(720, Math.max(260, window.innerWidth - 80)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl bg-[#111833] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
          <h3 className="truncate text-base font-semibold text-slate-100">{title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={url}
              download={fileName}
              className="rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-600"
            >
              Download PDF
            </a>
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-900/60 p-4">
          {loadError ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {loadError}
            </p>
          ) : (
            <div className="flex justify-center">
              <Document
                file={url}
                onLoadSuccess={({ numPages: n }) => {
                  setNumPages(n);
                  setPageNumber(1);
                }}
                onLoadError={() =>
                  setLoadError("This file could not be shown as a PDF. Use the Download PDF button.")
                }
                loading={<p className="py-10 text-sm text-slate-400">Loading payslip...</p>}
              >
                <Page
                  pageNumber={pageNumber}
                  width={width}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          )}
        </div>

        {numPages > 1 && (
          <div className="flex items-center justify-center gap-4 border-t border-white/10 px-5 py-3 text-sm text-slate-300">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-white/10 disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-white/10 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
