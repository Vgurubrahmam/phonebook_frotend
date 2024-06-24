import React, { useEffect, useState } from "react";
import './App.css'

const App = () => {
  const [data, setData] = useState([]);
  const [getData, setGetData] = useState([]);

  const [status, setStatus] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    Adhar_no:"",
    Dateofbirth:"",
    imageurl:"",
  });
  const [updateData, setUpdateData] = useState({
    _id: "",
    name: "",
    phone: "",
    Adhar_no:"",
    Dateofbirth:"",
    imageurl:"",
  });

  const handleSubmitChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    setUpdateData({
      ...updateData,
      [name]: value,
    });
  };

  const handleKeypress = (event) => {
    // Allow numbers (0-9), tab (Tab), enter (Enter), and backspace (Backspace)
    if (!/^\d$|^Tab$|^Enter$|^Backspace$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const fetchData = () => {
    fetch("https://phonebook-backend-phi.vercel.app/get-phone")
      .then((response) => {
        return response.json();
      })
      .then((results) => {
        setData(results.data.phoneNumbers);
        console.log(results);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    fetchData();
    console.log(getData);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    fetch("https://phonebook-backend-phi.vercel.app/add-phone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((saved) => {
        setStatus(saved.success);
        fetchData();
        setFormData({
          name: "",
          phone: "",
          Adhar_no:"",
         Dateofbirth:"",
        imageurl:"",
        });
        setUpdateData({
          _id: "name",
          name: "",
          phone: "",
          Adhar_no:"",
          Dateofbirth:"",
          imageurl:"",
        });
      });
  };

  const handleDelete = (formData) => {
    fetch("https://phonebook-backend-phi.vercel.app/delete-phone/" + formData._id, {
      method: "DELETE",
    })
    .catch((err) => {
      console.error("Error deleting Contact.", err);
    });
    fetchData();
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    fetch("https://phonebook-backend-phi.vercel.app/update-phone/" + updateData._id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchData();
        setUpdateData({
          _id: "",
          name: "",
          phone: "",
          Adhar_no:"",
      Dateofbirth:"",
      imageurl:"",
        });
      });
  };

  return (
    <div className="bg-container d-flex flex-row align-items-center justify-content-center">
      <div className="login-page shadow-lg d-flex flex-row justify-content-center align-items-center pt-2 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="phone-book-heading">ID CARD</h1>
              <div className="d-flex flex-row justify-content-center align-items-center rounded-3 card-form  mt-0">
                <div className="scrollable-table-container d-flex justify-content-center">
                  <table className="table table-hover">
                    <thead>
                      <tr className="bg-info scrollable-table z-index-100 mb-3 top-0">
                        <th scope="col">Name</th>
                        <th scope="col">Image</th>
                        <th scope="col">Phone number</th>
                        
                        <th scope="col">Adhar_no</th>
                        <th scope="col">D_o_B</th>
                        
                        <th scope="col">Update</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="scrollable-table mt-4">
                      {data.length>0 &&
                      data.map((result, key) => (
                        <tr key={key}>
                          <td scope="row">{result.name}</td>
                          <td scope="row"><img src={result.imageurl} className="size"></img></td>
                          <td scope="row">{result.phone}</td>
                          
                          <td scope="row">{result.Adhar_no}</td>
                          <td scope="row">{result.Dateofbirth}</td>
                          
                          <td>
                      
                            <i
                              onClick={() => setUpdateData(result)}
                              className="fa-solid fa-pen-to-square btn-sm-2  text-dark"
                              type="button"
                              data-toggle="modal"
                              data-target="#exampleModal-2"
                            ></i>
                          </td>
                          <td>
                            <a onClick={() => handleDelete(result)}>
                              <i
                                className=" fa-regular fa-trash-can"
                                type="button"
                              ></i>
                            </a>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                  <div
                    className="modal fade background-model"
                    id="exampleModal-2"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel-2"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog ">
                      <div className="modal-content background-body">
                        <div className="modal-header mb-3 ">
                          <h5
                            className="phone-book-heading text-center"
                            id="exampleModalLabel-2"
                          >
                            Update
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <form method="POST" onSubmit={handleUpdate}>
                          <div className="modal-body">
                            <input
                              required
                              type="text"
                              className="enter-input"
                              placeholder="Name.."
                              name="name"
                              value={updateData.name}
                              onChange={handleUpdateChange}
                            ></input>
                            <input
                              name="phone"
                              onKeyDown={handleKeypress}
                              onChange={handleUpdateChange}
                              type="tel"
                              value={updateData.phone}
                              pattern="[0-9]+"
                              minLength={10}
                              maxLength={10}
                              className="enter-input"
                              placeholder="phonenumber.."
                              required
                            ></input>
                            <input
                              required
                              type="tel"
                              className="enter-input"
                              placeholder="Name.."
                              name="Adhar_no"
                              minLength={12}
                              maxLength={12}
                              onKeyDown={handleKeypress}
                              value={updateData.Adhar_no}
                              onChange={handleUpdateChange}
                            ></input>
                            <input
                              required
                              type="Date"
                              className="enter-input"
                              placeholder="Name.."
                              name="Dateofbirth"
                              value={updateData.Dateofbirth}
                              onChange={handleUpdateChange}
                            ></input>
                            <input
                              required
                              type="text"
                              className="enter-input"
                              placeholder="img.."
                              name="imageurl"
                              value={updateData.imageurl}
                              onChange={handleUpdateChange}
                            ></input>
                            <button
                              type="submit"
                              className="custom-button bg-info text-white mt-5"
                            >
                              Save
                            </button>
                          </div>
                          
                          <div className="modal-footer">
                            {/* <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button> */}
                           
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end pr-3  mt-5">
                <div>
                  <button
                    className="custom-button btn-sm-2 btn-info text-white"
                    type="button"
                    data-toggle="modal"
                    data-target="#exampleModal"
                  >
                    Add
                  </button>
                  <div
                    className="modal fade background-model"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog ">
                      <div className="modal-content background-body">
                        <div className="modal-header mb-3 ">
                          <h5
                            className="phone-book-heading"
                            id="exampleModalLabel"
                          >
                            Contacts
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <form method="POST" onSubmit={handleSubmit}>
                          <div className="modal-body">
                            <input
                              required
                              type="text"
                              className="enter-input"
                              placeholder="Name.."
                              name="name"
                              value={formData.name}
                              onChange={handleSubmitChange}
                            ></input>
                            
                            <input
                              name="phone"
                              onKeyDown={handleKeypress}
                              onChange={handleSubmitChange}
                              type="tel"
                              value={formData.phone}
                              pattern="[0-9]+"
                              minLength={10}
                              maxLength={10}
                              className="enter-input"
                              placeholder="phonenumber.."
                              required
                            ></input>
                            <input
                              required
                              type="tel"
                              className="enter-input"
                              placeholder="Adhar.."
                              name="Adhar_no"
                              minLength={12}
                              maxLength={12}
                              onKeyDown={handleKeypress}
                              value={formData.Adhar_no}
                              onChange={handleSubmitChange}
                            ></input>
                            <input
                              required
                              type="date"
                              className="enter-input"
                              placeholder="D_o_B.."
                              name="Dateofbirth"
                              value={formData.Dateofbirth}
                              onChange={handleSubmitChange}
                            ></input>
                            <input
                              required
                              type="string"
                              className="enter-input"
                              placeholder="img.."
                              name="imageurl"
                              value={formData.imageurl}
                              onChange={handleSubmitChange}
                            ></input>
                            <button
                              type="submit"
                              className="custom-button bg-info text-white mt-5"
                            >
                              Save
                            </button>
                          </div>

                          <div className="modal-footer">
                            {/* <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button> */}
                            
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {/* <button className="custom-button btn-sm-2 btn-dark text-white">
                    Delete
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
