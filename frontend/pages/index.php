<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>U.GG Clone</title>
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
</head>
<body class="bg-gray-900 text-white">

    <!-- Navbar -->
    <nav class="flex justify-between items-center p-6 bg-transparent fixed w-full top-0 z-50">
        <div class="text-2xl font-bold">LP-TRACKER</div>
        <div>
            <button class="bg-red-500 px-4 py-2 rounded-lg">Télechargez</button>
            <button class="bg-blue-600 px-4 py-2 rounded-lg ml-2">Se connecter</button>
        </div>
    </nav>

    <!-- Hero Section (Pleine Hauteur) -->
     
    <section class="relative flex justify-center items-center h-screen bg-cover bg-center"
    style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url('src/img/aurora-background.jpg');">
    
    <!-- Contenu Centré -->
    <div class="relative p-10 rounded-lg text-center w-1/2">
        <h1 class="text-4xl font-bold text-white">LP Tracker</h1>
        <p class="mt-4 text-white">Trackez la personne que vous voulez ! </p>
        <form class="w-full max-w-lg mx-auto mt-6">
            <div class="flex bg-white text-gray-900 p-3 rounded-lg">
                <input type="text" placeholder="Chercher un joueur" class="w-full px-4 py-2 outline-none">
                <button type="submit" class="bg-yellow-500 px-6 py-2 rounded-lg">🔍</button>
            </div>
        </form>
    </div>
</section>


</body>
</html>
