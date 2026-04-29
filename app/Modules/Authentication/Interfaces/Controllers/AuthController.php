<?php

namespace App\Modules\Authentication\Interfaces\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Authentication\Application\DTOs\LoginDTO;
use App\Modules\Authentication\Application\DTOs\RegisterDTO;
use App\Modules\Authentication\Application\UseCases\LoginUseCase;
use App\Modules\Authentication\Application\UseCases\RegisterUseCase;
use App\Modules\Authentication\Interfaces\Requests\LoginRequest;
use App\Modules\Authentication\Interfaces\Requests\RegisterRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class AuthController extends Controller
{
    public function __construct(
        private LoginUseCase $loginUseCase,
        private RegisterUseCase $registerUseCase,
    ) {}

    /**
     * Display the login view.
     */
    public function showLoginForm(Request $request)
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming login request.
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        $dto = new LoginDTO(
            email: $request->validated('email'),
            password: $request->validated('password'),
            remember: $request->boolean('remember'),
        );

        $user = $this->loginUseCase->execute($dto);

        if ($user === null) {
            throw ValidationException::withMessages([
                'email' => [trans('auth.failed')],
            ]);
        }

        Auth::loginUsingId($user->getId(), $dto->remember);

        $request->session()->regenerate();

        return redirect()->intended(config('fortify.home'));
    }

    /**
     * Display the registration view.
     */
    public function showRegisterForm()
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function register(RegisterRequest $request): RedirectResponse
    {
        $dto = new RegisterDTO(
            name: $request->validated('name'),
            email: $request->validated('email'),
            password: $request->validated('password'),
        );

        $user = $this->registerUseCase->execute($dto);

        Auth::loginUsingId($user->getId());

        return redirect(config('fortify.home'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
