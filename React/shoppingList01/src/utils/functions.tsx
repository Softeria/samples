export function convertMuiIconsTextToJson(text: string): { label: string; code: string }[] {
  // Split the input text by new lines to get each line separately
  const lines = text.split("\n");

  // Map each line to an object with the desired properties
  const result = lines.map((line) => {
    // Extract the code part (the entire line)
    const code = line.trim();

    // Extract the label part (the text before the first space, replacing underscores with spaces)
    const label = code.split(" ")[0].replace(/_/g, " ");

    return {
      label,
      code,
    };
  });

  return result;
}
