import { Component } from 'react';
import { Table, Form, Button, Alert } from 'react-bootstrap'
import Recaptcha from "react-recaptcha"
import './App.css';


let baseURL = "https://students-list-api.herokuapp.com/students"

// on local machine try this code below
// let baseURL;
// if (process.env.NODE_ENV === "development") {
//   baseURL = "http://localhost:3003/students";
// } else {
//   baseURL = "https://students-list-api.herokuapp.com/students";
// }


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      students: [],
      isVerified: false
    }
    this.getStudents = this.getStudents.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAddStudent = this.handleAddStudent.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.rechapchaLoaded = this.rechapchaLoaded.bind(this)
    this.verifyCallback = this.verifyCallback.bind(this)

  }

  componentDidMount() {
    this.getStudents()
    this.rechapchaLoaded()
  }

  getStudents() {
    fetch(baseURL)
      .then(
        (data) => {
          return data.json();
        },
        (err) => console.log(err)
      )
      .then(
        (parsedData) => this.setState({ students: parsedData }),
        (err) => console.log(err)
      )
  }

  handleAddStudent(student) {
    const copyStudents = [...this.state.students];
    copyStudents.unshift(student);
    this.setState({
      students: copyStudents
    })
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault();
    // if is verified then successfully add student to the list
    if (this.state.isVerified) {
      alert('You have successfully added a student')

      fetch(baseURL, {
        method: "POST",
        body: JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((res) => res.json())
        .then((resJson) => {
          this.handleAddStudent(resJson);
          this.setState({
            firstName: "",
            lastName: ""
          })
        })
        .catch((error) => console.log({ Error: error }));
      console.log("submit");
    } else {
      alert('Please verify you are a human')
    }

  }

  deleteStudent(id) {
    fetch(baseURL + "/" + id, {
      method: "DELETE",
    }).then((res) => {
      const findIndex = this.state.students.findIndex(
        (student) => student._id === id
      );
      const copyStudents = [...this.state.students];
      copyStudents.splice(findIndex, 1);
      this.setState({
        students: copyStudents
      })
    })
  }

  rechapchaLoaded() {
    console.log('recaptcha successfully loaded')
  }
  verifyCallback(response) {
    if (response) {
      this.setState({
        isVerified: true
      })
    }
  }
  render() {
    return (
      <div className="container" >
        <h1>Students' List</h1>

        {/* Table */}

        <Table className="table">
          <thead>
            {
              this.state.students.map(student => {
                return (
                  <tr>
                    <th>{student.firstName}</th>
                    <th>{student.lastName}</th><div className="button" onClick={() => this.deleteStudent(student._id)}>x</div>
                  </tr>
                )
              })
            }

          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table >


        {/* Form */}

        <div className="form">
          <h4>Add a Student to the List</h4>
          < Form onSubmit={this.handleSubmit}>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              type="text"
              placeholder="John"
              name="firstName"
              id="firstName"
              value={this.state.firstName}
            />
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              type="text"
              placeholder="Doe"
              name="lastName"
              id="lastName"
              value={this.state.lastName} />
            <Button variant="info" type="submit">
              Submit
          </Button>

            {/* reCAPTCHA */}
            <Recaptcha
              sitekey="6LcSh_MaAAAAANRJVCLFsDLGvknU-H6XhtAcoB4P"
              render="explicit"
              onloadCallback={this.rechapchaLoaded}
              verifyCallback={this.verifyCallback}
            />
          </Form >


        </div>

      </div >
    );
  }
}


