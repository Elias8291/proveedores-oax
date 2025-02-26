<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\View\View;
use App\Models\User; // Importa el modelo User
use App\Models\PersonData; // Importa el modelo PersonData

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): View
    {
        return view('auth.forgot-password');
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'rfc' => ['required', 'string', 'max:13'], 
        ]);

    
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'El correo electrónico no está registrado.',
            ])->withInput($request->only('email', 'rfc'));
        }

        $personData = PersonData::where('user_id', $user->id)
                                ->where('rfc', $request->rfc)
                                ->first();

        if (!$personData) {
            return back()->withErrors([
                'rfc' => 'El RFC no coincide con el correo electronico.',
            ])->withInput($request->only('email', 'rfc'));
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status == Password::RESET_LINK_SENT
                    ? back()->with('status', __($status))
                    : back()->withInput($request->only('email'))
                            ->withErrors(['email' => __($status)]);
    }
}