import React, { useContext } from "react";
import { GlobalContext, isAdmin } from "../context/GlobalState";
import RentalsList from "../components/RentalsList";
import AdminRentalList from "../components/AdminRentalList";
import MachineAvaibility from "../components/MachineAvaibility";
import {AddRental} from "../components/AddRental";
import {MachineAvailability} from "../components/MachineAvailability";
import {AddRentalAdmin} from "../components/AddRentalAdmin";

const Rentals = () => {
  const { user } = useContext(GlobalContext);
    const customersView = <div><RentalsList/><AddRental/></div>;
    const adminsView = <div><AdminRentalList/><AddRentalAdmin/></div>;

  return (
    <div>
      <h1>Rentals</h1>
      {isAdmin(user) ? adminsView : customersView}
      <MachineAvailability/>

    </div>
  );
};

export default Rentals;
