import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { emailRegex } from '../constants';
import { auth, setDoc, db, doc, createUserWithEmailAndPassword } from '../config/firebase';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3), // Increased padding for better aesthetics
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: theme.shadows[3],
}));

function SignupPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (res) => {
                await setDoc(doc(db, "users", res.user.uid), { ...data, uid: res.user.uid });
                navigate("/login");
                reset();
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '39rem', backgroundColor: '#f5f5f5' }}>
            <Item sx={{ width: { xs: '90%', sm: '80%', md: '60%', lg: '40%' }, borderRadius: 2 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ padding: 10 }}>
                        <h2 style={{ marginBottom: '16px' }}>Register</h2>
                        <div style={{ marginBottom: 10 }}>
                            <TextField
                                {...register("full_name", { required: "Please enter full name" })}
                                error={!!errors.full_name}
                                helperText={errors.full_name?.message}
                                size="small"
                                fullWidth
                                color="warning"
                                label="Full name"
                                variant="outlined"
                            />
                        </div>
                        <div style={{ marginBottom: 10 }}>
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
                        <div style={{ marginBottom: 10 }}>
                            <TextField
                                {...register("password", { required: "Please enter password" })}
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
                        <div style={{ marginBottom: 10 }}>
                            <Button type='submit' fullWidth color="warning" variant="contained">REGISTER</Button>
                        </div>
                        <div>
                            Already have an account? <Link to={'/login'}>Login now</Link>
                        </div>
                    </div>
                </form>
            </Item>
        </Box>
    );
}

export default SignupPage;
