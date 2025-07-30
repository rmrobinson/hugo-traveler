---
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}'
summary: "<brief summary of this trip>"
header_image_path: "<url to image showing for this trip>"
map:
  lat: "<latitude of map centre>"
  lon: "<longitude of map centre>"
  zoom: "<zoom level of map>"
trip:
  start_date: '{{ time.Now.Format "2006-01-02" }}'
  end_date: '{{ time.Now.Format "2006-01-02" }}'
  visited_labels:
    - "<country code visited. if >1 country visited, repeat on further lines>"
  places:
    - id: <unique ID of a place visited on this trip>
      lat: <latitude>
      lon: <longitude>
      desc: "<optional description of this place to show on the map>"
      image_url: "<url to the image to show for this place on the map>"
---