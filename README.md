# WebServer + RestServer + SocketServer

El presente respositorio cuenta con un <strong>RestServer</strong> completo que va desde la creación de usarios hasta su respectivo login. En la parte de producto se manejan productos y cada producto pertenece a una categoría.

Para la parte de <strong> SocketServer </strong> cuenta con un chat que puede ser utilizado únicamente por usuarios que están autenticados, se puede enviar mensajes a un chat global o un mensaje privado a un usuario específico. Los sockets utilizan tokens(JWT) para su respectiva validación.

Para la base de datos fue utilizado <strong>MONGO</strong>. El server cuenta con las siguientes APIS:
<ul>
  <li>
    Crud de usuarios
  </li>
  <li>
    Crud de categorías
  </li>
  <li>
    Crud de productos
  </li>
  <li>
    Carga de imagenes y archivos tanto para productos como para usuarios
  </li>
</ul>
  
Estas apis necesitan un token y algunas peticiones pueden ser realizadas únicamente por usuario con un "ADMIN_ROLE".

Recuerden que deben de ejecutar ```npm install``` para reconstruir los módulos de Node, para la parte de las variables de entorno deben crear una conneción con Mongo atlas https://www.mongodb.com/atlas/database, para que pongan sus propias credenciales, igualmente con la autenticación de Google.
  
En el siguiente enlace se encuentra la documentación completa de cada uno de los endpoints: https://documenter.getpostman.com/view/9621510/SztK2QTq
