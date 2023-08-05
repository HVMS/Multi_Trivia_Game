import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import '../../App.css';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Carousel, Col, Row } from 'react-bootstrap';
import { BsChevronLeft, BsChevronRight, BsFill1SquareFill, BsFillPencilFill } from 'react-icons/bs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../services/utils';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
interface Team {
    wins: string;
    members: any[];
    name: string;
    games: string;
    losses: string;
}
interface userdata {
    name: string,
    email: string,
    contact: string,
    games: string,
    wins: string,
    losses: string,
    points: string,
    teams: Team[],
    profile: string
}
interface comparedata {
    email: string;
    contact: string;
    name: string;
    games: string;
    points: string;
    wins: string;
    losses: string;
    teams: string[];
}

function Profile() {
    const navigate=useNavigate();
    const userDataStore = useSelector(selectUser);
    // const userID = "daniella@gmail.com";
    const userID = userDataStore.email;
    const [user, setuser] = useState<userdata | null>(null);
    const [comp, setcomp] = useState<comparedata[]>([]);
    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const contactRef = useRef<HTMLInputElement | null>(null);
    const picRef = useRef<HTMLInputElement | null>(null);
  
    const handleUpdate = () => {
      const formData = new FormData();
      formData.append('name', nameRef.current?.value || '');
      formData.append('email', emailRef.current?.value || '');
      formData.append('contact', contactRef.current?.value || '');
      formData.append('pic', picRef.current?.files?.[0] || '');
  
      axios.post('https://us-east1-celtic-origin-387216.cloudfunctions.net/editDetails', formData)
        .then((response) => {
          alert(response.data);
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
      window.location.reload();
    }
    useEffect(() => {
        axios.post("https://us-east1-celtic-origin-387216.cloudfunctions.net/userDetails", { email: userID })
            .then((resp) => {
                setuser(resp.data);
                axios.post("https://us-east1-celtic-origin-387216.cloudfunctions.net/comparePlayers", { email: userID })
                    .then((resp) => {
                        console.log("data received")
                        setcomp(resp.data);
                        console.log(typeof(user?.profile))
                    })
                    .catch((error) => {
                        console.log("Error fetching comparison data:", error);
                    });
            })
            .catch((error) => {
                console.log("Error fetching user data:", error);
            });

    }, []);

    const handleLB=()=>{
           navigate('/leaderboard');
    }
    return (
        <div className="App">
            <br />
            <br />
            <h2>Hi {user?.name}</h2>
            <br />
            <br />
            <Row>
                <Col>
                    <Card style={{ width: '20rem', marginLeft: "3rem" }}>
                        <Card.Title>Statistics</Card.Title>
                        <Card.Body>
                            <div className="container customer-profile my-4">
                                <div className="row mb-2 profile-item">
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">Games Played : {user?.games}</h4>
                                        <hr></hr>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">W/L : {user?.wins} / {user?.losses}</h4>
                                        <hr></hr>
                                    </div>
                                </div>
                                <div className="row mb-2 profile-item">
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">Points : {user?.points}</h4>
                                        <hr></hr>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="d-inline"></h4>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{ width: '30rem', marginLeft: "0.5rem" }}>
                        <Card.Title>User Profile</Card.Title>
                        <br />
                        <div className='image-container'>
                        {user?.profile && <Card.Img src={user.profile} alt="Image" className="rounded-circle" />}
                            <label htmlFor="file-input" className="custom-file-upload">
                                <span><BsFillPencilFill /></span>
                                <input id="file-input" type="file" name ="filepic" ref={picRef}/>
                                
                            </label>

                        </div>
                        <p id="message" style={{"display": "block", "marginTop":"2rem"}}>Click update after upload to save the image.</p>
                        <Card.Body>
                            <div className="container customer-profile my-4">
                                <div className="row mb-2">
                                    <div className="col-lg-12">
                                        <h2 className="d-inline"></h2>
                                    </div>
                                </div>
                                <div className="row mb-2 profile-item">
                                    <div className="col-lg-12">
                                        <h4 className="d-inline"> Name : </h4>
                                        <input type="text" placeholder={user?.name} id="name" ref={nameRef}></input>
                                        <hr></hr>
                                    </div>
                                </div>
                                <div className="row mb-2 profile-item">
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">Email : </h4>
                                        <input type="email" placeholder={user?.email} id="email" disabled ref={emailRef} value={user?.email}></input>
                                        <hr></hr>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="d-inline"></h4>
                                    </div>
                                </div>
                                <div className="row mb-2 profile-item">
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">Contact : </h4>
                                        <input type="text" placeholder={user?.contact} id="contact" ref={contactRef}></input>
                                        <hr></hr>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="d-inline"></h4>
                                    </div>
                                </div>


                            </div>
                            <Button variant="primary" onClick={handleUpdate}>Update</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Carousel
                        prevIcon={<div className="carousel-icon"><BsChevronLeft /></div>}
                        nextIcon={<div className="carousel-icon"><BsChevronRight /></div>}
                    >
                        {user?.teams.map((team) => <Carousel.Item>
                            <Card style={{ width: '20rem', marginLeft: "6.5rem" }}>
                                <Card.Title>Team Affiliations</Card.Title>
                                <Card.Body>
                                    <div className="container customer-profile my-4">
                                        <div className="row mb-2 profile-item">
                                            <div className="col-lg-12">
                                                <h4 className="d-inline">Name : {team.name}</h4>
                                                <hr></hr>
                                            </div>
                                            <div className="col-lg-12">
                                                <h4 className="d-inline"></h4>
                                            </div>
                                        </div>
                                        <div className="row mb-2 profile-item">
                                            <div className="col-lg-12">
                                                <h4 className="d-inline">Members: <br /> {team.members.map((member) => <>{member} <br /></>)}</h4>
                                                <hr></hr>
                                            </div>
                                            <div className="col-lg-12">
                                                <h4 className="d-inline"></h4>
                                            </div>
                                        </div>
                                        <div className="row mb-2 profile-item">
                                            <div className="col-lg-12">
                                                <h4 className="d-inline">Games: {team.games}</h4>
                                                <hr></hr>
                                            </div>
                                            <div className="col-lg-12">
                                                <h4 className="d-inline"></h4>
                                            </div>
                                        </div>
                                        <div className="row mb-2 profile-item">
                                            <div className="col-lg-12">
                                                <h4 className="d-inline">W/L : {team.wins} / {team.losses}</h4>
                                                <hr></hr>
                                            </div>
                                        </div>


                                    </div>
                                </Card.Body>
                            </Card>
                        </Carousel.Item>)}
                    </Carousel>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <Carousel
                        prevIcon={<div className="carousel-icon"><BsChevronLeft /></div>}
                        nextIcon={<div className="carousel-icon"><BsChevronRight /></div>}
                    >
                        {comp.map((rival) =>
                            <Carousel.Item>
                                <Card style={{ width: '80rem', marginLeft: "6.5rem" }}>
                                    <Card.Title>Comparisons</Card.Title>
                                    <Card.Body>
                                        <div className="container customer-profile my-4">
                                            <div className="row mb-2 profile-item">
                                                <div className="col-lg-12">
                                                    <h4 className="d-inline">You vs {rival.name}</h4>
                                                    <hr></hr>
                                                </div>
                                                <div className="col-lg-12">
                                                    <h4 className="d-inline"></h4>
                                                </div>
                                            </div>
                                            <div className="row mb-2 profile-item">
                                                <div className="col-lg-12">
                                                    <h4 className="d-inline">Games : {user?.games} vs {rival.games} | </h4>
                                                    <h4 className="d-inline">W/L : {user?.wins} / {rival.wins} vs {user?.losses} / {rival.losses} | </h4>
                                                    <h4 className="d-inline">Points : {user?.points} vs {rival.points}</h4>
                                                </div>
                                            </div>


                                        </div>
                                    </Card.Body>
                                </Card>
                            </Carousel.Item>
                        )}
                    </Carousel>
                </Col>
            </Row>
            <br />
        </div>
    );
}

export default Profile;
