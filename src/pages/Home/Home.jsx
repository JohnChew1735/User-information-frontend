import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export function Home() {
  let navigate = useNavigate();
  const [users, setUsers] = useState([]);

  //clock
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users"); // Backend API
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Runs once when component mounts

  return (
    <center>
      <div className="App">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() =>
              navigate("user-data", {
                state: {
                  mode: "AddNewUser",
                },
              })
            }
          >
            Add new user
          </Button>
          <div></div>
        </div>
        <h1 style={{ color: "black" }}>User Information</h1>
        <h4 style={{ color: "black" }}>Current Time: {time}</h4>
        <table
          style={{ borderCollapse: "collapse", width: "50%", color: "white" }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Username
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Age</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Country
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Action
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let rows = [];
              for (let i = 0; i < users.length; i++) {
                rows.push(
                  <tr key={i}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {users[i].username}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {users[i].age}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {users[i].country_name}
                    </td>
                    <td>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                          console.log(users[i].id);
                          navigate("user-data", {
                            state: {
                              mode: "EditUser",
                              username1: users[i].username,
                              age1: users[i].age,
                              country_name1: users[i].country_name,
                              id1: users[i].id,
                            },
                          });
                        }}
                      >
                        Edit user
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                          console.log(
                            users[i].id,
                            users[i].username,
                            users[i].age,
                            users[i].country_name
                          );
                          navigate("user-data", {
                            state: {
                              mode: "DeleteUser",
                              username1: users[i].username,
                              age1: users[i].age,
                              country_name1: users[i].country_name,
                              id1: users[i].id,
                            },
                          });
                        }}
                      >
                        Delete user
                      </Button>
                    </td>
                  </tr>
                );
              }
              return rows;
            })()}
          </tbody>
        </table>
        <p></p>
      </div>
    </center>
  );
}
