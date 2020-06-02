import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { Formik, Form } from "formik";
import * as yup from "yup";
import RentalDataService from "./RentalDataService";
import MenuItem from "@material-ui/core/MenuItem";
import Alert from "@material-ui/lab/Alert";


let RentalSchema = yup.object().shape({
    description:
        yup.string()
            .required("Required")
            .max(60, "Max 60 characters."),
    rentalDate:
        yup.date()
            .required("Required")
            .max(yup.ref("returnDate"), "Rental date must be before return"),
    returnDate:
        yup.date()
            .required("Required")
            .min(yup.ref("rentalDate"), "Return date must be after rental"),
    machine:
        yup.object()
            .typeError("Required"),
    customer:
        yup.object()
            .typeError("Required"),
});

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        height: 40,
        margin: theme.spacing(2, 0, 1),
    },
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
}));


export const AddRentalAdmin = () => {
    const classes = useStyles();
    const [creatingResponse, setCreatingResponse] = useState(0);
    const [machines, setMachines] = useState([]);
    const [customers,setCustomers] = useState([]);

    useEffect(() => {
        getAllMachines();
        getAllCustomers();
    }, []);


    const getAllMachines = () => {
        RentalDataService.getAllMachines().then(response => setMachines(response.data))
    };

    const getAllCustomers = () => {
        RentalDataService.getAllCustomers().then(response => setCustomers(response.data))
    };


    return(
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Add rental
                </Typography>
                <Formik
                    initialValues={{
                        customer: null,
                        machine: null,
                        description: "",
                        rentalDate: "",
                        returnDate: "",
                    }}
                    validationSchema={RentalSchema}
                    onSubmit={values => {
                        RentalDataService.createRental(values.description, values.rentalDate, values.returnDate, values.machine, values.customer).then(response => {setCreatingResponse(response.data)})}}
                >

                    {({errors, handleChange, touched }) => (
                        <Form className={classes.form}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        error={Boolean(errors.description) && touched.description}
                                        name="description"
                                        label="Description"
                                        onChange={handleChange}
                                        style={{minWidth:400}}
                                        helperText=
                                            {errors.description && touched.description
                                                ? errors.description : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        error={Boolean(errors.rentalDate) && touched.rentalDate}
                                        name="rentalDate"
                                        label="Rental Date"
                                        type="date"
                                        onChange={handleChange}
                                        style={{minWidth:400}}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        helperText=
                                            {errors.rentalDate && touched.rentalDate
                                                ? errors.rentalDate : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        error={Boolean(errors.returnDate) && touched.returnDate}
                                        name="returnDate"
                                        label="Return Date"
                                        type="date"
                                        onChange={handleChange}
                                        style={{minWidth:400}}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        helperText=
                                            {errors.returnDate && touched.returnDate
                                                ? errors.returnDate : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        error={Boolean(errors.machine && touched.machine)}
                                        name="machine"
                                        select
                                        label="Machine"
                                        onChange={handleChange}
                                        helperText=
                                            {errors.machine && touched.machine
                                                ? errors.machine : "Select machine to rent"}
                                        style={{minWidth:400}}
                                    >
                                        {machines.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        error={Boolean(errors.customer && touched.customer)}
                                        name="customer"
                                        select
                                        label="Customer"
                                        onChange={handleChange}
                                        helperText=
                                            {errors.customer && touched.customer
                                                ? errors.customer :"Renting customer"}
                                        style={{minWidth:400}}

                                    >
                                        {customers.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option.login}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                {(creatingResponse === -1) ? <Grid item xs={12}><Alert severity="error">Machine is not available in selected dates!</Alert> </Grid>: null}
                                {creatingResponse === -2 ? <Grid item xs={12}><Alert severity="error">Machine not found!</Alert> </Grid>: null}
                                <Grid item xs={12} className={classes.center}>
                                    <Button
                                        type="submit"
                                        alignItems="center"
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        Create Rental
                                    </Button>
                                </Grid>
                            </Grid>

                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    )
};