https://www.census.gov/geo/partnerships/pvs/partnership24v2/st36_ny.html
DATA
https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2020&layergroup=ZIP+Code+Tabulation+Areas

https://gdal.org/en/stable/programs/ogr2ogr.html
`ogr2ogr -t_srs EPSG:4326 admins.geojson PVS_24_v2_unsd_36.shp`
https://github.com/felt/tippecanoe
`tippecanoe -o admins.pmtiles --force -l data admins.geojson -y NAME -y SDLEA`

