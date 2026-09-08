function parseCSV(csv) {
    const lines = csv.trim().split("\n");

    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
        const values = line.split(",");
        const obj = {};

        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim();
        });

        return obj;
    });
}

module.exports = parseCSV;