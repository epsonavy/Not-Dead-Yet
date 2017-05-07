function start() {
    var xmlhttp = new XMLHttpRequest();
    var contentDiv = document.getElementById("msg");
    var email = document.getElementById("e-mail");
    var emails = document.getElementById("to-notify");
    var msg = document.getElementById("message");
    xmlhttp.open("POST", "/save", true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        contentDiv.innerHTML = xmlhttp.responseText;
        //var headers = xmlhttp.getAllResponseHeaders();
        //contentDiv.innerHTML += headers.replace(/\n/g, "<br>");
      }
    }

    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("email="+email.value+"&emails="+emails.value+"&message="+msg.value);
}


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validate() {
  $("#result").text("");
  var email = $("#to-notify").val();
  if (validateEmail(email)) {
    $("#result").text(email + " is valid :)");
    $("#result").css("color", "green");
  } else {
    $("#result").text(email + " is not valid :(");
    $("#result").css("color", "red");
  }
  return false;
}

$("#validate").bind("click", validate);