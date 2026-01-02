export interface ResumeDownloadProps {
  /** URL to the resume PDF file */
  url: string
}

/**
 * ResumeDownload
 * Terminal-styled button to download resume PDF
 */
export function ResumeDownload({ url }: ResumeDownloadProps) {
  return (
    <a
      href={url}
      download
      className="
        inline-flex items-center gap-2 px-4 py-2
        bg-terminal-accent/10 hover:bg-terminal-accent/20
        border border-terminal-accent rounded
        text-terminal-accent font-mono text-sm
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-terminal-accent focus:ring-offset-2 focus:ring-offset-terminal-bg
      "
      data-testid="resume-download"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span>Download Resume (PDF)</span>
    </a>
  )
}
