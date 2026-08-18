<?php

use Illuminate\Http\Request;

Route::post('/locale', function (Request $request) {
    $locale = $request->input('locale');
    if (in_array($locale, ['en', 'id'])) {
        session(['locale' => $locale]);
    }
    return response()->json(['success' => true]);
});
