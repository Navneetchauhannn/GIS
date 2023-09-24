import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import img from './container.png';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 22.741726,
  lng: 69.683151
};

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDeyTA0b_vI5ESomNvn-FQOjZqXeMX_rSY",
    libraries: ["geometry"],
  })

  function getRedShade(number) {
    if (number === 0) {
      return 'rgb(0, 0, 0)'; // No shade
    }
    else if (number < 1 || number > 5) {
      throw new Error('Invalid number. Please provide a number between 1 and 5.');
    }
    // Calculate the shade value based on the number
    var shadeValue = 255 - (number - 1) * 50;
    // Construct the color string
    var color = 'rgb(' + shadeValue + ', 0, 0)';
    return color;
  }

  return isLoaded ? (
    <GoogleMap
      zoom={10}
      mapContainerStyle={containerStyle}
      onLoad={map => {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        // map.data.loadGeoJson('grid.json');
        let dataObject = [];
        let gridWiseData = [];

        const fetchData = (callback) => {
          axios.get("http://localhost:5000/gridwisedata")
            .then(res => {
              gridWiseData = res.data;
              console.log(res.data);
              callback(gridWiseData); // Call the callback with the fetched data
            })
            .catch(err => {
              console.log(err);
              callback(null, err); // Call the callback with an error
            });
        };
        fetchData((data, error) => {
          if (error) {
            // Handle error
            console.log("Error:", error);
          } else {
            console.log("Hi")
            if(gridWiseData.length===0){
              return;
            }
            let id = gridWiseData[0].grid_id;
            console.log(gridWiseData)

            // for (let i = 0; i <= gridWiseData.length; i++) {
            //   if (i != gridWiseData.length && gridWiseData[i].grid_id == id) {
            //     dataObject.push(gridWiseData[i]);
            //   } else {
            //     let triangleCoords = [
            //       {
            //         lng: gridWiseData[i - 1].coordinates.coordinates[0][0][0],
            //         lat: gridWiseData[i - 1].coordinates.coordinates[0][0][1],
            //       },
            //       {
            //         lng: gridWiseData[i - 1].coordinates.coordinates[0][1][0],
            //         lat: gridWiseData[i - 1].coordinates.coordinates[0][1][1],
            //       },
            //       {
            //         lng: gridWiseData[i - 1].coordinates.coordinates[0][2][0],
            //         lat: gridWiseData[i - 1].coordinates.coordinates[0][2][1],
            //       },
            //       {
            //         lng: gridWiseData[i - 1].coordinates.coordinates[0][3][0],
            //         lat: gridWiseData[i - 1].coordinates.coordinates[0][3][1],
            //       },
            //       {
            //         lng: gridWiseData[i - 1].coordinates.coordinates[0][4][0],
            //         lat: gridWiseData[i - 1].coordinates.coordinates[0][4][1],
            //       },
            //     ];

            //     // const img = "https://wlius.com/wp-content/uploads/elementor/thumbs/asset-tracking-US-site-1-ozc16lvu8t9a7qw5zhk3bp2n0rxy9w7jimz5wczlbg.jpg";

            //     var icon = {
            //       url: img, // url
            //       scaledSize: new window.google.maps.Size(70, 50), // size
            //       origin: new window.google.maps.Point(0,0), // origin
            //       anchor: new window.google.maps.Point(10, 10) // anchor 
            //   };

            //   let content = "";
            //     dataObject.forEach(element => {
            //       content += `${element.container_code}<br/>`
            //     })

            //     let bermudaTriangle = new window.google.maps.Marker({
            //       // paths: triangleCoords,
            //       // strokeColor: 'black',
            //       // strokeOpacity: 0.8,
            //       // strokeWeight: 2,
            //       // fillColor: getRedShade(dataObject.length),
            //       // fillOpacity: 1,
            //       position:new window.google.maps.LatLng({
            //         lat:gridWiseData[i - 1].coordinates.coordinates[0][4][1],
            //         lng:gridWiseData[i - 1].coordinates.coordinates[0][4][0]}),
            //       map:map,
            //       icon:icon,
            //       label:{text:"helo", color:'white'}
            //     });

            //     // bermudaTriangle.addListener('click', function (event) {
            //       var infoWindow = new window.google.maps.InfoWindow({
            //         content: content,
            //       })
            //       infoWindow.setPosition(new window.google.maps.LatLng({
            //         lat:gridWiseData[i - 1].coordinates.coordinates[0][4][1],
            //         lng:gridWiseData[i - 1].coordinates.coordinates[0][4][0]}));
            //       infoWindow.open(map);
            //     // });
            //     bermudaTriangle.setMap(map);
            //     dataObject=[];
            //     dataObject.push(gridWiseData[i]);
            //     if(i!=gridWiseData.length) {
            //       id=gridWiseData[i].grid_id;
            //     }
            //   }
            // }
          }
        });
      }}
      onUnmount={map => {
        // do your stuff before map is unmounted
      }}
    />
  ) : <></>
}

export default React.memo(Map)