function doPoll() {
  var tableBody = "";
  var labelStatus = "";
  $.get("https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json",
    function(data) {

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          //document.write("<p>" + data[key].name + "</p>");  
          if (Number(data[key].parkingStatus.availableCapacity) < 150) {
            labelStatus = "label-danger";
          } else if (Number(data[key].parkingStatus.availableCapacity) < 300) {
            labelStatus = "label-warning";
          } else {
            labelStatus = "label-success";
          }
          tableBody += "<tr>" +
            "<th>" + Number(Number(key) + 1) + "</th>" +
            "<td>" + data[key].name + "</td>" +
            "<td><span class=\"label " + labelStatus + "\">" + data[key].parkingStatus.availableCapacity + "</span></td>" +
            "</tr>";
        }
      }

      document.getElementById("tablePrint").innerHTML = tableBody;
      setTimeout(doPoll, 5000);
    });
}

function showInfoTableParking() {
  var moreInfoContent = document.getElementById("more-info-content");
  if (moreInfoContent.style.display !== "block") {
    document.getElementById("more-info-toggle").innerHTML = "Minder info";
    moreInfoContent.style.display = "block";
  } else {
    document.getElementById("more-info-toggle").innerHTML = "Meer info";
    moreInfoContent.style.display = "none";
  }
}

$(document).ready(function() {
  doPoll();
});