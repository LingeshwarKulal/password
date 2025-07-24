document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    const togglePassword = document.getElementById('togglePassword');
    const copyPassword = document.getElementById('copyPassword');
    const generatePassword = document.getElementById('generatePassword');
    const checkBreaches = document.getElementById('checkBreaches');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    const breachResults = document.getElementById('breachResults');
    const generatorOptions = document.querySelector('.generator-options');
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');

    const requirements = {
        length: document.getElementById('length'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        number: document.getElementById('number'),
        special: document.getElementById('special'),
        noCommon: document.getElementById('noCommon'),
        noSequential: document.getElementById('noSequential')
    };

    // Common passwords list (expanded)
    const commonPasswords = [
        'password', '123456', 'qwerty', 'admin', 'letmein',
        'welcome', 'monkey', 'password123', '12345678', 'abc123',
        '111111', 'baseball', 'dragon', 'master', 'sunshine',
        'ashley', 'bailey', 'passw0rd', 'shadow', 'superman',
        'qazwsx', 'trustno1', 'football', '123123', 'jordan23'
    ];

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.querySelector('i').className = type === 'password' ? 'far fa-eye' : 'far fa-eye-slash';
    });

    // Copy password to clipboard
    copyPassword.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(passwordInput.value);
            showToast('Password copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy password');
        }
    });

    // Generate password button
    generatePassword.addEventListener('click', () => {
        generatorOptions.style.display = generatorOptions.style.display === 'none' ? 'block' : 'none';
        if (generatorOptions.style.display === 'block') {
            generateNewPassword();
        }
    });

    // Password length slider
    passwordLength.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
        generateNewPassword();
    });

    // Generator options change
    document.querySelectorAll('.option-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', generateNewPassword);
    });

    // Check for password breaches
    checkBreaches.addEventListener('click', async () => {
        const password = passwordInput.value;
        if (!password) {
            showToast('Please enter a password first');
            return;
        }

        try {
            // In a real application, you would hash the password and use the HaveIBeenPwned API
            // This is a simplified simulation
            const hasBeenBreached = commonPasswords.includes(password.toLowerCase());
            
            breachResults.className = 'breach-results ' + (hasBeenBreached ? 'warning' : 'safe');
            breachResults.textContent = hasBeenBreached
                ? '⚠️ This password has been found in data breaches. Please choose a different password.'
                : '✅ Good news! This password hasn\'t been found in any known data breaches.';
        } catch (error) {
            showToast('Failed to check password history');
        }
    });

    // Check password strength on input
    passwordInput.addEventListener('input', checkPasswordStrength);

    function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        let feedback = '';

        // Reset requirements
        for (let req in requirements) {
            requirements[req].classList.remove('valid');
            requirements[req].textContent = requirements[req].textContent.replace('✅', '✖️');
        }

        // Hide breach results when password changes
        breachResults.style.display = 'none';

        if (password === '') {
            strengthBar.className = 'strength-bar';
            strengthText.textContent = 'None';
            return;
        }

        // Check if password is in common passwords list
        if (commonPasswords.includes(password.toLowerCase())) {
            requirements.noCommon.classList.remove('valid');
            strengthBar.className = 'strength-bar weak';
            strengthText.textContent = 'Weak (Common Password)';
            return;
        } else {
            requirements.noCommon.classList.add('valid');
            requirements.noCommon.textContent = requirements.noCommon.textContent.replace('✖️', '✅');
            strength += 1;
        }

        // Check for sequential characters
        if (!/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789/i.test(password)) {
            requirements.noSequential.classList.add('valid');
            requirements.noSequential.textContent = requirements.noSequential.textContent.replace('✖️', '✅');
            strength += 1;
        }

        // Check length
        if (password.length >= 8) {
            strength += 1;
            requirements.length.classList.add('valid');
            requirements.length.textContent = requirements.length.textContent.replace('✖️', '✅');
        }

        // Check uppercase
        if (/[A-Z]/.test(password)) {
            strength += 1;
            requirements.uppercase.classList.add('valid');
            requirements.uppercase.textContent = requirements.uppercase.textContent.replace('✖️', '✅');
        }

        // Check lowercase
        if (/[a-z]/.test(password)) {
            strength += 1;
            requirements.lowercase.classList.add('valid');
            requirements.lowercase.textContent = requirements.lowercase.textContent.replace('✖️', '✅');
        }

        // Check numbers
        if (/[0-9]/.test(password)) {
            strength += 1;
            requirements.number.classList.add('valid');
            requirements.number.textContent = requirements.number.textContent.replace('✖️', '✅');
        }

        // Check special characters
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            strength += 1;
            requirements.special.classList.add('valid');
            requirements.special.textContent = requirements.special.textContent.replace('✖️', '✅');
        }

        // Update strength meter
        strengthBar.className = 'strength-bar';
        if (strength < 4) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak';
        } else if (strength < 6) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Medium';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong';
        }
    }

    function generateNewPassword() {
        const length = parseInt(passwordLength.value);
        const useUpper = document.getElementById('genUppercase').checked;
        const useLower = document.getElementById('genLowercase').checked;
        const useNumbers = document.getElementById('genNumbers').checked;
        const useSpecial = document.getElementById('genSpecial').checked;

        let chars = '';
        if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (useNumbers) chars += '0123456789';
        if (useSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!chars) {
            showToast('Please select at least one character type');
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        passwordInput.value = password;
        checkPasswordStrength();
        showToast('New password generated!');
    }

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}); 