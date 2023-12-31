import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

const DataTable = () => {
  const [customers, setCustomers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/read_customers");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (customerID, customerName) => {
    setSelectedCustomer({ customerID, customerName });
    setDialogOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Call your delete method here with customer ID and customer name
    const { customerID, customerName } = selectedCustomer;
    const message = `Delete customer ID: ${customerID}, Customer name: ${customerName}`;
    console.log(message);
    setDialogOpen(false);
    deleteCustomer(customerName);
  };

  const handleConfirmEdit = async (event) => {
    event.preventDefault();

    const { customerID } = selectedCustomer;
    const updatedCustomer = { ...selectedCustomer, ...editedCustomer };
    console.log(
      "Update customer:",
      customerID,
      "Updated details:",
      updatedCustomer
    );
    const customer_address = updatedCustomer.customer_address;
    const customer_email = updatedCustomer.customer_email;
    const customer_location = updatedCustomer.customer_location;
    const customer_phone = updatedCustomer.customer_phone;
    const customer_po_number = updatedCustomer.customer_po_number;
    const customer_street = updatedCustomer.customer_street;
    const customer_name = updatedCustomer.customer_name;
    const kra_pin = updatedCustomer.kra_pin;
    try {
      const response = await axios.put(
        "http://localhost:3000/update/customers",
        {
          customer_address,
          customer_email,
          customer_location,
          customer_phone,
          customer_po_number,
          customer_street,
          customer_name,
          kra_pin,
        }
      );

      console.log(response.data); // Assuming the response contains the updated movie details
      // Reset form fields
      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
    setEditDialogOpen(false);
  };

  const deleteCustomer = async () => {
    const { customerName } = selectedCustomer;
    try {
      const response = await axios.delete(
        `http://localhost:3000/delete/customer`,
        {
          params: {
            customerName,
          },
        }
      );
      console.log(response.data); // Assuming the response contains the success message

      alert("Deleted Successfuly!");
      fetchCustomers(); //update the list
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const columns = [
    { field: "id", headerName: "No", width: 50 },
    { field: "cust_id", headerName: "ID", width: 100 },
    { field: "customer_name", headerName: "Customer Name", width: 180 },
    { field: "customer_email", headerName: "Email", width: 200 },
    { field: "customer_street", headerName: "Street", width: 140 },
    { field: "customer_address", headerName: "Address", width: 160 },
    { field: "customer_location", headerName: "Location", width: 140 },
    { field: "kra_pin", headerName: "Pin No", width: 100 },
    { field: "customer_phone", headerName: "Phone", width: 100 },
    {
      field: "Action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        const customerID = params.row.id;
        const customerName = params.row.customer_name;
        const customer = params.row;
        return (
          <>
            <button
              className="InvoiceListEdit"
              onClick={() => handleDelete(customerID, customerName)}
            >
              <DeleteIcon className="InvoiceListDelete" />
            </button>

            <button
              className="InvoiceListEdit"
              style={{
                marginLeft: "10px",
              }}
              onClick={() => handleEdit(customer)}
            >
              <EditIcon className="InvoiceListEdit" />
            </button>
          </>
        );
      },
    },
  ];

  const generateRowsWithIds = (rows) => {
    return rows.map((row, index) => ({
      ...row,
      id: `${(index + 1).toString().padStart(3, "0")}`, // Generate ID in the format SCA-001
    }));
  };

  const rowsWithIds = generateRowsWithIds(customers);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "100%",
        height: 500,
        width: "80%",
        marginLeft: "250px",
        marginRight: "auto",
        backgroundColor: "#EDEADE",
        padding: "20px",
        borderRadius: "6px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: "50%",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            Customer Records
          </h1>
        </div>
        <div
          style={{
            width: "50%",
          }}
        >
          <button
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s",
              marginRight: "10px",
              marginLeft: "80%",
            }}
            type="button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>

      <DataGrid rows={rowsWithIds} columns={columns} pageSize={5} />

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to delete: <br />{" "}
            {selectedCustomer.customerName}?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Customer Details</DialogTitle>
        <DialogContent>
          <TextField
            style={{
              marginTop: "10px",
            }}
            name="customer_name"
            label="Customer Name"
            fullWidth
            value={editedCustomer.customer_name || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            style={{
              marginTop: "10px",
            }}
            name="customer_email"
            label="Email"
            fullWidth
            value={editedCustomer.customer_email || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            style={{
              marginTop: "10px",
            }}
            name="customer_street"
            label="Street"
            fullWidth
            value={editedCustomer.customer_street || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            style={{
              marginTop: "10px",
            }}
            name="customer_address"
            label="Address"
            fullWidth
            value={editedCustomer.customer_address || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            style={{
              marginTop: "10px",
            }}
            name="customer_location"
            label="Location"
            fullWidth
            value={editedCustomer.customer_location || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            style={{
              marginTop: "10px",
            }}
            name="kra_pin"
            label="Pin No"
            fullWidth
            value={editedCustomer.kra_pin || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            style={{
              marginTop: "10px",
            }}
            name="customer_phone"
            label="Phone"
            fullWidth
            value={editedCustomer.customer_phone || ""}
            onChange={handleEditInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmEdit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTable;
