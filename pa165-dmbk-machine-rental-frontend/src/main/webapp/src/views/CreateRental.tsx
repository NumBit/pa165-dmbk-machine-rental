import React, { useContext } from "react";
import { GlobalContext, isAdmin } from "../context/GlobalState";
import RentalsList from "../components/RentalsList";
import AdminRentalList from "../components/AdminRentalList";
import MachineAvaibility from "../components/MachineAvaibility";
import {AddRental} from "../components/AddRental";
import {MachineAvailability} from "../components/MachineAvailability";
import {AddRentalAdmin} from "../components/AddRentalAdmin";

const CreateRental = () => {
    const { user } = useContext(GlobalContext);
    const customersView = <div><AddRental/></div>;
    const adminsView = <div><AddRentalAdmin/></div>;

    return (
        <div>
            {isAdmin(user) ? adminsView : customersView}

        </div>
    );
};

export default CreateRental;
