import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2 } from 'lucide-react';

interface BaseFormProps {
    loading?: boolean;
    label: string;
    values?: { name: string, email: string, password: string, confirmPass: string };
    login?: boolean;
    onToggleLogin: () => void;
    onChange: (field: string, value: string) => void;
    onSubmit: () => void;
}
export default function BaseForm({ values, onSubmit, loading, label, login, onChange, onToggleLogin }: BaseFormProps) {
    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.name, e.target.value)
    }

    return (
        <div className="w-3/4 bg-white rounded-xl p-6 shadow-md drop-shadow-md">
            <Label className="text-4xl font-semibold">{label}</Label>
            <p className="font-medium text-sm text-muted-foreground mt-4">
                {login ? 'Please login to your account.' : 'Create an account to get started.'}
            </p>
            {/* body */}
            <div className="flex flex-col gap-4 mt-8">
                {!login && (
                    <div className="flex flex-col gap-3">
                        <Label className="pl-1">Name</Label>
                        <Input value={values?.name || ''} onChange={onChangeValue} name="name" type="text" placeholder="Full Name" className="w-full border-2 border-gray-100 rounded-xl p-4" />
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    <Label className="pl-1">Email</Label>
                    <Input value={values?.email || ''} onChange={onChangeValue} name="email" type="email" placeholder="Email" className="w-full border-2 border-gray-100 rounded-xl p-4" />
                </div>
                <div className="flex flex-col gap-3">
                    <Label className="pl-1">Password</Label>
                    <Input value={values?.password || ''} onChange={onChangeValue} name="password" type="password" placeholder="Password" className="w-full border-2 border-gray-100 rounded-xl p-4" />
                </div>
                {!login && (
                    <div className="flex flex-col gap-3">
                        <Label className="pl-1">Confirm Password</Label>
                        <Input value={values?.confirmPass || ''} onChange={onChangeValue} name="confirm-pass" type="password" placeholder="Confirm your password" className="w-full border-2 border-gray-100 rounded-xl p-4" />
                    </div>
                )}

            </div>
            {/* footer */}
            <div className="flex justify-between mt-4 items-center">
                <div className="flex gap-2">
                    {login && <>
                        <Input onChange={onChangeValue} name="remember" type="checkbox" id='remember' className="size-4" />
                        <Label htmlFor="remember" className="text-xs">Remember me</Label>
                    </>}
                </div>
                <Button variant='link' onClick={onToggleLogin} className="text-xs">
                    {login ? 'No Account?' : 'Already have account?'}
                </Button>
            </div>
            {/* actions */}
            <div className="mt-2">
                {login ?
                    <Button className="w-full mt-4" onClick={onSubmit}>{loading ? <Loader2 className="animate-spin" /> : 'Login'}</Button>
                    : <Button className="w-full mt-4" onClick={onSubmit}>{loading ? <Loader2 className="animate-spin" /> : 'Create Account'}</Button>}
            </div>
        </div>
    )
}
