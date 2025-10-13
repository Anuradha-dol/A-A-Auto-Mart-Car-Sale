import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Firstpage from "./components/FirstPage.jsx";
import EmployeeManagerDashboard from "./EmployeeManagement/EmployeeManagerDashboard.jsx";
import AddSalaryForm from "./EmployeeManagement/AddSalaryForm.jsx";
import UpdateSalaryForm from "./EmployeeManagement/UpdateSalaryForm.jsx";
import AllLeavesDashboard from "./EmployeeManagement/AllLeavesDashboard.jsx";
import EmpManagerSideUpdateLeave from "./EmployeeManagement/EmpManagerSideUpdateLeave.jsx"
import SalaryList from "./EmployeeManagement/SalaryList.jsx";

import LeaveRequestForm from "./EmployeeManagement/LeaverequestForm.jsx";
import UpdateRequestForm from "./EmployeeManagement/UpdateLeaveRequestForm.jsx";
import DisplayRequestForminEmpmanager from "./EmployeeManagement/LeaveRequestDashboard.jsx";

import UserManagerDashboard from "./UserManageent/UserManagerDahboard";
import Addusers from "./UserManageent/AddUsers";
import Updateusers from "./UserManageent/UpdateUser";

import ManagerDashboard from "./VehicleManagement/VehicleManagerDashboard";
import Addvehicle from "./VehicleManagement/AddVehicle";
import Apdatevehicle from"./VehicleManagement/UpdateVehicle.jsx";
import ShowVehicleDetails from "./Customer/ShowVehicleDetails.jsx"

import VehiclePartsManagerDashboard from "./VehiclePartsManagement/VehiclePartsManagerDashboard.jsx";
import AddVehiclePart from"./VehiclePartsManagement/AddVehiclePart.jsx";
import UpdateVehiclePart from "./VehiclePartsManagement/UpdateVehiclePart.jsx";
import Customersidevehiclepart from "./Customer/CustomerVehiclePartsDashboard.jsx"
import ShowPartDetails from "./Customer/ShowPartDetails.jsx";

import CartPage from "./Customer/CartPage.jsx";

import CustomerDashboard from "./Customer/CustomerDashboard.jsx";

import PaymentManagerDashboard from "./PaymentManagement/PaymentManagerDashboard.jsx";
import PaymentForm from "./PaymentManagement/PaymentForm.jsx";
import VehicleMechanicDashboard from "./VehicleMechanic/VehicleMechanicDashboard.jsx";

import VehicleCard from "./VehicleManagement/VehicleCard";

import AllVehiclePartRequestsDashboard  from "./VehiclePartsManagement/AllVehiclePartRequestsDashboard.jsx";
import MyVehiclePartRequestsform from "./Customer/MyVehiclePartRequestsform.jsx";
import VehiclePartRequestDashboard from "./Customer/VehiclePartRequestDashboard.jsx";
import UpdateVehicleRequestForm from "./Customer/UpdateVehicleRequestForm.jsx";
import Custsideupdateparts from "./Customer/UpdateCustomersideparts.jsx";

import UpdateVehicleRequestpart from "./Customer/UpdateCustomersideparts.jsx";

import MyVehicleWorksfrom from "./VehicleMechanic/MyVehicleWorksfrom.jsx";
import MyVehicleWorksUpdate from "./VehicleMechanic/MyVehicleWorksUpdate.jsx"

import AllMechanicWorks from "./Customer/AllMechanicWorks.jsx";

import PaymentView from "./PaymentManagement/CustomersidePaymentdisplay.jsx";
import PaymentManagerSideShowPayment from "./PaymentManagement/PaymentManagerSideShowPayment.jsx";


import Login from "./log/Login"
import AddCustomer from"./log/SignUp.jsx";
import Profile from "./Customer/Profile.jsx";
import Navbar from "./components/Navbar.jsx";

import SalaryManagerProfile from"./EmployeeManagement/SalaryManagerProfile.jsx";
import PaymentManagerProfile from "./PaymentManagement/PaymentManagerProfile.jsx";
import UserProfile from "./UserManageent/UserProfile.jsx";

import CareDashboard from "./Support/CareDashboard";
import ReviewManagement from "./Reviews/ReviewManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import Reviews from "./Reviews/Review";
import Support from "./Support/Support";
import AdminTicketList from "./Support/AdminTicketList";
import AdminTicketDetail from "./Support/AdminTicketDetail";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>   
           <Route path="/" element={<Firstpage />} />
            <Route path="/employeeManagerDashboard-dashboard" element={<EmployeeManagerDashboard />} />
             <Route path="/addSalaryForm" element={<AddSalaryForm/>} />
             <Route path="/updateSalaryForm/:id" element={<UpdateSalaryForm/>} />
              <Route path="/request-leave" element={<LeaveRequestForm/>} />
              <Route path="/updateRequestForm/:id" element={<UpdateRequestForm/>} />
              <Route path="/displayRequestForminEmpmanager" element={<DisplayRequestForminEmpmanager/>} />
              <Route path="/allLeavesDashboard" element={<AllLeavesDashboard/>} />
              <Route path="/empManagerSideUpdateLeave/:id" element={<EmpManagerSideUpdateLeave/>} />
              <Route path="/SalaryList" element={<SalaryList/>} />
               {/* ✅ Customer dashboard is a top-level route */}
             <Route path="/customer-dashboard" element={<CustomerDashboard />} />
             <Route path="/care-dashboard/*" element={<CareDashboard />}>
                {/* index => tickets page */}
                <Route index element={<AdminTicketList />} />
                <Route path="tickets" element={<AdminTicketList />} />
                <Route path="reviews" element={<ReviewManagement />} />
              </Route>

              <Route path="/cartPage" element={<CartPage />} />

                {/* only logged-in users see these */}
              <Route element={<ProtectedRoute />}>
                  <Route path="/admin/tickets" element={<AdminTicketList />} />
                  <Route path="/admin/tickets/:id" element={<AdminTicketDetail />} />
              </Route>
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<div>Not Found</div>} />

              <Route path="/vehicleMechanic-dashboard" element={<VehicleMechanicDashboard />} />
              <Route path="/MyVehicleWorksfrom" element={<MyVehicleWorksfrom />} />
              
              <Route path="/MyVehicleWorksUpdate/:id" element={<MyVehicleWorksUpdate />} />
              <Route path="/AllMechanicWorks" element={<AllMechanicWorks />} />
              <Route path="/paymentManager-dashboard" element={<PaymentManagerDashboard />} />
               <Route path="/paymentForm/:orderId" element={<PaymentForm />} />
               <Route path="/paymentView/:paymentId" element={<PaymentView />} />
               <Route path="/paymentManagerSideShowPayment/:paymentId" element={<PaymentManagerSideShowPayment />}
                    
/>
              <Route path="/Custsideupdateparts/userID" element={<Custsideupdateparts />} />
              <Route path="/usermanager" element={<UserManagerDashboard />} />
              <Route path="/Addusers" element={<Addusers />} />
              <Route path="/updateusers/:id" element={<Updateusers />} />
              <Route path="/vehicleManager-dashboard" element={<ManagerDashboard />} />
              <Route path="/showVehicleDetails/:id" element={<ShowVehicleDetails />} />
              
              <Route path = "/VehicleCard" elementn= {<VehicleCard/>}/>

               <Route path="/addvehicle" element={<Addvehicle />} />
               <Route path="/updatevehicle/:id" element={<Apdatevehicle />} />
                <Route path="/vehicleParts-dashboard" element={<VehiclePartsManagerDashboard />} />
                <Route path="/addvehiclepart" element={<AddVehiclePart />} />
                  <Route path="/updatevehiclepart/:id" element={<UpdateVehiclePart />} />
                  <Route path="/customersidevehiclepart" element={<Customersidevehiclepart />} />
                   <Route path="/showPartDetails/:id" element={<ShowPartDetails />} />

                   <Route path="/AllVehiclePartRequestsDashboard" element={<AllVehiclePartRequestsDashboard />} />
                   <Route path="/MyVehiclePartRequestsform" element={<MyVehiclePartRequestsform />} />
                   <Route path="/VehiclePartRequestDashboard" element={<VehiclePartRequestDashboard />} />
                   <Route path="/UpdateVehicleRequestForm/:id" element={<UpdateVehicleRequestForm />} />
                  <Route path="/updateVehicleRequest/:id" element={<UpdateVehicleRequestpart />} />

                  <Route path="/profile" element={<Profile />} />
                  <Route path="/salaryManagerProfile" element={<SalaryManagerProfile />} />
                  <Route path="/paymentManagerProfile" element={<PaymentManagerProfile />} />
                  <Route path="/userProfile" element={<UserProfile />} />      
                
                 <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<AddCustomer />} />
        </Routes>
      </div>
    </Router>
  );
}
