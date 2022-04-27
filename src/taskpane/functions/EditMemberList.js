import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Stack, TextField, PrimaryButton, CommandBarButton, IIconProps } from "@fluentui/react";

const addUser = (user_id, user_pass, user_name, user_type) => {
  console.log(user_id);
  console.log(user_pass);
  console.log(user_name);
  console.log(user_type);

  var userTypes = "";

  if (user_type == "L") {
    userTypes = "lecturer";
  } else if (user_type == "S") {
    userTypes = "student";
  } else if (user_type == "A") {
    userTypes = "admin";
  }

  axios
    .post("https://mmu-online-exam-addin.herokuapp.com/users", {
      id: user_id,
      name: user_name,
      password: user_pass,
      type: userTypes,
    })
    .then((resp) => {
      console.log(resp.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

const getUserList = () => {
  const [users, setUsers] = useState();
  const [userDelete, setDelete] = useState();
  // console.log(lect_id);

  const deleteHandler = (event) => {
    setDelete(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("refresh prevented");
    deleteUser(userDelete);
  };

  useEffect(() => {
    fetch(`https://mmu-online-exam-addin.herokuapp.com/users`)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        setUsers(data);
      });
  }, []);

  function refreshPage() {
    window.location.reload(false);
  }

  const refreshIcon = { iconName: "Refresh" };

  // console.log(exams);
  return (
    <div>
      <CommandBarButton
        style={{ height: 50, float: "right" }}
        onClick={refreshPage}
        text="Refresh"
        iconProps={refreshIcon}
      />
      <Stack horizontalAlign="center" marginTop="20px">
        <div style={{ margin: "30px" }}>{users && <UserList users={users} />}</div>
        <form onSubmit={onSubmit}>
          <h3>Enter ID to remove user.</h3>
          <TextField placeholder="Enter user ID" required onChange={deleteHandler} />
          <br />
          <PrimaryButton style={{ width: 200 }} type="submit">
            Enter
          </PrimaryButton>
        </form>
      </Stack>
    </div>
  );
};

const UserList = ({ users }) => {
  return (
    <div align="center">
      <table style={{ border: "1px solid", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid", width: "100px", padding: "15px" }}>ID</th>
            <th style={{ border: "1px solid", width: "200px", padding: "15px" }}>Name</th>
            <th style={{ border: "1px solid", width: "100px", padding: "15px" }}>User Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map((users) => (
            <tr>
              <td style={{ border: "1px solid", padding: "10px" }}>{users.id}</td>
              <td style={{ border: "1px solid", padding: "10px" }}>{users.name}</td>
              <td style={{ border: "1px solid", padding: "10px" }}>{users.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const deleteUser = (delete_id) => {
  console.log(delete_id);

  axios
    .delete(`https://mmu-online-exam-addin.herokuapp.com/users/${delete_id}`, {})
    .then((resp) => {
      <div>Deleted</div>;
      console.log(resp.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

export { addUser, getUserList };
