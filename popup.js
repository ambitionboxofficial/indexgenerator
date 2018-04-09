
//var dom = getTocMarkup(document,true);
//alert(document.querySelectorAll('h2, h3').length);

// var markup = getTocMarkup(document);
// // chrome.tabs.getSelected(null, function(tab) {
// //       alert(getTocMarkup(document));
// //     });
// alert("helo");
document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getindex",markdown:true}, function(response) {
      document.getElementById("content").innerHTML = response.data;
    });
  });
}, false);
