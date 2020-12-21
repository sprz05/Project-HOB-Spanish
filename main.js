var fontForm = document.getElementById('inputAssignmentTitle');

if(!localStorage.getItem('bgcolor')) {
  populateStorage();
} else {
  setStyles();
}

function populateStorage() {
  localStorage.setItem('font', document.getElementById('inputAssignmentTitle').value);

  setStyles();
}

function setStyles() {
  var currentFont = localStorage.getItem('font');

  document.getElementById('inputAssignmentTitle').value = currentFont;

}

fontForm.onchange = populateStorage;
