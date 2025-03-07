<form method="POST" action="{{ route('login') }}">
    @csrf
    
    <!-- Username -->
    <div class="mb-4">
        <label for="username" class="form-label">Nombre de usuario</label>
        <div class="input-group">
            <span class="input-group-text">
                <i class="fas fa-user"></i>
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
            <span class="input-group-text">
                <i class="fas fa-eye" id="togglePassword" style="cursor: pointer;"></i>
            </span>
        </div>
        @error('password')
            <div class="text-danger">{{ $message }}</div>
        @enderror
    </div>

    <!-- Forgot Password -->
    <div class="mb-4">
        @if (Route::has('password.request'))
            <a class="text-sm text-gray-600 hover:text-gray-900 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('password.request') }}">
                {{ __('¿Olvidaste tu contraseña?') }}
            </a>
        @endif
    </div>

    <!-- Submit Button -->
    <div class="flex items-center justify-end mt-4">
        <button type="submit" class="btn btn-primary w-100">Iniciar sesión</button>
    </div>
</form>

<script>
    document.getElementById('togglePassword').addEventListener('click', function () {
        const passwordInput = document.getElementById('password');
        const icon = this;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
</script>
