import React, { useState, FC } from 'react';
import {Input} from "@/components/ui/input.tsx";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather';
import {eye} from 'react-icons-kit/feather/eye'

interface PasswordInputProps {
    placeholder?: string;
    field: any;
    showPassword: boolean;
    setShowPassword: (showPassword: boolean) => void;
}

export const PasswordInput: FC<PasswordInputProps> = ({ showPassword, setShowPassword, placeholder, field }) => {
    return (
        <div className="relative">
            <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                {...field}
            />
            <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <Icon icon={eye}/> : <Icon icon={eyeOff}/> }
            </button>
        </div>
    );
};
