import React from 'react';
import { Button } from '../../components/ui/button'
import { useAuth } from '../../context/AuthProvider';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Home = () => {
    const { logout, token, user } = useAuth();
    const [loading, setLoading] = React.useState(false)
    if (!token) {
        return <Navigate to='/auth' />
    }

    const onLogout = async () => {
        setLoading(true)
        await logout()
        setLoading(false)
    }
    return (
        <div className='w-full h-screen flex flex-col gap-8 justify-center items-center'>
            <p className='text-5xl'>Hello there {user?.name}</p>
            <Button onClick={onLogout}>{loading ? <Loader2 className='animate-spin' /> : 'Logout'}</Button>
        </div>
    )
}

export default Home