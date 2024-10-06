const printReport = function printReport(pages) {
    console.log(' **** report starting **** ');
    Object.entries(pages).sort((a, b) => b[1] - a[1]).forEach(([url, count]) => {
        console.log(`Found ${count} internal links to ${url}`);
    });
};

module.exports = { printReport };

