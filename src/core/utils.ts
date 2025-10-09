export async function importProxied(url: string) {
  const jsContents: string = await new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url,
      onload: (res) => resolve(res.responseText),
      onerror: (err) => reject(err),
    });
  });

  const blob = new Blob([`const window = unsafeWindow;${jsContents}`], { type: "text/javascript" });
  const blobUrl = URL.createObjectURL(blob);

  try {
    const module = await import(blobUrl);
    return module;
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}
