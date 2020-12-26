 /* Simple utility to generate semi-random string IDs */
            const uniqid=function(l=6){
                let t=[];
                for(i=0;i<l;i++)t.push(seed());
                return t.join('-');
            };
            const seed=function(){
                return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
            };
            /*
                I wrote this a couple of years ago just to simplify
                the process of working with localStorage...
            */
            const StoreFactory=function( name, type ){
                'use strict';
                const engine = !type || type.toLowerCase() === 'local' ? localStorage : sessionStorage;
                
                const set=function( data ){
                    engine.setItem( name, JSON.stringify( data ) );
                };
                const get=function(){
                    return exists( name ) ? JSON.parse( engine.getItem( name ) ) : false;
                };
                const remove=function(){
                    engine.removeItem( name );
                };
                const exists=function(){
                    return engine.getItem( name )==null ? false : true;
                };
                const create=function(){
                    if( !exists() ) set( arguments[0] || {} );
                };
                const save=function(){
                    set( get() );
                };
                return Object.freeze({
                    set,
                    get,
                    save,
                    exists,
                    create,
                    remove
                });
            };
            const create=function(t,a,p){
                try{
                    /*
                        t:type ~ the DOM Node type. null for default 'div'
                        a:attributes ~ object literal of attributes to asign to the node
                        p:parent ~ the parent to which the node will be appended. null to negate.
                    */
                    let el = ( typeof( t )=='undefined' || t==null ) ? document.createElement('div') : document.createElement(t);
                    let _arr=['innerHTML','innerText','html','text'];
                    for( let x in a ) if( a.hasOwnProperty( x ) && !~_arr.indexOf( x ) ) el.setAttribute( x, a[ x ] );
                    if( a.hasOwnProperty('innerHTML') || a.hasOwnProperty('html') ) el.innerHTML=a.innerHTML || a.html;
                    if( a.hasOwnProperty('innerText') || a.hasOwnProperty('text') ) el.innerText=a.innerText || a.text;
                    if( p!=null ) typeof( p )=='object' ? p.appendChild( el ) : document.getElementById( p ).appendChild( el );
                    return el;
                }catch( err ){
                    console.error( err.message );
                }
            };
            

            
            
            
            
            
            
            
            
            
            
            
            
            /***********************************************************
                I know there are many jQuery methods that can be used
                for to accomplish the things done here but I don't use
                it so I don't know ~ hence using vanilla javascript
            */
            document.addEventListener('DOMContentLoaded',function(){
                /*************************************************
                    Create the storage object that will be used
                    to keep track of "collapsibles" and tasks.
                    
                    The individual "collapsible" items that the
                    user creates will be stored within this store
                    using a unique key defined in the `addelement`
                    method.
                    
                    That unique ID is used as a dataset attribute
                    for certain DOM elements which allows the store
                    to be used later to reconstruct the "collapsibles"
                    when the page is reloaded.
                    
                    The structure for the generated store will be of
                    the following form:
                    
                    store={
                        key1:{title:'The name of the "collapsible',tasks:['an array','of all','the tasks']},
                        key2:{title:'Another "collapsible"',tasks:['fly','me','to','the','moon']}
                    }
                    etc
                */
               
                 let oStore=new StoreFactory( 'collapsible' );
                    oStore.create();
                    
                let payload=oStore.get();

                let parent=document.getElementById('divColl');
                let oText=document.getElementById('input');
                let oTask=document.getElementById('inputTaskDiv');
                let oBttn=document.querySelector('input#input + button');

                
                


                const buildElement=function( parent, id, text ){
                    /*
                        generate the HTML structure as originally used
                        and return the "Content" node for chaining to
                        other calls later.
                    */
                    let bttn=create('button',{'class':'collapsible','data-id':id},parent);
                    create('span',{'class':'text','text':text},bttn);
                    create('button',{'class':'btnDelete','text':'Delete'},bttn);
                    return create('div',{'class':'content','data-id':id},parent);
                };
                
                const buildTask=function( parent, id, text ){
                    /*
                        Construct the HTML content for individual tasks
                        and return a refernce to this new content so that
                        it may be used in chaining if required.
                        
                    */
                    let div=create('div',{'class':'currentTask'},parent);
                    create('input',{'type':'checkbox','name':'task[]','value':text},div);
                    create('span',{'class':'text','text':text},div);
                    return div;
                };
                
                function addelement( event ) {
                    let id=uniqid( 8 );
                    let text=oText.value.trim();
                    
                    if( text!='' ){
                        /* generate new content and append a clone of the input field + button */
                        appendclone( buildElement( parent,id, text ) );
                        
                        /* prepare the data to be stored in localStorage */
                        var payload=oStore.exists() ? oStore.get() : {};
                            payload[ id ]={ 'title':text, 'tasks':[] };
                            
                        /* save the data */
                        oStore.set( payload );
                    }
                    oText.value='';
                    return false;
                };
                
                function addtask( event ) {
                    /* The text data comes from the cloned input element that was inserted */
                    let input=event.target.previousElementSibling;
                    let text =input.value.trim();
                    if( text !='' ){
                        
                        let parent = event.target.parentNode.parentNode;
                        let id = parent.dataset.id;
                        
                        let div=buildTask.call( this, parent, id, text );
                        /*************************************
                            Save the task to the appropriate
                            place within the store. We use the
                            parentNode to work up the DOM Tree to
                            find the dataset ID which forms the 
                            key in the store.
                        */
                        let data=oStore.get();
                        var payload=data.hasOwnProperty( id ) ? data[ id ] : { title:parent.previousElementSibling.querySelector('span').textContent, tasks:[] }
                            payload.tasks.push( text );

                        // rebuild data for updating store
                        data[ id ]=payload;
                        
                        // save the updated store
                        oStore.set( data );
                        /************************************/
                        
                        input.value='';
                        return div;
                    }
                    return false;
                };
                
                
                
                
                
                /*********************************************
                    rebuild the display using stored values
                    ...events handled by delegated listeners 
                */
                Object.keys( payload ).forEach( id => {
                    let text=payload[ id ].title;
                    let tasks=payload[ id ].tasks;
                    // add the "collapsible" to the DOM
                    let content=buildElement.call( this, parent, id, text );
                    
                    tasks.forEach( text => {
                        // Add the tasks to the "collapsible"
                        buildTask.call( this, content, id, text );
                    });
                });

                /*************************************************************************************
                    Newly generated content has event listeners assigned above in the original jQuery
                    code. However any content generated on PageLoad as the localStorage is processed
                    will NOT have these listeners assigned - to my mind using `delegated event handlers`
                    on a suitable parent container would be a better approach as the same listeners
                    would work equally well for new content and existing.
                */
                
                function deleteelement(e){
                    /*
                        Delete the entire "collapsible" from both
                        the DOM and from localStorage
                    */
                    let id=e.target.parentNode.dataset.id;
                    parent.querySelectorAll( '[data-id="'+id+'"]' ).forEach( n=>{
                        parent.removeChild(n)
                    });
                    
                    let data=oStore.get();
                    delete data[ id ];
                    oStore.set( data );
                };
                function deletetask(e){
                    /*
                        Delete specific "Task" from a "Collapsible"
                        - from both the DOM and from localStorage
                    */
                    let id=e.target.parentNode.parentNode.dataset.id;
                    let task=e.target.parentNode;
                    
                    // remove the DOM element
                    task.parentNode.removeChild( task );
                    
                    // remove this item from the store
                    let data=oStore.get();
                        data[ id ].tasks.splice( data[ id ].tasks.indexOf( task ),1 );
                    // save it
                    oStore.set( data );
                };
                function appendclone(n){
                    /*
                        Append a cloned version of the
                        input field and button that are
                        used to add a new task.
                    */
                    if( !n.querySelector('#newtask') ){
                        let clone=oTask.cloneNode(true);
                            clone.id='newtask';
                            clone.style.display='block';
                        n.insertBefore(clone,n.firstChild);
                    }
                    return true;
                };
                function appendclonehref(id,n){
                    /*
                        Append a cloned version of the hyperlink
                        that is used to delete and individual task.
                        The clone is placed at the respective node
                        in the DOM via the delegated "mouseover"
                        handler in conjunction with a "mouseout"
                    */
                    if( !n.querySelector( 'a#'+id ) ){
                        let a=document.getElementById('deltask');
                        let clone=a.cloneNode( true );
                            clone.id=id;
                            clone.addEventListener('click',deletetask)
                        n.appendChild( clone );
                    }
                };
                
                function displaytasks(e){
                    /*
                        Ensure that the "Content" is visible/hidden
                        dependant upon clicking the button. The cloned
                        version of the text field + insert button are
                        added in this method
                    */
                    let content=e.target.nextElementSibling
                        content.style.display=content.style.display=='block' ? 'none' : 'block';
                    return appendclone( content );
                };
                
                function mouseoverhandler(e){
                    /*
                        delegated event handler to intercept and process
                        the "mouseover[out]" events and modify the DOM
                        appropriately.
                    */
                    if( e.target.tagName=='DIV' && e.target!=e.currentTarget ){
                        
                        let id='del-x-task';
                        let expr='a#'+id;
                        
                        if( e.target.className=='currentTask' ){
                            if( e.type=='mouseover' && !e.target.querySelector( expr ) ){
                                e.target.parentNode.querySelectorAll( expr ).forEach(a=>{
                                    a.parentNode.removeChild(a);
                                });
                                appendclonehref( id, e.target );
                            }
                        }
                        if( e.type=='mouseout' && e.target.className!='currentTask' ){
                            e.target.parentNode.querySelectorAll( expr ).forEach(a=>{
                                a.parentNode.removeChild(a);
                            });
                        }
                    }
                };

                
                function clickhandler(e){
                    /*
                        delegated event handler to intercept and process
                        "Click" events on buttons.
                    */
                    if( e.target.tagName == 'BUTTON' ){
                        switch( e.target.className ){
                            case 'btnDelete': return deleteelement.call(this,e);
                            case 'collapsible': return displaytasks.call(this,e);
                            case 'addtask': return addtask.call(this,e);
                        }
                    }   
                };
                
                
                /********************************
                    Delegated event listeners
                */
                parent.addEventListener('click',clickhandler);
                parent.addEventListener('mouseover',mouseoverhandler);
                parent.addEventListener('mouseout',mouseoverhandler);
                /***********************************************************
                    Because the "Make Collapsible" button is outwith 
                    the Parent DIV we cannot use the same delegated listener 
                    or a listener bound to the same parent
                */
                oBttn.addEventListener('click',addelement);
            });

            function addAssignmentTitle(){
              var inputAssignmentTitle =  document.getElementById("inputAssignmentTitle").value;
              console.log("Title: " + inputAssignmentTitle)
              document.getElementById("assignmentTitle").innerHTML = inputAssignmentTitle;
            }


                    var fontForm = document.getElementById('inputAssignmentTitle');

        function populateStorage() {
          localStorage.setItem('font', document.getElementById('inputAssignmentTitle').value);
          setStyles();
          }

        function setStyles() {
          var currentFont = localStorage.getItem('font');

          document.getElementById('inputAssignmentTitle').value = currentFont;
          document.getElementById("assignmentTitle").innerHTML = currentFont;
        }

        fontForm.onchange = populateStorage;

         window.onload = function() {
   var currentFont = localStorage.getItem('font');

  document.getElementById("assignmentTitle").innerHTML = currentFont;          
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
  document.getElementById("fullProject").classList.add("articleCenter");
}

function hideAllIntstructions(){
  document.getElementById("title").style.display = "none";
  document.getElementById("addSteps").style.display = "none";
  document.getElementById("addTasksToSteps").style.display = "none";
}


function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function back1(){
                    document.getElementById("title").style.display = "block";
                    document.getElementById("addSteps").style.display = "none";
                }

function back2(){
            document.getElementById("addTasksToSteps").style.display = "none";
            document.getElementById("addSteps").style.display = "block";
        }

function showEditProjectConsole(){ 
  document.getElementById("img1").style.display = "none";
  document.getElementById("img2").style.display = "none";
  document.getElementById("img3").style.display = "none";
  document.getElementById("taskToSteps").style.display = "none";
  document.getElementById("title").style.display = "block";
  document.getElementById("hideWalkthroughBtn").style.display = "none";
  document.getElementById("walkthroughBtn").style.display = "block";
}

function walkThroughShow(){
  document.getElementById("img1").style.display = "block";
  document.getElementById("img2").style.display = "block";
  document.getElementById("img3").style.display = "block";
  document.getElementById("title").style.display = "block";
  document.getElementById("walkthroughBtn").style.display = "none";
  document.getElementById("hideWalkthroughBtn").style.display = "block";
}


function hideWalkThrough(){
  document.getElementById("fullProject").classList.add("articleCenter");
  document.getElementById("title").style.display = "none";
  document.getElementById("walkthroughBtn").style.display = "block";
  document.getElementById("hideWalkthroughBtn").style.display = "none";
} 