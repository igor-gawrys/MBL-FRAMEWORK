
///  MBL SCIPT FRAMEWORK

const mbl = ( innerTo ) => {

let app;
let events = [ ];

window.multi = {
    router: {
        current: {

        }
    }
};

const change = ( event, app ) => {

  events = [ ];

  let value = document.getElementById( event.id ).value;

  let template = blade( event.route.body [ 1 ], app, event.route );

  document.getElementById( innerTo ).innerHTML = template;
  
};

const update = ( ) => {

/* events */

events.filter( ( event ) => {

  let returned =  eval( 'component' + event.route.name + "()" );

  app = returned;

  switch( event.type )
  {
    
    case 'click':

     document.getElementById( event.id ).addEventListener("click", () => {

        let evaled = eval( 'returned.methods.' + event.function + "()" );

     });

     document.getElementById( event.id ).addEventListener("click", () => {

      change( event, app );

      // events.splice( events.indexOf( event ), 1 );

      update();

     });

    break;

    case 'change':

    document.getElementById( event.id ).addEventListener("change", () => {

       let evaled = eval( 'returned.methods.' + event.function + "()" );

    });

    document.getElementById( event.id ).addEventListener("change", () => {

     change( event, app );

     // events.splice( events.indexOf( event ), 1 );

     update();

    });

   break;

   case 'enter':

   document.getElementById( event.id ).addEventListener("keypress", () => {

    var key = e.which || e.keyCode;

    if (key === 13) { 

      let evaled = eval( 'returned.methods.' + event.function + "()" );
      
    }

   });

   document.getElementById( event.id ).addEventListener("keypress", () => {

    var key = e.which || e.keyCode;

    if (key === 13) { 

      change( event, app );

      // events.splice( events.indexOf( event ), 1 );
  
      update();
      
    }

   });

  break;

  case 'model':

    document.getElementById( event.id ).value = eval( "app.data." + event.function );
    
    document.getElementById( event.id ).addEventListener("change", () => {

       eval( 'returned.data.' + event.function + " = " + " '" + document.getElementById( event.id ).value + "' " );

    });

    document.getElementById( event.id ).addEventListener("change", () => {

     // change( event, app );

     // events.splice( events.indexOf( event ), 1 );

     // update();

    });

   break;

  }

  // template = template.match("<body>(.*)</body>") [ 1 ];

  // document.getElementById('app').innerHTML = template;

});

}

const eventPush = ( property, type, blade, template, route ) => {

  blade = template.match("m-" + property + "='(.*)'");

  if( blade != null ) {
 
   let id = 'm-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

   template = template.replace( blade [ 0 ], 'id=' + id );

   let element = blade [ 0 ].match("'(.*)'") [ 1 ];

   events.push( { id: id, function: element, route: route, type: type } );
     
 } 

 blade = template.match("m-" + property + '="(.*)"');

 if( blade != null ) {
        
  let id = 'm-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

  template = template.replace( blade [ 0 ], 'id=' + id );

  let element = blade [ 0 ].match('"(.*)"') [ 1 ];

  events.push( { id: id, function: element, route: route, type: type } );
            
} 

return { blade: blade, template: template };

};

const blade = ( template, app, route ) => {

    let blade;

    while( true ) {

        // Replacing mbl to javascript
    
        template = template.replace( "@if", "{{ if" );
    
        template = template.replace( "):", ") {" );
    
        template = template.replace( "@endif", "} }}" );
    
        template = template.replace( "@else", "} else {" );
    
        blade = template.match("@each.(.*)");
    
        if( blade != null ) {
    
        template = template.replace( blade [ 1 ], '{{ ' + blade [ 1 ].replace( '*', '.filter' ) + ' }}' );
    
        template = template.replace( "@each.", "" );
    
        blade = blade [ 1 ].match("{.(.*).}")
    
         if( blade != null ) {
          
           template = template.replace( blade [ 1 ], 'return '  + blade [ 1 ] );
    
         }
    
        }
  
         // Events 

         let res;

         res = eventPush( 'click', 'click', blade, template, route );

         res = eventPush( 'change', 'change', blade, template, route );

         res = eventPush( 'enter', 'enter', blade, template, route );

         res = eventPush( 'model', 'model', blade, template, route );

         template = res.template;

         blade = res.blade;

         blade = template.match("{{(.*)}}");
    
         if( blade != null ) {
        
         let returned = eval( blade[ 1 ] );
      
         template = template.replace( blade[ 0 ], returned );
         
         } else {

            break;
    
         }
    
    }

    return template;
};

/* functions */

const router = ( route ) => {

    const paths = route.path.split("/");

    paths.filter( ( path ) => {
      if( path [ 0 ] == ":" ) { 

       route.path = route.path.replace( path , location.pathname.split( "/" ) [ 2 ] )

      }
    });

    if ( location.pathname == route.path ) {

        multi.router.current = route;

        let res =  eval( 'component' + route.name + "()" );

        let template = blade( route.body [ 0 ], res, route );

        template = template.match("<body>(.*)</body>") [ 1 ];

        document.getElementById( innerTo ).innerHTML = template;

    } 
};

window.onload = () => {

/* routes */


if ( window.multi.router.current.path == null ) {

    document.getElementById( innerTo ).innerHTML = "404 - not found";

}


update();

}

};
