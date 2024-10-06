const { argv } = require("node:process");
const { crawlPage, pages } = require("./crawl");
const { printReport } = require('./report');
console.log("hello world");
function main() {
  argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });

  args = argv.slice(2);
  if (args.length < 1) {
    console.log("one command line argument is required!");
  } else if (args.length > 1) {
    console.log("no more than one command line argument is allowed");
  } else {
    console.log(`starting crawl! Beginning with: ${args[0]}`);
    crawlPage(args[0]).then(() => {
        printReport(pages);
    });
  }
}

main();
