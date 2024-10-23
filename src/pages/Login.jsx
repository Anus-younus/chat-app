import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { emailRegex } from '../constants';
import { auth, signInWithEmailAndPassword } from '../config/firebase';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
}));

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                navigate('/chat');
            })
            .catch((err) => console.log(err));
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '39rem', backgroundColor: '#f5f5f5' }}>
            <Box sx={{ width: { xs: '90%', sm: '80%', md: '60%', lg: '40%' }, borderRadius: 2 }}>
                <Item>
                    <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "16px" }}>Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ marginBottom: "16px" }}>
                            <TextField
                                {...register("email", {
                                    required: "Please enter email",
                                    pattern: {
                                        value: emailRegex,
                                        message: "Please enter a valid email"
                                    }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                size="small"
                                fullWidth
                                color="warning"
                                label="Email address"
                                variant="outlined"
                            />
                        </div>
                        <div style={{ marginBottom: "16px" }}>
                            <TextField
                                {...register("password", {
                                    required: "Please enter password",
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                type='password'
                                size="small"
                                fullWidth
                                color="warning"
                                label="Password"
                                variant="outlined"
                            />
                        </div>
                        <div style={{ marginBottom: "16px" }}>
                            <Button type='submit' fullWidth color="warning" variant="contained">LOGIN</Button>
                        </div>
                        <div style={{ marginTop: "8px" }}>
                            Don't have an account? 
                            <Link to={'/register'} style={{ color: "#3B82F6", marginLeft: "4px" }}>Register now</Link>
                        </div>
                    </form>
                </Item>
            </Box>
        </Box>
    );
}

export default LoginPage;
