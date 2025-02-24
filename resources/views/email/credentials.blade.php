<!DOCTYPE html>
<html>
<head>
    <title>Sus credenciales de acceso</title>
</head>
<body>
    <h2>¡Bienvenido, {{ $user->name }}!</h2>
    
    <p>Su cuenta ha sido creada con éxito. A continuación, encontrará sus credenciales de acceso:</p>
    
    <div style="background-color: #f5f9fc; border-left: 4px solid #800000; padding: 15px; margin: 20px 0;">
        <p><strong>🔹 Usuario:</strong> {{ $username }}</p>
        <p><strong>🔑 Contraseña temporal:</strong> {{ $password }}</p>
    </div>

    <p>Por motivos de seguridad, le recomendamos cambiar su contraseña después de su primer inicio de sesión.</p>
    
    <p>Si tiene alguna duda o requiere asistencia, no dude en contactarnos.</p>
    
    <p>Gracias por unirse a nuestra plataforma. ¡Esperamos brindarle la mejor experiencia!</p>
</body>
</html>
