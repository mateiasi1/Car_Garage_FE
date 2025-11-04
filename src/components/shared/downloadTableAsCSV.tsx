

// Function to convert array of objects to CSV format
const convertToCSV = (data: any[]) => {
    const header = Object.keys(data[0]).join(',') + '\n';
    const csv = data.map(item => Object.values(item).join(',')).join('\n');
    return header + csv;
};

// Function to trigger CSV download
const downloadCSV = (data: any, filename: string) => {
    try {
        const csvContent = convertToCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (err) {
        console.error('Error generating CSV:', err);
    }
};

export default downloadCSV;
