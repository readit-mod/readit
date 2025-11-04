export function DownloadChip({ onClick }: { onClick: () => void }) {
    return (
        <a
            class="button border-md flex flex-row justify-center items-center h-xl font-semibold relative text-12 button-secondary  inline-flex items-center
       px-sm
      "
            style="height: var(--size-button-sm-h); font: var(--font-button-sm)"
            target="_self"
            onClick={onClick}
        >
            <span class="flex items-center">
                <span class="flex text-16 me-[var(--rem6)]">
                    <svg
                        fill="currentColor"
                        height="16"
                        width="16"
                        icon-name="download-outline"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10 1a.75.75 0 01.75.75v8.44l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V1.75A.75.75 0 0110 1zm-5 12.25a.75.75 0 000 1.5h10a.75.75 0 000-1.5H5z"></path>
                    </svg>
                </span>
                <span>Download</span>
            </span>
            <faceplate-screen-reader-content>
                Download
            </faceplate-screen-reader-content>
        </a>
    );
}
