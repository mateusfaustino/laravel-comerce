<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Laravel\Fortify\Fortify;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return new \Illuminate\Http\JsonResponse('', 204);
        }

        /** @var \App\Modules\Authentication\Infrastructure\Persistence\Models\EloquentUserModel|null $user */
        $user = Auth::user();

        if ($user !== null && $user->hasPermission('access_admin_panel')) {
            return redirect()->intended('/admin/dashboard');
        }

        return redirect()->intended(Fortify::redirects('login'));
    }
}
