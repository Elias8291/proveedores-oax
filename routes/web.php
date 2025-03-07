<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EconomicActivityController;
use App\Http\Controllers\SettlementController;

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::get('/formulario1', [EconomicActivityController::class, 'showForm'])->name('formulario1');

Route::get('/dashboard', function () {
    $userName = auth()->user()->name;
    return view('admin.home', ['userName' => $userName]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/admin/home', function () {
        return view('admin.home');
    })->name('admin.home');
    Route::resource('users', UserController::class);
    Route::get('/economic-activities/{sector}', [EconomicActivityController::class, 'getActivitiesBySector'])->name('economic_activities.by_sector');
    Route::get('/settlements-by-zipcode', [SettlementController::class, 'getSettlementsByZipCode'])->name('settlements.by_zipcode');
});

Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('register', [RegisteredUserController::class, 'store']);
Route::post('/check-email-exists', [\App\Http\Controllers\Auth\EmailCheckController::class, 'checkExists']);
Route::post('/check-rfc-exists', [RegisteredUserController::class, 'checkRFCExists']);

require __DIR__.'/auth.php';
