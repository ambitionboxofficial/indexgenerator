
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action == "getindex"){
      var markup = getTocMarkup(document,request.markdown);
      sendResponse({data: markup});
    }
});

function getHeaderLevel(header) {
    return Number(header.nodeName.slice(-1));
}

function createTocMarkup(headers) {
    var prevLevel = 0;
    var output = "";
    var counter = [1,1,1,1];
    var indentation = "";
    var dynamicCounter = 0;
    var tabs = "";
    headers.forEach(function(h) {
        var currLevel = getHeaderLevel(h) - 2;
        if(currLevel > prevLevel){
          counter[currLevel] = 1;
        }
        tabs = "&#09;".repeat(currLevel);
        output += `${tabs}${counter[currLevel]}. [${h.innerText}](#${h.id})<br/>`;   
        counter[currLevel]++;
        prevLevel = currLevel;       
    });
    return output;
}
function createHtmlIndex(headers){
  var prevLevel = 1;
  var output = "";

  headers.forEach(function(h) {
      var currLevel = getHeaderLevel(h);
      if (currLevel > prevLevel) {
          var ranOnce = false;
          while (currLevel > prevLevel) {
              if (ranOnce) {
                  output += "&nbsp;";
              }
              output += "<ol style=\"margin-bottom:0px\"><li>";
              prevLevel += 1;
              ranOnce = true;
          }
      } else if (currLevel == prevLevel) {
          output += "</li><li>";
      } else if (currLevel < prevLevel) {
          while (currLevel < prevLevel) {
              output += "</li></ol>";
              prevLevel -= 1;
          }
          output += "<li>";
      }

      output += `<a href="#${h.id}">${h.innerText}</a>`;
  });

  if (output != "") {
      // Change 2 to the max header level you want in the TOC; in my case, H2
      while (prevLevel >= 2) {
          output += "</li></ol>";
          prevLevel -= 1;
      }
      output = `<h2 class="widget-title">Table of Contents</h2><div style="margin-left:-10px">${output}</div>`;
  }

  return output;
}
// makes the innet html of unwanted doms as empty string
function getMainDom(docOrign){
  var doc = docOrign.cloneNode(true);
  var unwantedTags = ["aside","footer","header"];
  for (var i = unwantedTags.length - 1; i >= 0; i--) {
    try {
      var elements = doc.getElementsByTagName(unwantedTags[i]);
      for (var i = elements.length - 1; i >= 0; i--) {
        elements[i].innerHTML = '';
      }
    }
    catch(e){
    }
  }
  return doc;
}

function getTocMarkup(document,markdown = false) {
    body = getMainDom(document);
    // Add or remove header tags you do (or don't) want to include in the TOC
    var headers = body.querySelectorAll('h2, h3');

    // Change the number to 1 if you want headers no matter what.
    // Or if you want at least 3 headers before generating a TOC, change it to 3.
    if (headers.length >= 2) {
        return markdown ? createTocMarkup(headers) : createHtmlIndex(headers);
    } else {
        return "";
    }
}