
        for (let i = 0; i < containerData.length; i++) {
          let latLng = new window.google.maps.LatLng(containerData[i].lat, containerData[i].lng);
          for (let j = 0; j < grid.length; j++) {
            let triangleCoords = [
              {
                lng: grid[j].coordinates[0][0][0],
                lat: grid[j].coordinates[0][0][1],
              },
              {
                lng: grid[j].coordinates[0][1][0],
                lat: grid[j].coordinates[0][1][1],
              },
              {
                lng: grid[j].coordinates[0][2][0],
                lat: grid[j].coordinates[0][2][1],
              },
              {
                lng: grid[j].coordinates[0][3][0],
                lat: grid[j].coordinates[0][3][1],
              },
              {
                lng: grid[j].coordinates[0][4][0],
                lat: grid[j].coordinates[0][4][1],
              },
            ];

            
            let bermudaTriangle = new window.google.maps.Polygon({
              paths: triangleCoords,
              strokeColor: grid[j].stack ? 'red' : 'white',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: grid[j].stack ? getRedShade(grid[j].stack.length) : 'white',
              fillOpacity: 1,
            });


            bermudaTriangle.addListener('click', function (event) {
              // Handle the click event here
              console.log('Polygon clicked!', grid[j].stack.length);

              // For example, you can open an info window at the clicked location
              var infoWindow = new window.google.maps.InfoWindow({
                content: `${grid[j].stack.length}`,
              });

              infoWindow.setPosition(event.latLng);
              infoWindow.open(map);
            });

            if (window.google.maps.geometry.poly.containsLocation(latLng, bermudaTriangle)) {
              if(!grid[j].stack.includes(containerData[i].container_id)) {
                // updateGrid(grid[j].id, containerData[i].container_id);
              }
              bermudaTriangle.setMap(map);
            }
          }
        }
        var infoWindow = new window.google.maps.InfoWindow();
        map.data.addListener('click', function (event) {
          console.log(event.feature.getGeometry());
          var id = event.feature.getProperty('stack');
          // Set the content for the info window
          var content = '<h3>' + "Hello" + '</h3>';

          // Set the position and content of the info window
          infoWindow.setPosition(event.latLng);
          infoWindow.setContent(content);

          // Open the info window
          infoWindow.open(map);
        });
