https://www.census.gov/geo/partnerships/pvs/partnership24v2/st36_ny.html

`ogr2ogr -t_srs EPSG:4326 admins.geojson PVS_24_v2_unsd_36.shp`

`tippecanoe -o admins.pmtiles --force -l data admins.geojson -y NAME -y SDLEA`

