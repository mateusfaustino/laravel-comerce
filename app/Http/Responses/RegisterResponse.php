<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Fortify;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return new \Illuminate\Http\JsonResponse('', 201);
        }

        /** @var \App\Modules\Authentication\Infrastructure\Persistence\Models\EloquentUserModel|null $user */
        $user = Auth::user();

        if ($user !== null && $user->hasPermission('access_admin_panel')) {
            return redirect()->intended('/admin/dashboard');
        }

        return redirect()->intended(Fortify::redirects('register'));
    }
}
