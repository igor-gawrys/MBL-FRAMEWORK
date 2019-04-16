
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const randomstring = require("randomstring");

let blade;
let dom;

exports.blade = ( template, config ) => {

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
    
         blade = template.match("{{(.*)}}");
    
         if( blade != null ) {
    
         let returned = eval( blade[ 1 ] );
      
         template = template.replace( blade[ 0 ], returned );
         
         } else {
    
            break;
    
         }
    
    }

    return template;
}

exports.blade_css = ( body, css ) => {

  while( true ) {

    // body [ 1 ] 
    // css

     let hash_name;
     let hash_css = css.match("{(.*)}") [ 0 ];
     let hash = css.replace( css.match("{(.*)}") [ 0 ], " " );

     if( !hash.includes( '[' ) ) {

     switch ( hash [ 1 ] ) {
       
       case '.':

       hash_name = 'm-' + randomstring.generate(7);

       hash = hash.replace(/ /g,'');

       css = css.replace( hash, hash + '[' + hash_name + ']' );

       let class_var = hash.replace( '.', '' );

       dom = new JSDOM( body [ 1 ] );

       dom.window.document.getElementsByClassName( class_var ) [ 0 ].setAttribute( hash_name, "" );

       body [ 0 ] =  "<body>" + dom.window.document.getElementsByTagName( 'body' )[ 0 ].innerHTML + "</body>";
   
       body [ 1 ] = dom.window.document.getElementsByTagName( 'body' )[ 0 ].innerHTML;

       break;

       case '#':

       hash_name = 'm-' + randomstring.generate(7);

       hash = hash.replace(/ /g,'');

       css = css.replace( hash, hash + '[' + hash_name + ']' );

       let id = hash.replace( '#', '' );

       dom = new JSDOM( body [ 1 ] );

       dom.window.document.getElementsById( id ) [ 0 ].setAttribute( hash_name, "" );

       body [ 0 ] =  "<body>" + dom.window.document.getElementsByTagName( 'body' )[ 0 ].innerHTML + "</body>";
   
       body [ 1 ] = dom.window.document.getElementsByTagName( 'body' )[ 0 ].innerHTML;
       
       break;

       default:
       
       hash_name = 'm-' + randomstring.generate(7);

       hash = hash.replace(/ /g,'');

       css = css.replace( hash, hash + '[' + hash_name + ']' );

       dom = new JSDOM( body [ 1 ] );

       dom.window.document.getElementsByTagName( hash ) [ 0 ].setAttribute( hash_name, "" );

       body [ 0 ] = "<body>" + dom.window.document.getElementsByTagName( 'body' )[ 0 ].innerHTML + "</body>";
   
       body [ 1 ] = dom.window.document.getElementsByTagName( 'body' )[ 0 ].innerHTML;

       break;

     }
     
    } else {

      break;

    }

  }

  return { body: body, css: css };
}