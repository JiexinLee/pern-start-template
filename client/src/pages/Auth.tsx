import React from 'react'
import BaseForm from '../components/BaseForm'
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const Auth = () => {
    const { login, signup, token } = useAuth();

    const [loading, setLoading] = React.useState(false)
    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPass, setConfirmPass] = React.useState('')
    const [isLogin, setIsLogin] = React.useState(true)
    const title = isLogin ? 'Welcome Back' : 'Create an Account'

    const onValueChange = (field: string, value: string) => {
        if (field === 'email') setEmail(value)
        if (field === 'password') setPassword(value)
        if (field === 'confirm-pass') setConfirmPass(value)
        if (field === 'name') setName(value)
    }

    const resetForm = () => {
        setEmail('')
        setPassword('')
        setConfirmPass('')
        setName('')
    }

    const onSubmit = async () => {
        setLoading(true)
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(name, email, password, confirmPass);
            }
        } catch {
            toast.error('Invalid username or password')
        } finally {
            setLoading(false)
        }
    }

    if (token) {
        return <Navigate to='/home' />
    }

    return (
        <>
            <div className='w-full flex items-center justify-center lg:w-1/2 bg-gray-200'>
                {<BaseForm
                    login={isLogin}
                    values={{ email, password, confirmPass, name }}
                    loading={loading}
                    onChange={onValueChange}
                    label={title}
                    onToggleLogin={() => {
                        setIsLogin(pre => !pre);
                        resetForm();
                    }}
                    onSubmit={onSubmit}
                />}
            </div>
            <div className='hidden lg:flex lg:flex-col h-full w-1/2 justify-center bg-gray-100 items-center'>
                <p className='text-5xl mb-8'>XXX</p>
                <div className='animate-pulse w-60 h-60 bg-gradient-to-tr from-violet-300 to-rose-500 rounded-full' />
                <div className='-bottom-10 w-1/2 h-1/2 bg-white/10 absolute backdrop-blur-lg' />
            </div>
        </>
    )
}

export default Auth