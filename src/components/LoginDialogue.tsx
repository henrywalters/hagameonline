import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { confirmPasswordReset, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, verifyPasswordResetCode } from 'firebase/auth';
import { loadingStore, userStore } from '../lib/auth-store';

enum Mode {
    Login,
    Signup,
    ForgotPassword,
    ResetPassword,
}

function EmailPasswordForm({btnTitle, onSubmit, error}: {btnTitle: string, error: string | null, onSubmit: (email: string, password: string) => void}) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const submit = (e: any) => {
        e.preventDefault();
        onSubmit(email, password);
    }

    return (
        <form onSubmit={submit}>
            <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                type="email" 
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div className='mt-3'>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            {
                error && <p className='text-sm text-red-600 text-center mt-3'>{error}</p>
            }
            
            <button 
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-5"
            >
                {btnTitle}
            </button>
        </form>
    )
}

function LoginForm({setMode}: {setMode: (mode: Mode) => void}) {

    const [error, setError] = useState<string | null>(null);

    const submit = async (email: string, password: string) => {
        setError(null);
        try {
            const credentials = await signInWithEmailAndPassword(auth, email, password);
            const token = await credentials.user.getIdToken();

            document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict`;

            const params = new URLSearchParams(window.location.search);

            if (params.has('redirect_to')) {
                location.replace(`/${params.get('redirect_to')}`)
            } else {
                location.replace('/');
            }
        } catch (error: any) {
            setError("Invalid Credentials");
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <EmailPasswordForm btnTitle='Login' onSubmit={submit} error={error}/>
            <div className="mt-4 text-center">
                <button 
                    onClick={(e) => setMode(Mode.Signup)}
                    className="text-blue-500 hover:underline text-sm"
                >
                    Don't have an account? Sign up
                </button>
            </div>
            <div className="mt-4 text-center">
                <button onClick={(e) => setMode(Mode.ForgotPassword)} id="forgot_password" className="text-blue-500 hover:underline text-sm">Forgot Password</button>
            </div>
        </div>
    )
}

function SignupForm({setMode}: {setMode: (mode: Mode) => void}) {

    const [error, setError] = useState<string | null>(null);

    const submit = async (email: string, password: string) => {
        setError(null);
        try {
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            const token = await credentials.user.getIdToken();

            document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict`;

            const params = new URLSearchParams(window.location.search);

            if (params.has('redirect_to')) {
                location.replace(`/${params.get('redirect_to')}`)
            } else {
                location.replace('/');
            }
        } catch (error: any) {
            setError("Invalid Credentials");
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <EmailPasswordForm btnTitle='Sign Up' onSubmit={submit} error={error} />
            <div className="mt-4 text-center">
                <button 
                    onClick={(e) => setMode(Mode.Login)}
                    className="text-blue-500 hover:underline text-sm"
                >
                    Already have an Account? Login
                </button>
            </div>
        </div>
    )
}

function ForgotPasswordForm({setMode}: {setMode: (mode: Mode) => void}) {

    const [email, setEmail] = useState<string>('');
    const [sent, setSent] = useState<boolean>(false);

    const submit = async (e: any) => {
        e.preventDefault();
        await sendPasswordResetEmail(auth, email, {
            url: window.location.href,
            handleCodeInApp: false,
        })
        setSent(true);
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            {
                sent && 
                <p className='text-green-600'>Reset Email Sent - Check Your Email</p>
            }
            {
                !sent && 
                <div>
                    <form onSubmit={submit}>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input 
                            type="email" 
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-5"
                        >
                            Reset Password
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <button 
                            onClick={(e) => setMode(Mode.Login)}
                            className="text-blue-500 hover:underline text-sm"
                        >
                            Remembered your Password? Login
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

function ResetPasswordForm({oobCode, setMode}: {oobCode: string, setMode: (mode: Mode) => void}) {

    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: any) => {
        setError(null);
        e.preventDefault();
        try {
            const email = await verifyPasswordResetCode(auth, oobCode);
            await confirmPasswordReset(auth, oobCode, password);
            const credentials = await signInWithEmailAndPassword(auth, email, password);
            const token = await credentials.user.getIdToken();

            document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict`;

            const params = new URLSearchParams(window.location.search);

            if (params.has('redirect_to')) {
                location.replace(`/${params.get('redirect_to')}`)
            } else {
                location.replace('/');
            }
        } catch (error: any) {
            setError(error.message);
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

            <form onSubmit={submit}>

                <div className='mt-3'>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                {
                    error && <p className='text-sm text-red-600 text-center mt-3'>{error}</p>
                }
                
                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-5"
                >
                    Reset Password
                </button>
            </form>
            <div className="mt-4 text-center">
                <button 
                    onClick={(e) => setMode(Mode.Login)}
                    className="text-blue-500 hover:underline text-sm"
                >
                    Remembered your Password? Login
                </button>
            </div>
        </div>
    )
}

export default function Login() {
    const [mode, setMode] = useState<Mode>(Mode.Login);
    const [oobCode, setOobCode] = useState<string>('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has('oobCode')) {
            setOobCode(params.get('oobCode')!);
            setMode(Mode.ResetPassword);
        }
    }, [])

    onAuthStateChanged(auth, async (user) => {
        userStore.set(user);
        loadingStore.set(false);

        if (user) {
            // User is logged in
            const token = await user.getIdToken();
            document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict`;
            location.replace('/');
        }
    });

    return (
        <div id="auth-container" className="max-w-md mx-auto p-6">
            <div id="auth-form" className="bg-white rounded-lg shadow-lg p-8">
                {
                    mode === Mode.Login && <LoginForm setMode={setMode} />
                }
                {
                    mode === Mode.Signup && <SignupForm setMode={setMode}/>
                }
                {
                    mode === Mode.ForgotPassword && <ForgotPasswordForm setMode={setMode}/>
                }
                {
                    mode === Mode.ResetPassword && <ResetPasswordForm setMode={setMode} oobCode={oobCode} />
                }
            </div>
        </div>
    )
}