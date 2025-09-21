<!-- react.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    <script src="https://maps.googleapis.com/maps/api/js?key={{ env('VITE_GOOGLE_MAPS_API_KEY') }}&libraries=places"></script>
</head>
<body class="bg-gray-100">
    <div id="root"></div>
</body>
</html>