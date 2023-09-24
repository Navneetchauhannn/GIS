import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Swal from "sweetalert2";
import { useAppStore } from '../../appStore';
import axios from 'axios';

export default function AddContainers({ closeEvent }) {
    const [tagid, setTagid] = useState("");
    const [indate, setIndate] = useState("");
    const [containersize, setContainersize] = useState("");
    const [container_code, setCode] = useState("");
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const setRows = useAppStore((state) => state.setRows);
    const [grid, setGrid] = useState([]);


    const handleSubmit = async () => {
        // await addDoc(empCollectionRef, {
        //     contanierID: containerid,
        //     tagID: tagid,
        //     inDate: indate,
        //     size: containersize
        // });
        // getContainers();
        // closeEvent();

        let grid_id=null;
        grid.forEach(element => {
            // Define the polygon coordinates
            const coordinates = JSON.parse(element.coordinates);
            const polygonCoords = [
                { lat: coordinates.coordinates[0][0][1], lng: coordinates.coordinates[0][0][0] },
                { lat: coordinates.coordinates[0][1][1], lng: coordinates.coordinates[0][1][0] },
                { lat: coordinates.coordinates[0][2][1], lng: coordinates.coordinates[0][2][0] },
                { lat: coordinates.coordinates[0][3][1], lng: coordinates.coordinates[0][3][0] },
                { lat: coordinates.coordinates[0][4][1], lng: coordinates.coordinates[0][4][0] },
            ];

            // Define the point you want to check
            const pointToCheck = { lat: lat, lng: lng };
            const isInsidePolygon = isPointInsidePolygon(pointToCheck, polygonCoords);

            if(isInsidePolygon) {
                grid_id=element.grid_id;
            }
        });

        if (grid_id!=null) {
            //update container
            addContainer();
            addtoGrid(grid_id);
            console.log("added upadated");
        } else {
            // add container
            addContainer();
            console.log("added");
        }

        
        getContainers();
        closeEvent();

        Swal.fire("Submitted!", "Your record has been submitted,", "success");
    }

    const addContainer = async () =>{
        try {
            await axios.post("http://localhost:5000/addContainers", {
                tag_id: tagid,
                size: containersize,
                status:"inside",
                lat: lat,
                lng:lng,
                container_code:container_code,
                alt:0,
                in_date: indate,
                last_dropoff_time: "2023-08-08 23:59:59.499999",
            })
        } catch (err) {
            console.log(err);
        }
    }

    const addtoGrid = async (grid_id) =>{
        try {
            await axios.post("http://localhost:5000/AddToGrid", {
                container_code: container_code,
                grid_id:grid_id,
                newLat:lat,
                newLng:lng,
            })
            console.log("inserted");
        } catch (err) {
            console.log(err);
        }
    }

    const getContainers = async () => {
        setRows([]);
        try {
            const res = await axios.get("http://localhost:5000/getContainers")
            setRows(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getGrids = async () => {
        try {
            const res = await axios.get("http://localhost:5000/getGrids")
            setGrid(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    function isPointInsidePolygon(point, polygonCoords) {
        const x = point.lng;
        const y = point.lat;

        let isInside = false;

        for (let i = 0, j = polygonCoords.length - 1; i < polygonCoords.length; j = i++) {
            const xi = polygonCoords[i].lng;
            const yi = polygonCoords[i].lat;
            const xj = polygonCoords[j].lng;
            const yj = polygonCoords[j].lat;

            const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

            if (intersect) {
                isInside = !isInside;
            }
        }

        return isInside;
    }

    // Use the custom isPointInsidePolygon function to check if the point is inside the polygon
    // const isInsidePolygon = isPointInsidePolygon(pointToCheck, polygonCoords);

    // if (isInsidePolygon) {
    //     console.log('Point is inside the polygon');
    // } else {
    //     console.log('Point is outside the polygon');
    // }

    // const importExcel = (e) => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader();
    //     reader.onLoad = (e) =>{
    //         const binaryStr= e.target.result;
    //         const workBook = XLSX.read(binaryStr, {type:"binary"});

    //         const workBookSheetName = workBook.SheetNames[0];
    //         const workSheet = workBook.Sheets[workBookSheetName];

    //         const fileData2 =  XLSX.utils.sheet_to_json(workSheet, {header:1});
    //         console.log(fileData2);
    //     }
    //     reader.readAsBinaryString(file)
    // }


    useEffect(()=>{
        getGrids();
    },[])

    return (
        <>
            <Box sx={{ m: 2 }} />
            <Typography variant='h5' align='center'>
                Add Containers
            </Typography>
            <IconButton
                style={{ position: "absolute", top: "0", right: "0" }}
                onClick={closeEvent}
            >
                <CloseIcon />
            </IconButton>
            <Box height={20} />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField id="outlined-basic" label="Container Code" value={container_code} onChange={(e) => { setCode(e.target.value) }} variant="outlined" size='small' sx={{ minWidth: "100%" }} />
                </Grid>
                <Grid item xs={6}>
                    <TextField id="outlined-basic" label="Tag id" variant="outlined" value={tagid} onChange={(e) => { setTagid(e.target.value) }} size='small' sx={{ minWidth: "100%" }} />
                </Grid>
                <Grid item xs={6}>
                    <TextField id="outlined-basic" label="In date" variant="outlined" value={indate} onChange={(e) => { setIndate(e.target.value) }} size='small' sx={{ minWidth: "100%" }} />
                </Grid>
                <Grid item xs={6}>
                    <TextField id="outlined-basic" label="Size" variant="outlined" value={containersize} onChange={(e) => { setContainersize(e.target.value) }} size='small' sx={{ minWidth: "100%" }} />
                </Grid>
                <Grid item xs={6}>
                    <TextField type='number' id="outlined-basic" label="lat" variant="outlined" value={lat} onChange={(e) => { setLat(e.target.value) }} size='small' sx={{ minWidth: "100%" }} />
                </Grid>
                <Grid item xs={6}>
                    <TextField type='number' id="outlined-basic" label="lng" variant="outlined" value={lng} onChange={(e) => { setLng(e.target.value) }} size='small' sx={{ minWidth: "100%" }} />
                </Grid>
                {/* <Grid item xs={12}>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload File
                        <input
                            type="file"
                            hidden
                            onChange={()=>importExcel()}
                            accept='csv'
                        />
                    </Button>
                </Grid> */}
                <Grid item xs={12}>
                    <Typography variant='h5' align='center'>
                        <Button variant='contained' onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Typography>
                </Grid>
            </Grid>

            <Box sx={{ m: 4 }} />
        </>
    )
}
