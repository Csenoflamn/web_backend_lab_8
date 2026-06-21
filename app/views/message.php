<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($title) ?></title>
    <link rel="stylesheet" href="/styles/zerostyles.css">
    <link rel="stylesheet" href="/styles/style.css">
</head>
<body>
    <div style="max-width:600px; margin:50px auto; padding:30px; background:#181823; color:white; border-radius:8px;">
        <h1><?= htmlspecialchars($title) ?></h1>
        <p><?= $message ?></p>
        <p><a href="/" style="color:#5221E6;">Вернуться на главную</a></p>
    </div>
</body>
</html>
