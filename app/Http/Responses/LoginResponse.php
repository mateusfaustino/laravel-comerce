<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        /** @var \App\Modules\Authentication\Infrastructure\Persistence\Models\EloquentUserModel|null $user */
        $user = Auth::user();

        if ($user !== null && $user->hasPermission('access_admin_panel')) {
            return redirect()->intended('/admin/dashboard');
        }

        return redirect()->intended(Fortify::redirects('login'));
    }
}
