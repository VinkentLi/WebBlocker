import psl from 'psl';

const generateSTYLES = () => {
  let css = require('../static/style.css').toString();
  return "<style>"+css+"\n</style>";
};
  
const generateHTML = (pageName) => {
  return `
    <div id="clouds">
      <div class="cloud x1"></div>
      <div class="cloud x1_5"></div>
      <div class="cloud x2"></div>
      <div class="cloud x3"></div>
      <div class="cloud x4"></div>
      <div class="cloud x5"></div>
  </div>
  <div class='c'>
      <div class='_404'>404</div>
      <hr>
      <div class='_1'>GET BACK TO WORK</div>
      <div class='_2'>STUDYING > ${pageName}</div>
  </div>
    `;
};

chrome.runtime.sendMessage({message: "request_block"}, function (response) {
  console.log(response);
  let shouldBlock = response.value;
  console.log("SHOULDBLOCK: ", shouldBlock);
  if (shouldBlock) {
    blockWebsite();
  }
});

function blockWebsite() {
  let sld = psl.parse(window.location.hostname).sld;
  // change twitter to the correct name
  if (sld == 'x') {
    sld = 'twitter';
  }
  document.head.innerHTML = generateSTYLES();
  console.log("innerhtml: ", document.head.innerHTML);
  document.body.innerHTML = generateHTML(sld.toUpperCase());
}
  