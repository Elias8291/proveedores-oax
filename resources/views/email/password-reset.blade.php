<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer tu contraseña</title>
    <!-- Cargando la fuente Montserrat desde Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Montserrat', sans-serif; /* Cambiado a Montserrat */
            line-height: 1.6;
            color: #000000; /* Color del texto en negro */
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #800000 0%, #a52a2a 100%);
            color: white;
            padding: 25px;
            text-align: center;
        }
        .header h1 {
            margin: 0 auto;
            font-size: 24px;
            font-weight: 600;
            max-width: 90%;
        }
        .content {
            padding: 30px;
        }
        .content p {
            font-size: 18px;
            margin-bottom: 20px;
            color: #000000; /* Color negro */
        }
        .content .info-box {
            background-color: #f5f9fc;
            border-left: 4px solid #800000;
            padding: 15px;
            margin: 20px 0;
        }
        .content .info-box p {
            margin-top: 0;
            font-size: 16px;
            color: #000000; /* Color negro */
        }
        .content .info-box ul {
            padding-left: 20px;
        }
        .content .info-box li {
            margin-bottom: 10px;
            list-style-type: none;
            color: #000000; /* Color negro */
        }
        .content .btn {
            display: inline-block;
            background-color: #800000;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            text-align: center;
        }
        .footer {
            background-color: #f5f9fc;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .footer p {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Restablecer tu contraseña</h1>
        </div>
        
        <div class="content">
            <p>Estimado usuario,</p>
            
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no fuiste tú, por favor ignora este mensaje.</p>

            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>

            <div style="text-align: center; margin: 25px 0;">
                <a href="{{ $resetUrl }}" class="btn">Restablecer contraseña</a>
            </div>

            <p>Si tienes problemas con el enlace, copia y pega el siguiente URL en tu navegador:</p>
            <p><a href="{{ $resetUrl }}">{{ $resetUrl }}</a></p>
            
            <p>Atentamente,<br>
            <strong>Secretaría de Administración</strong><br>
            Gobierno del Estado de Oaxaca</p>
        </div>
        
        <div class="footer">
            <p>Este es un mensaje automático, por favor no respondas. Si necesitas ayuda, contáctanos a través de nuestros canales oficiales.</p>
            <p>&copy; 2025 Secretaría de Administración - Gobierno del Estado de Oaxaca. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
