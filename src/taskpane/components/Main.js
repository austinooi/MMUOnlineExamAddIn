import * as React from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  PrimaryButton,
  TextField,
  Stack,
  Slider,
  DialogType,
  ChoiceGroup,
} from "@fluentui/react";
import { Pivot, PivotItem } from "@fluentui/react";
import Header from "./Header";
import { HashRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import { createExam, uploadQuestions } from "../functions/CreateExam";
import { getExamList } from "../functions/GetExamList";
import { getExam } from "../functions/getExam";
import { addUser } from "../functions/EditMemberList";
import {getUserList} from "../functions/EditMemberList"

const textFieldStyles = {
  width: 200,
  // marginTop : "50px",
};

const buttonStyles = {
  width: 200,
  marginTop: 10,
};

const pivotStyles = {
  linkContent: {
    fontSize: "14px",
    height: "50px",
    width: "88px",
  },
};

const refreshIcon = { iconName: "Refresh" };
const addIcon = { iconName: "Add" };

var userName = "";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Route path="/admin/:id" component={adminPage} />
        <Route path="/student/:id" component={studentPage} />
        <Route path="/lecturer/:id" component={lecturerPage} />
        <Route path="/" exact component={loginPage} />
        {/* <Route path="/createExam" exact component={createExam} /> */}
      </Router>
    );
  }
}

const loginPage = () => {
  let data;
  let history = useHistory();
  const { id } = useParams;
  const [login_id, setUsername] = useState();
  const [login_pass, setPass] = useState();

  const userHandler = (event) => {
    setUsername(event.target.value);
  };

  const passHandler = (event) => {
    setPass(event.target.value);
  };

  const logSubmit = (event) => {
    event.preventDefault();

    axios.get("https://mmu-online-exam-addin.herokuapp.com/users").then((resp) => {
      data = resp.data;
      // console.log(data);
      const userTrue = data.find(({ id }) => id === login_id);
      const passTrue = data.find(({ password }) => password === login_pass);
      // const userType = data.find({ type });

      if (userTrue && passTrue) {
        axios.get(`https://mmu-online-exam-addin.herokuapp.com/users/${login_id}`).then((input) => {
          const user = input.data;
          // console.log(user.find("type"));
          userName = user.name;
          console.log(user.type);
          if (user.type == "student") {
            console.log("Student login Successful");
            history.push(`/student/${login_id}`);
          } else if (user.type == "lecturer") {
            console.log("Lecturer login Successful");
            history.push(`/lecturer/${login_id}`);
          } else if (user.type == "admin") {
            console.log("Admin login Successful");
            history.push(`/admin/${login_id}`);
          }
        });
      } else {
        console.log("Wrong Username or Password");
      }
    });
  };
  return (
    <div className="ms-welcome">
      <Header logo={require("./../../../assets/logo_full.png")} title={"hello"} message="Welcome" />
      {/* <HashRouter>
      <Router> */}
      <Stack horizontalAlign="center">
        <form onSubmit={logSubmit}>
          <TextField placeholder="ID" style={textFieldStyles} onChange={userHandler} />
          <br />
          <TextField type="password" placeholder="Password" style={textFieldStyles} onChange={passHandler} />
          <PrimaryButton className="ms-welcome__action" style={buttonStyles} onClick={logSubmit} type="submit">
            Sign In
          </PrimaryButton>
        </form>
      </Stack>
    </div>
  );
};

const lecturerPage = () => {
  // console.log(login_id);
  const [exam_title, setTitle] = useState();
  const [exam_id, setID] = useState();
  const [sliderValue, setSliderValue] = useState();
  const [userName, setUsername] = useState();
  const sliderOnChange = (value) => setSliderValue(value);

  const { id } = useParams();

  const titleHandler = (event) => {
    setTitle(event.target.value);
  };

  const idHandler = (event) => {
    setID(event.target.value);
  };

  axios.get(`https://mmu-online-exam-addin.herokuapp.com/users/${id}`).then((input) => {
    const user = input.data;
    setUsername(user.name);
  });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("refresh prevented");
    uploadQuestions(exam_title, sliderValue, id, exam_id);
  };

  return (
    <div>
      <Pivot aria-label="Lecturer Pivot" styles={pivotStyles} linkSize="large">
        {/* Home Tab */}
        <PivotItem
          headerText="Home"
          headerButtonProps={{
            "data-order": 1,
            "data-title": "Home Title",
          }}
        >
          {
            <div>
              <Stack horizontalAlign="center" style={{ marginTop: "60px" }}>
                <Header
                  logo={require("./../../../assets/logo_full.png")}
                  title={"hello"}
                  message={"Welcome, " + userName}
                />
              </Stack>
            </div>
          }
        </PivotItem>

        {/* Create Exam Tab */}
        <PivotItem headerText="Create Exam">
          <Stack horizontalAlign="left" style={{ margin: "30px" }}>
            <form onSubmit={onSubmit}>
              <TextField
                label="Exam Title"
                placeholder="eg. Software Engineering Fundatmentals"
                onChange={titleHandler}
                required
              />
              <br />
              <TextField label="Exam Code" placeholder="eg. MMU001" onChange={idHandler} required />
              <br />
              <Slider label="Number of Questions" max={10} value={sliderValue} showValue onChange={sliderOnChange} />
              <br />
              <PrimaryButton
                className="ms-welcome__action"
                style={buttonStyles}
                onClick={() => {
                  createExam(exam_title, sliderValue);
                }}
              >
                Create Exam
              </PrimaryButton>
              <br />
              <PrimaryButton className="ms-welcome__action" style={buttonStyles} type="submit">
                Upload Questions
              </PrimaryButton>
            </form>
          </Stack>
        </PivotItem>
        
        {/* Exam List Tab */}
        <PivotItem headerText="Exam List">{getExamList(id)}</PivotItem>
      </Pivot>
    </div>
  );
};

const adminPage = () => {
  const [newUserID, setNewID] = useState();
  const [newUserPassword, setNewPassword] = useState();
  const [newUserName, setNewName] = useState();
  const [userName, setUsername] = useState();
  const { id } = useParams();

  const options = [
    { key: "S", text: "Student" },
    { key: "L", text: "Lecturer" },
    { key: "A", text: "Admin" },
  ];

  const dialogContentProps = {
    type: DialogType.normal,
    title: "Register New User",
    subText: "Please fill in user details.",
  };

  const textFieldStyles = {
    width: 200,
  };

  const buttonStyles = {
    width: 200,
  };

  const newIDHandler = (event) => {
    setNewID(event.target.value);
  };

  const newNameHandler = (event) => {
    setNewName(event.target.value);
  };

  const newPasswordHandler = (event) => {
    setNewPassword(event.target.value);
  };

  const [selectedKey, setSelectedKey] = useState();

  const typeHandler = React.useCallback((ev, option) => {
    setSelectedKey(option.key);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("refresh prevented");
    // console.log(selectedKey);
    addUser(newUserID, newUserPassword, newUserName, selectedKey);
  };

  axios.get(`https://mmu-online-exam-addin.herokuapp.com/users/${id}`).then((input) => {
    const user = input.data;
    setUsername(user.name);
  });

  return (
    <div>
      <Pivot aria-label="Admin Pivot" styles={pivotStyles} linkSize="large">
        {/* Home Tab */}
        <PivotItem
          headerText="Home"
          headerButtonProps={{
            "data-order": 1,
            "data-title": "Home Title",
          }}
        >
          {
            <div>
              <Stack horizontalAlign="center" style={{ marginTop: "100px" }}>
                <Header
                  logo={require("./../../../assets/logo_full.png")}
                  title={"Admin"}
                  message={"Welcome, " + userName}
                />
              </Stack>
            </div>
          }
        </PivotItem>

        {/* Add User Tab */}
        <PivotItem headerText="Add New User">
          <Stack horizontalAlign="center" style={{ marginTop: "20px" }}>
            <div>
              <h2>Enter User Details</h2>
            </div>
            <form onSubmit={onSubmit}>
              <TextField
                label="ID"
                placeholder="ID"
                name="id"
                style={textFieldStyles}
                onChange={newIDHandler}
                required
              />
              <br />
              <TextField
                label="Name"
                placeholder="Name"
                name="name"
                style={textFieldStyles}
                onChange={newNameHandler}
                required
              />
              <br />
              <TextField
                label="Password"
                placeholder="Password"
                type="password"
                name="password"
                style={textFieldStyles}
                onChange={newPasswordHandler}
                required
              />
              <br />
              <ChoiceGroup options={options} onChange={typeHandler} label="Pick User Type:" required />
              <br />
              <PrimaryButton style={buttonStyles} text="Register" type="submit" />
            </form>
          </Stack>
        </PivotItem>

        {/* Member List Tab */}
        <PivotItem headerText="Remove User">
          <div>
            {getUserList()}
          </div>
          {/* <Stack horizontalAlign="center" style={{ marginTop: "20px" }}>
            <div>
              <h2>Enter User Details</h2>
            </div>
            <form onSubmit={onSubmit}>
              <TextField
                label="ID"
                placeholder="ID"
                name="id"
                style={textFieldStyles}
                onChange={newIDHandler}
                required
              />
              <br />
              <TextField
                label="Name"
                placeholder="Name"
                name="name"
                style={textFieldStyles}
                onChange={newNameHandler}
                required
              />
              <br />
              <TextField
                label="Password"
                placeholder="Password"
                type="password"
                name="password"
                style={textFieldStyles}
                onChange={newPasswordHandler}
                required
              />
              <br />
              <ChoiceGroup options={options} onChange={typeHandler} label="Pick User Type:" required />
              <br />
              <PrimaryButton style={buttonStyles} text="Register" type="submit" />
            </form>
          </Stack> */}
        </PivotItem>
      </Pivot>
    </div>
  );
};

const studentPage = () => {
  const [exam_code, setCode] = useState();
  const [userName, setUsername] = useState();

  const { id } = useParams();

  const codeHandler = (event) => {
    setCode(event.target.value);
  };

  axios.get(`https://mmu-online-exam-addin.herokuapp.com/users/${id}`).then((input) => {
    const user = input.data;
    setUsername(user.name);
  });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("refresh prevented");
    getExam(exam_code);
  };

  console.log(exam_code);
  return (
    <div>
      <Pivot aria-label="Student Pivot" styles={pivotStyles} linkSize="large">
        {/* Home Tab */}
        <PivotItem
          headerText="Home"
          headerButtonProps={{
            "data-order": 1,
            "data-title": "Home Title",
          }}
        >
          {
            <div>
              <Stack horizontalAlign="center" style={{ marginTop: "60px" }}>
                <Header
                  logo={require("./../../../assets/logo_full.png")}
                  title={"Student"}
                  message={"Welcome, " + userName}
                />
              </Stack>
            </div>
          }
        </PivotItem>

        {/* Exam Tab */}
        <PivotItem headerText="Exam">
          <div>
            <Stack horizontalAlign="center" style={{ marginTop: "60px" }}>
              <form style={{ textAlign: "center" }} onSubmit={onSubmit}>
                <h2
                  className="ms-fontSize-xl ms-fontWeight-light ms-fontColor-neutralPrimary"
                  style={{ marginTop: "20px" }}
                >
                  Please enter exam code to start.
                </h2>
                <br />
                <TextField
                  placeholder="Exam Code"
                  id="examCode"
                  style={{ width: "100" }}
                  onChange={codeHandler}
                  required
                />
                <br />
                <PrimaryButton className="ms-welcome__action" style={buttonStyles} type="submit">
                  Enter
                </PrimaryButton>
              </form>
            </Stack>
          </div>
        </PivotItem>
      </Pivot>
    </div>
  );
};
