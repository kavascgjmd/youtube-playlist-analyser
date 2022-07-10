const { error } = require("console");
const puppeteer = require('puppeteer');
(async () => {
 try{
    const openbrowserpromise = await puppeteer.launch({headless:false});
   const browsepages = await openbrowserpromise.newPage();
   await browsepages.goto('https://www.google.com/');
   await browsepages.waitForSelector(".gLFyf.gsfi");
   
   await browsepages.type(".gLFyf.gsfi","hi");
   
   


 }
 catch(error){
  console.log(error);
 }
})()