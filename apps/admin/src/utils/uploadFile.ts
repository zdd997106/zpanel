// ---------

export interface UploadFileOptions {
  multiple?: boolean;
  accept?: string;
}

export function uploadFile({ multiple, accept }: UploadFileOptions = {}) {
  return new Promise<FileList | null>((resolve) => {
    const element = document.createElement('input');

    // Set up element attributes

    element.setAttribute('type', 'file');
    if (multiple) element.setAttribute('multiple', '');
    if (accept) element.setAttribute('accept', accept);

    // Set up listeners and trigger click event for uploading files

    element.click();
    element.onchange = (event) => resolve((event.target as HTMLInputElement).files);
    element.oncancel = () => resolve(null);
  });
}
