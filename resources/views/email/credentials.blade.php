<!DOCTYPE html>
<html>
<head>
    <title>Sus credenciales de acceso</title>
</head>
<body>
    <h2>Bienvenido, {{ $user->name }}!</h2>
    <p>Su cuenta ha sido creada exitosamente. Aquí están sus credenciales de acceso:</p>
    
    <p><strong>Usuario:</strong> {{ $username }}</p>
    <p><strong>Contraseña:</strong> {{ $password }}</p>
    
    <p>Le recomendamos cambiar su contraseña después del primer inicio de sesión por razones de seguridad.</p>
    
    <p>Gracias por registrarse!</p>
</body>
</html>