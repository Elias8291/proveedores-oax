<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EconomicActivityController;
use App\Http\Controllers\SettlementController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('welcome');
Route::get('/formulario1', function () {
    return view('formularios.formulario1');
})->name('formulario1');

// Cambia esta línea para que use la vista admin.home
Route::get('/dashboard', function () {
    $userName = auth()->user()->name; // Obtener el nombre del usuario autenticado
    return view('admin.home', ['userName' => $userName]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('register', [RegisteredUserController::class, 'store']);
Route::post('/check-email-exists', [\App\Http\Controllers\Auth\EmailCheckController::class, 'checkExists']);
Route::get('/admin/home', function () {
    return view('admin.home');
})->name('admin.home');

Route::post('/check-rfc-exists', [RegisteredUserController::class, 'checkRFCExists']);
Route::resource('users', UserController::class);

Route::get('/formulario1', [EconomicActivityController::class, 'showForm'])->name('formulario1');

// Ruta para obtener actividades económicas por sector (AJAX)
Route::get('/economic-activities/{sector}', [EconomicActivityController::class, 'getActivitiesBySector'])
    ->name('economic_activities.by_sector');
    Route::get('/settlements-by-zipcode', [SettlementController::class, 'getSettlementsByZipCode'])
    ->name('settlements.by_zipcode');
    
require __DIR__.'/auth.php';
