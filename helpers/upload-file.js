
const path           = require("path")
const { v4: uuidv4 } = require("uuid")

const fileUpload = ( files, validExtentions = ['png', 'jpg', 'jpeg', 'gif']/**Extensiones que permito */, folder = '' /**Para subir a otra carpeta */ ) => {

    return new Promise( ( resolve, reject ) => {
        
     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
     const { file } = files;
     const cutName = file.name.split('.');
     const extention = cutName[ cutName.length -1 ]; //Obtengo el último dato
 
     //Validar la extesión 
     if( !validExtentions.includes( extention ) ) {
         return reject( `La extensión ${ extention } no es permitida, ${ validExtentions }` );
     }
 
     //Cambiando el nombre al archivo para que tenga nombres distintos
     const temporeryName = uuidv4() + '.' + extention;
     const uploadPath = path.join(  __dirname , '../uploads/', folder, temporeryName );
   
     // Use the mv() method to place the file somewhere on your server
     file.mv(uploadPath, (err) => {
       if (err) return reject( err );
   
       resolve( temporeryName );
     });

    });
}

module.exports = {

    fileUpload
}