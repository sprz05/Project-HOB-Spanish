function addAssignmentTitle(){
  var inputAssignmentTitle =  document.getElementById("inputAssignmentTitle").value;
  console.log("Title: " + inputAssignmentTitle)
  document.getElementById("assignmentTitle").innerHTML = inputAssignmentTitle;
}

var currentClosable;
var currentContent;
function selectedColl() {
    document.getElementById("inputTaskDiv").style.display = "block";
    currentClosable = event.target;
    currentContent = currentClosable.nextElementSibling;
    var inputTaskDiv = document.getElementById("inputTaskDiv");
    $(currentContent).append(inputTaskDiv);
}

var taskCounter = 0;
function addTask() {
    var text = document.getElementById("taskInput").value;
    // create a new div element and give it a unique id
    var newTask = $("<div class='currentTask'><input class='checkbox' type='checkbox'><label>" + text + "</label></div>");
    newTask.id = 'temp' + taskCounter;
    taskCounter++
    // and give it some content
    var newContent = document.createTextNode(text);

    $(currentContent).append(newTask); 
    console.log("appended");


  $(".currentTask").hover(
    function() {
      var taskCur = event.target;
      $( this ).find( "a" ).last().remove();
    $(taskCur).append( $( "<a class='taskX'> x</a>" ) );
    
    function dump() {
      $(taskCur).remove();
      
    }
    $( "a" ).on( "click", dump );

    }, function() {
    $( this ).find( "a" ).last().remove();
   });
  document.getElementById("taskInput").value = " ";
}

var elementCounter = 0;
var elementCounterContent = 0;
var text;
function addElement() {
    text = document.getElementById("input").value;
    // create a new div element and give it a unique id

    var newDiv = $("<button class='collapsible' onclick='selectedColl()'>"+text+"</button>");
    $(newDiv).append("<button class='btnDelete'>Delete</button>");
    var newContentOfDiv = $("<div class='content'></div>");

    newDiv.id = 'temp' + elementCounter;
    newContentOfDiv.id = 'content' + elementCounterContent;

    newDiv.classList = "div";
    elementCounter++
    elementCounterContent++
    // and give it some content
    var newContent = document.createTextNode(text);

    // add the newly created element and its content into the DOM

    document.getElementById("input").value = " ";
    $("#divColl").append(newDiv, newContentOfDiv);


    newDiv.click(function () {
        this.classList.toggle("active");
        content = this.nextElementSibling;
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    });
}


function next1(){
  document.getElementById("title").style.display = "none";
  document.getElementById("addSteps").style.display = "block";
}

function next2(){
  document.getElementById("addSteps").style.display = "none";
  document.getElementById("addTasksToSteps").style.display = "block";
}

function next3(){
  document.getElementById("addTasksToSteps").style.display = "none";
  document.getElementById("scheduleDiv").style.display = "block";
}

$("#divColl").on('click', '.btnDelete', function () {
      $(this).closest('.collapsible').remove();
      content.style.display = 'none';
    });


