import Button from "@mui/material/Button";
import "./UserData.css";
import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

export default function UserData() {
  let navigate = useNavigate();
  const routeChange = () => {
    navigate("/");
  };
  const [username, setUsername] = useState(""); //used for adding user
  const [age, setAge] = useState(""); //used for adding user
  const [countryName, setCountryName] = useState(""); //used for adding user
  const location = useLocation();
  const { mode } = location.state || {};
  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { username1, age1, country_name1 } = location.state || {}; //used for deleting user
  const [username2, setUsername2] = useState(username1); // Used for edit user
  const [age2, setAge2] = useState(age1); // Used for edit user
  const [country_name2, setCountryName2] = useState(country_name1); // Used for edit user

  // Add new User
  const handleAddNewUser = useCallback(async () => {
    if (!username) {
      alert("Username cannot be empty.");
      return;
    }
    if (age < 1) {
      alert("Age cannot be less than 1.");
      return;
    }
    if (!countryName) {
      alert("Please select a country name.");
      return;
    }

    const countryExists = countries.includes(countryName);

    if (!countryExists) {
      try {
        const response = await fetch("http://localhost:8000/api/addcountry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country_name: countryName }),
        });
        if (!response.ok) throw new Error("Failed to add country.");
        alert(`Country '${countryName}' added successfully.`);
      } catch (error) {
        console.error("Error adding country:", error);
        setErrorMessage("Error adding country.");
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:8000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          age: parseInt(age, 10),
          country_name: countryName,
        }),
      });
      if (response.ok) {
        navigate("/");
        alert("User added successfully.");
      }
    } catch (exception) {
      console.log("Error:", exception);
      alert("Error adding user.");
    }
  }, [username, age, countryName, countries, navigate]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/countrydata");
        const data = await response.json();
        const cleanedData = data
          .map((item) =>
            typeof item === "string" ? item.replace(/^\d+\.\s*/, "") : item
          )
          .filter(Boolean);
        setCountries(cleanedData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const { state = {} } = useLocation();
  const { id1 } = state;

  //confirm deletion start
  const confirmDeletion = useCallback(async () => {
    if (!id1 || isNaN(id1)) {
      alert("Invalid user ID.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${id1}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      navigate("/");
      alert("User has been successfully deleted.");
    } catch (exception) {
      console.error("Error:", exception);
      alert("An error occurred while deleting the user.");
    }
  }, [id1, navigate]);
  //confirm deletion end

  //confirm edit start
  const confirmEdit = useCallback(async () => {
    console.log(username2, age2, country_name2, id1);
    if (!username2) {
      alert("Username cannot be empty.");
      return;
    }
    if (age2 < 1) {
      alert("Age cannot be less than 1.");
      return;
    }
    if (!country_name2) {
      alert("Please select a country name.");
      return;
    }
    //delete user with that id
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id1}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      alert(`Username ${username2} will be edited.`);
    } catch (exception) {
      console.error("Error:", exception);
      alert("An error occurred while deleting the user.");
    }
    //add back user with edited information
    const countryExists = countries.includes(country_name2);

    if (!countryExists) {
      try {
        const response = await fetch("http://localhost:8000/api/addcountry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country_name: country_name2 }),
        });
        if (!response.ok) throw new Error("Failed to add country.");
        alert(`Country '${country_name2}' added successfully.`);
      } catch (error) {
        console.error("Error adding country:", error);
        setErrorMessage("Error adding country.");
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:8000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username2,
          age: parseInt(age2, 10),
          country_name: country_name2,
        }),
      });
      if (response.ok) {
        navigate("/");
        alert("User edited successfully.");
      }
    } catch (exception) {
      console.log("Error:", exception);
      alert("Error editing user.");
    }
  }, [username2, age2, country_name2, id1, countries, navigate]);
  //confirm edit end

  if (mode === "AddNewUser") {
    return (
      <div>
        <Button variant="contained" size="large" onClick={routeChange}>
          Back
        </Button>
        <center id="center-content">
          <h1>Add new user</h1>
          <form>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ width: "300px" }}
            >
              <div>Username: </div>
              <TextField
                id="input"
                variant="outlined"
                label="Enter Username"
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </Stack>
            <p></p>
            <Stack
              direction="row"
              alignItems="center"
              spacing={5}
              sx={{ width: "300px" }}
            >
              <div>Age: </div>
              <TextField
                id="input"
                variant="outlined"
                label="Enter age"
                fullWidth
                onChange={(e) => setAge(e.target.value)}
                value={age}
              />
            </Stack>

            <p></p>
          </form>
          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            sx={{ width: 300 }}
          >
            <span>Country Name:</span>
            <Autocomplete
              freeSolo
              disableClearable
              options={countries}
              sx={{ flexGrow: 1 }}
              value={countryName}
              onInputChange={(event, newValue) => {
                setCountryName(newValue);
                setErrorMessage("");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter country name"
                  type="search"
                  error={Boolean(errorMessage)}
                  helperText={errorMessage}
                />
              )}
            />
          </Stack>
          <p></p>
          <Button
            variant="contained"
            size="large"
            onClick={async () => {
              await handleAddNewUser();
              setUsername("");
              setAge("");
              setCountryName("");
            }}
          >
            Done
          </Button>
          <p></p>
        </center>
      </div>
    );
  }

  if (mode === "DeleteUser") {
    return (
      <div>
        <Button variant="contained" size="large" onClick={routeChange}>
          Back
        </Button>
        <center id="center-content">
          <h1>Delete existing user</h1>
          <form>
            Username: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input value={username1} disabled />
            <p></p>
            Age:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input value={age1} disabled />
            <p></p>
            Country Name: <input value={country_name1} disabled />
          </form>
          <p></p>
          <Button variant="contained" size="large" onClick={confirmDeletion}>
            Delete
          </Button>
        </center>
      </div>
    );
  }

  if (mode === "EditUser") {
    return (
      <div>
        <Button variant="contained" size="large" onClick={routeChange}>
          Back
        </Button>
        <center id="center-content">
          <h1>Edit existing user</h1>
          <form>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ width: "300px" }}
            >
              <div>Username: </div>
              <TextField
                id="input"
                variant="outlined"
                label="Enter Username"
                defaultValue={username2}
                fullWidth
                onChange={(e) => setUsername2(e.target.value)}
              />
            </Stack>
            <p></p>
            <Stack
              direction="row"
              alignItems="center"
              spacing={5}
              sx={{ width: "300px" }}
            >
              <div>Age: </div>
              <TextField
                id="input"
                variant="outlined"
                label="Enter age"
                fullWidth
                defaultValue={age2}
                onChange={(e) => setAge2(e.target.value)}
              />
            </Stack>

            <p></p>
          </form>
          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            sx={{ width: 300 }}
          >
            <span>Country Name:</span>
            <Autocomplete
              freeSolo
              disableClearable
              options={countries}
              sx={{ flexGrow: 1 }}
              defaultValue={country_name2}
              onInputChange={(event, value) => {
                setCountryName2(value);
                setErrorMessage("");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter country name"
                  type="search"
                  error={Boolean(errorMessage)}
                  helperText={errorMessage}
                />
              )}
            />
          </Stack>
          <p></p>
          <Button
            variant="contained"
            size="large"
            onClick={async () => {
              await confirmEdit();
            }}
          >
            Done
          </Button>
          <p></p>
        </center>
      </div>
    );
  }
}
