   window.onload = function() {
   var currentFont = localStorage.getItem('font');
   var currentColls = localStorage.getItem('collapsibles');

          document.getElementById("assignmentTitle").innerHTML = currentFont;
          document.getElementsByClassName("collapsible").header.innerHTML = collapsibles;
          
          document.getElementById('collapsiblesDiv').innerHTML = currentColls;

};
