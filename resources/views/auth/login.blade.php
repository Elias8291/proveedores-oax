<form method="POST" action="{{ route('login') }}">
    @csrf
    
    <!-- Username -->
    <div class="mb-4">
        <label for="username" class="form-label">Nombre de usuario</label>
        <div class="input-group">
            <span class="input-group-text">
                <i class="fas fa-user"></i> <!-- Icono de usuario -->
            </span>
            <input type="text" class="form-control" id="username" name="username" value="{{ old('username') }}" placeholder="Ingresa tu nombre de usuario" required autofocus>
        </div>
        @error('username')
            <div class="text-danger">{{ $message }}</div>
        @enderror
    </div>

    <!-- Password -->
    <div class="mb-4">
        <label for="password" class="form-label">Contraseña</label>
        <div class="input-group">
            <span class="input-group-text">
                <i class="fas fa-lock"></i>
            </span>
            <input type="password" class="form-control" id="password" name="password" placeholder="Ingresa tu contraseña" required>
        </div>
        @error('password')
            <div class="text-danger">{{ $message }}</div>
        @enderror
    </div>

    <!-- Forgot Password link above the submit button -->
    <div class="mb-4">
        @if (Route::has('password.request'))
            <a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('password.request') }}">
                {{ __('¿Olvidaste tu contraseña?') }}
            </a>
        @endif
    </div>

    <!-- Submit Button -->
    <div class="flex items-center justify-end mt-4">
        <button type="submit" class="btn btn-primary w-100">Iniciar sesión</button>
    </div>
</form>
