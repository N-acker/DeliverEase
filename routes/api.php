<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UberDirectController;
use App\Http\Controllers\DataBaseController;

Route::get('/stores', [DataBaseController::class, 'getAllStores']); // set up a controller class for calling form database for best practice
Route::get('/menu-items', [DataBaseController::class, 'getAllMenuItems']);
// Route::get('/menu-items', fn() => MenuItem::all()); this is how it was before

Route::post('/uber/quote', [UberDirectController::class, 'getQuote']);
Route::post('/uber/book', [UberDirectController::class, 'bookDelivery']);
// Route::post('/uber/webhook', [UberDirectController::class, 'webhook']);
Route::get('/test-uber', [UberDirectController::class, 'testUber']);