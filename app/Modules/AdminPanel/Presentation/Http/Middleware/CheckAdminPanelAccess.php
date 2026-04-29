<?php

namespace App\Modules\AdminPanel\Presentation\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminPanelAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null || ! $user->hasPermission('access_admin_panel')) {
            return Redirect::route('admin.unauthorized');
        }

        return $next($request);
    }
}
